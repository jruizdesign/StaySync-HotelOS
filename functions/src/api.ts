import express, { Response, NextFunction } from 'express';
import cors from 'cors';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';
import { globalPrisma, getTenantClient } from './lib/db.js';



// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}

// Admin initialized in index.ts, but we access it here
const db = admin.firestore();
const prisma = globalPrisma;

const app = express();
app.use(cors({ origin: true })); // Cloud Functions handle CORS slightly differently, origin: true is often safest for public APIs

// --- MIDDLEWARE: THE BOUNCER ---
const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).send('Missing Token');
        return;
    }

    try {
        // 1. Verify the User
        const decoded = await admin.auth().verifyIdToken(token);

        // 2. Extract Tenancy ID
        req.user = {
            uid: decoded.uid,
            hotelId: decoded.propertyId || decoded.hotelId,
            role: decoded.role || 'STAFF'
        };
        next();
    } catch (e) {
        res.status(403).send('Invalid Token');
    }
};

const requireAdmin = (req: any, res: Response, next: NextFunction) => {
    if (req.user.role !== 'ADMIN') {
        res.status(403).json({ error: 'Access Denied: Admin Only' });
        return;
    }
    next();
};

// Health Check
app.get('/health', (req, res) => res.json({ status: 'ok', mode: 'serverless' }));

// --- ROUTES ---

// 1. CREATE BOOKING
app.post('/bookings', authMiddleware, async (req: any, res: any) => {
    const { hotelId: tokenHotelId } = req.user;
    const { roomId, roomNumber, guestName, checkIn, checkOut, propertyId: bodyPropertyId, guestId } = req.body;

    const hotelId = tokenHotelId || bodyPropertyId;
    if (!hotelId) return res.status(400).json({ error: 'Property ID required' });

    try {
        const booking = await prisma.$transaction(async (tx) => {
            let room;
            if (roomNumber) {
                room = await tx.room.findFirst({
                    where: {
                        roomNumber: roomNumber,
                        propertyId: hotelId
                    }
                });
            } else {
                room = await tx.room.findFirst({
                    where: {
                        id: roomId,
                        propertyId: hotelId
                    }
                });
            }

            if (!room) throw new Error(`Room not found: ${roomNumber || roomId}`);

            return await tx.booking.create({
                data: {
                    propertyId: hotelId,
                    roomId: room.id,
                    guestName,
                    guestId: guestId || undefined,
                    checkInDate: new Date(checkIn),
                    checkOutDate: new Date(checkOut),
                    status: 'Confirmed',
                }
            });
        });

        if (booking.roomId) {
            try {
                await db.collection('hotels').doc(String(hotelId))
                    .collection('rooms').doc(String(booking.roomId))
                    .set({
                        status: 'OCCUPIED',
                        guestName: guestName,
                        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
                    }, { merge: true });
            } catch (err) {
                console.warn("Firestore sync failed", err);
            }
        }

        res.json({ success: true, id: booking.id });
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// 2. CREATE PROPERTY
app.post('/properties', authMiddleware, async (req: any, res: any) => {
    const { name, address } = req.body;
    const uid = req.user.uid;

    try {
        let userEmail = '';
        let userName = 'Property Owner';

        try {
            const userRecord = await admin.auth().getUser(uid);
            userEmail = userRecord.email || '';
            userName = userRecord.displayName || 'Property Owner';
        } catch (err) {
            console.warn("Could not fetch user details from Firebase", err);
        }

        const property = await prisma.property.create({
            data: {
                name,
                address,
                users: {
                    connectOrCreate: {
                        where: { id: uid },
                        create: {
                            id: uid,
                            email: userEmail,
                            name: userName,
                            role: 'MANAGER'
                        }
                    }
                }
            }
        });

        res.json({ success: true, property });
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// 2b. UPDATE PROPERTY
app.put('/properties/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name, address, email, phoneNumber } = req.body;

    try {
        const property = await prisma.property.update({
            where: { id },
            data: { name, address, email, phoneNumber }
        });
        res.json({ success: true, property });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// 3. CREATE ROOM
app.post('/rooms', authMiddleware, async (req: any, res: any) => {
    const { hotelId: tokenHotelId } = req.user;
    const { propertyId, roomNumber, roomType, price, floor, capacity } = req.body;

    const targetPropertyId = tokenHotelId || propertyId;
    if (!targetPropertyId) return res.status(400).json({ error: 'Property ID required' });

    try {
        const room = await prisma.room.create({
            data: {
                propertyId: targetPropertyId,
                roomNumber,
                roomType,
                floor,
                price,
                capacity,
                status: 'AVAILABLE'
            }
        });

        res.json({ success: true, room });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// 3.5. LIST USERS (Admin)
app.get('/users', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: { property: true },
            orderBy: { name: 'asc' }
        });
        res.json({ users });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// 3.6. GET DB SCHEMA (Admin)
app.get('/admin/schema', authMiddleware, requireAdmin, async (req, res) => {
    try {
        // Path handling needs care in Cloud Functions. 
        // We'll try to find it relative to 'lib' or verify where it lands in build.
        // Usually, non-code files are not included unless configured.
        // For now, returning a hardcoded message or try-catch.
        // Better yet, just don't crash.
        const possiblePaths = [
            path.join(__dirname, '../../prisma/schema.prisma'),
            path.join(process.cwd(), 'prisma/schema.prisma')
        ];

        let schema = '// Schema not found in serverless environment';
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                schema = fs.readFileSync(p, 'utf8');
                break;
            }
        }
        res.json({ schema });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// 4. CREATE USER (Staff/Manager)
app.post('/users', authMiddleware, async (req: any, res: any) => {
    const { hotelId: tokenHotelId } = req.user;
    const { email, password, name, role, propertyId: bodyPropertyId } = req.body;

    const targetPropertyId = tokenHotelId || bodyPropertyId;
    if (!targetPropertyId) return res.status(400).json({ error: 'Property ID required' });

    try {
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: name,
        });

        await admin.auth().setCustomUserClaims(userRecord.uid, {
            hotelId: targetPropertyId,
            role: role || 'STAFF'
        });

        const user = await prisma.user.create({
            data: {
                id: userRecord.uid,
                email,
                name,
                role: role || 'STAFF',
                property: { connect: { id: targetPropertyId } }
            }
        });

        res.json({ success: true, user });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// 5. UPDATE ROOM
app.put('/rooms/:id', authMiddleware, async (req: any, res: any) => {
    const { hotelId } = req.user;
    const { id } = req.params;
    const { status, type, floor, price } = req.body;

    try {
        const room = await prisma.room.update({
            where: { id: id },
            data: { status, roomType: type, floor, price }
        });

        if (room.propertyId === hotelId) {
            await db.collection('hotels').doc(String(hotelId))
                .collection('rooms').doc(String(id))
                .set({
                    status: status,
                    lastUpdated: admin.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
        }

        res.json({ success: true, room });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// 6. GET PROPERTIES (List)
app.get('/properties', authMiddleware, async (req: any, res: any) => {
    const { uid } = req.user;
    try {
        const user = await prisma.user.findUnique({
            where: { id: uid },
            include: { property: true }
        });
        const properties = user?.property ? [user.property] : [];
        res.json({ properties });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// 7. GET DASHBOARD
app.get('/properties/:id/dashboard', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const property = await prisma.property.findUnique({ where: { id } });
        if (!property) {
            res.status(404).json({ error: 'Property not found' });
            return;
        }

        const rooms = await prisma.room.findMany({ where: { propertyId: id } });
        const bookings = await prisma.booking.findMany({
            where: { propertyId: id },
            include: { room: true }
        });
        const users = await prisma.user.findMany({ where: { propertyId: id } });

        res.json({ property, rooms, bookings, users });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// 8. GET USER (Me)
app.get('/users/:uid', authMiddleware, async (req, res) => {
    const { uid } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { id: uid },
            include: { property: true }
        });
        const defaultPropertyId = user?.property?.id || null;
        res.json({ ...user, defaultPropertyId });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// 9. MAINTENANCE
app.get('/maintenance', authMiddleware, async (req, res) => {
    const { propertyId } = req.query;
    if (!propertyId) {
        res.status(400).json({ error: 'Property ID required' });
        return;
    }
    try {
        const tasks = await prisma.maintenanceRequest.findMany({
            where: { propertyId: String(propertyId) },
            orderBy: { reportedDate: 'desc' },
            include: { assignedTo: true, reporter: true }
        });
        res.json({ tasks });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/maintenance', authMiddleware, async (req: any, res: any) => {
    const { propertyId, description, priority, roomNumber, assignedToId } = req.body;
    try {
        const task = await prisma.maintenanceRequest.create({
            data: {
                propertyId,
                description,
                priority,
                roomNumber,
                assignedToId,
                reporterId: req.user.uid,
                status: 'Pending'
            }
        });

        await db.collection('hotels').doc(propertyId).collection('maintenance_events').add({
            type: 'NEW_TASK',
            taskId: task.id,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({ success: true, task });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

app.put('/maintenance/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { status, cost, assignedToId, completedDate } = req.body;
    try {
        const task = await prisma.maintenanceRequest.update({
            where: { id },
            data: { status, cost, assignedToId, completedDate: completedDate ? new Date(completedDate) : undefined }
        });

        await db.collection('hotels').doc(task.propertyId).collection('maintenance_events').add({
            type: 'UPDATE_TASK',
            taskId: task.id,
            status: status,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({ success: true, task });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// 10. USER EDIT
app.put('/users/:id', authMiddleware, async (req: any, res: any) => {
    const { id } = req.params;
    const { name, email, role, pin, status, propertyId } = req.body;

    try {
        const dbClient = getTenantClient(req.user, propertyId);
        const updatedUser = await dbClient.user.update({
            where: { id },
            data: { name, email, role, pin, status }
        });

        if (role) {
            try {
                await admin.auth().setCustomUserClaims(id, { role, propertyId: updatedUser.propertyId });
            } catch (authErr) {
                console.warn("Failed to update Firebase Claims", authErr);
            }
        }
        res.json({ success: true, user: updatedUser });
    } catch (e: any) {
        res.status(500).json({ error: "Failed to update user." });
    }
});

// 10. GUESTS
app.get('/guests', authMiddleware, async (req: any, res: any) => {
    try {
        const { searchQuery, isDNR, propertyId } = req.query;
        const dbClient = getTenantClient(req.user, propertyId as string);

        const where: any = {};
        if (searchQuery) {
            where.OR = [
                { name: { contains: String(searchQuery), mode: 'insensitive' } },
                { email: { contains: String(searchQuery), mode: 'insensitive' } },
                { phoneNumber: { contains: String(searchQuery), mode: 'insensitive' } },
                { idNumber: { contains: String(searchQuery), mode: 'insensitive' } }
            ];
        }
        if (isDNR) where.isDNR = isDNR === 'true';

        const guests = await dbClient.guest.findMany({
            where,
            orderBy: { updatedAt: 'desc' },
            take: 50,
            include: { _count: { select: { bookings: true } } }
        });
        res.json({ guests });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/guests/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const guest = await prisma.guest.findUnique({
            where: { id },
            include: {
                bookings: { include: { room: true }, orderBy: { checkInDate: 'desc' } },
                notes: { orderBy: { createdAt: 'desc' } },
                invoices: { include: { payments: true } },
                documents: { orderBy: { uploadDate: 'desc' } }
            }
        });
        if (!guest) {
            res.status(404).json({ error: 'Guest not found' });
            return;
        }
        res.json({ guest });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/guests', authMiddleware, async (req, res) => {
    const { email, name, phoneNumber, address, idNumber, status, isDNR, dnrReason, photoUrl } = req.body;
    try {
        const guest = await prisma.guest.upsert({
            where: { email },
            update: { name, phoneNumber, address, idNumber, status, isDNR: Boolean(isDNR), dnrReason, photoUrl },
            create: { email, name, phoneNumber, address, idNumber, status, isDNR: Boolean(isDNR), dnrReason, photoUrl }
        });
        res.json({ success: true, guest });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

app.put('/guests/:id', authMiddleware, async (req: any, res: any) => {
    const { id } = req.params;
    const { name, email, phoneNumber, address, idNumber, status, isDNR, dnrReason, propertyId } = req.body;
    try {
        const dbClient = getTenantClient(req.user, propertyId);
        const guest = await dbClient.guest.update({
            where: { id },
            data: { name, email, phoneNumber, address, idNumber, status, isDNR: isDNR !== undefined ? Boolean(isDNR) : undefined, dnrReason }
        });
        res.json({ success: true, guest });
    } catch (e: any) {
        res.status(500).json({ error: "Failed to update guest" });
    }
});

app.post('/guests/:id/documents', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { fileName, fileUrl, type, amount } = req.body;
    try {
        const doc = await prisma.guestDocument.create({
            data: { guestId: id, fileName, fileUrl, type, amount: amount ? Number(amount) : null }
        });
        res.json({ success: true, document: doc });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/guests/:id/invoices', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { amount, bookingId } = req.body;
    try {
        const invoice = await prisma.invoice.create({
            data: {
                guestId: id,
                bookingId: bookingId || null,
                totalAmount: Number(amount) || 0,
                status: 'PENDING',
                generatedAt: new Date()
            }
        });
        res.json({ success: true, invoice });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// 11. FEATURES
app.get('/features', authMiddleware, async (req, res) => {
    try {
        const requests = await prisma.featureRequest.findMany({
            orderBy: { votes: 'desc' },
            include: { requester: true }
        });
        res.json({ requests });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/features', authMiddleware, async (req: any, res: any) => {
    const { title, description, priority } = req.body;
    try {
        const reqItem = await prisma.featureRequest.create({
            data: { title, description, priority, requesterId: req.user.uid }
        });
        await db.collection('global').doc('features').collection('events').add({
            type: 'NEW_FEATURE',
            featureId: reqItem.id,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
        res.json({ success: true, request: reqItem });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// Export the app for Cloud Functions
export const apiApp = app;
