import express from 'express';
import { PrismaClient } from './src/generated/prisma/index.js';
import admin from 'firebase-admin';
import cors from 'cors';
import { createRequire } from 'module';

import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;
import { PrismaPg } from '@prisma/adapter-pg';

const require = createRequire(import.meta.url);
const serviceAccount = require('./service-account.json');

// --- INIT ---
const app = express();
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

app.use(express.json());
app.use(cors());

// Health Check (Public)
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Initialize Firebase (for Auth check & Firestore Sync)
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

// --- MIDDLEWARE: THE BOUNCER ---
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('Missing Token');

  try {
    // 1. Verify the User
    const decoded = await admin.auth().verifyIdToken(token);

    // 2. Extract Tenancy ID (Set via Custom Claims in Firebase)
    // Assuming you set this claim when you created the user
    req.user = {
      uid: decoded.uid,
      hotelId: decoded.hotelId // <-- CRITICAL SECURITY FIELD
    };
    next();
  } catch (e) {
    res.status(403).send('Invalid Token');
  }
};

// --- ROUTES ---

// 1. CREATE BOOKING (The "Sync" Operation)
// 1. CREATE BOOKING (The "Sync" Operation)
app.post('/api/bookings', authMiddleware, async (req, res) => {
  const { hotelId: tokenHotelId } = req.user;
  const { roomId, roomNumber, guestName, checkIn, checkOut, propertyId: bodyPropertyId } = req.body;

  // Use propertyId from token if available, otherwise from body
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
          checkInDate: new Date(checkIn),
          checkOutDate: new Date(checkOut),
          status: 'Confirmed',
        }
      });
    });

    // Firestore Sync (Optional if SQL is truth)
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
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// 2. CREATE PROPERTY
app.post('/api/properties', authMiddleware, async (req, res) => {
  const { name, address } = req.body;
  const uid = req.user.uid;

  try {
    const property = await prisma.property.create({
      data: {
        name,
        address,
        users: {
          connectOrCreate: {
            where: { id: uid },
            create: { id: uid } // Ensure user exists
          }
        }
      }
    });

    res.json({ success: true, property });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// 2b. UPDATE PROPERTY
app.put('/api/properties/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, address, email, phoneNumber } = req.body;

  // In real app, verify user has permission to update this property
  // e.g. check if req.user.uid is admin or belongs to property

  try {
    const property = await prisma.property.update({
      where: { id },
      data: {
        name,
        address,
        email,
        phoneNumber
      }
    });
    res.json({ success: true, property });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// 3. CREATE ROOM
app.post('/api/rooms', authMiddleware, async (req, res) => {
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
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// 4. CREATE USER (Staff/Manager)
app.post('/api/users', authMiddleware, async (req, res) => {
  const { hotelId: tokenHotelId, role: requesterRole } = req.user; // Note: req.user might not have role yet if middleware doesn't extract it.
  // Middleware update needed if we want role. Currently line 33 server.js only sets uid, hotelId.
  // We'll trust the caller for now or update middleware later. 

  const { email, password, name, role, propertyId: bodyPropertyId } = req.body;

  const targetPropertyId = tokenHotelId || bodyPropertyId;
  if (!targetPropertyId) return res.status(400).json({ error: 'Property ID required' });

  try {
    // A. Create in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // B. Set Custom Claims (Tenancy)
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      hotelId: targetPropertyId,
      role: role || 'STAFF'
    });

    // C. Create in SQL (Prisma)
    const user = await prisma.user.create({
      data: {
        id: userRecord.uid,
        email,
        name,
        role: role || 'STAFF',
        properties: {
          connect: { id: targetPropertyId }
        }
      }
    });

    res.json({ success: true, user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// 5. UPDATE ROOM
app.put('/api/rooms/:id', authMiddleware, async (req, res) => {
  const { hotelId } = req.user;
  const { id } = req.params;
  const { status, type, floor, price } = req.body;

  try {
    const room = await prisma.room.update({
      where: { id: id }, // In real app, verify hotelId ownership too
      data: {
        status,
        roomType: type,
        floor,
        price
      }
    });

    // Sync to Firestore
    if (room.propertyId === hotelId) {
      await db.collection('hotels').doc(String(hotelId))
        .collection('rooms').doc(String(id))
        .set({
          status: status, // e.g. 'AVAILABLE', 'MAINTENANCE'
          lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    }

    res.json({ success: true, room });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// 6. GET PROPERTIES (List)
app.get('/api/properties', authMiddleware, async (req, res) => {
  const { uid } = req.user;
  try {
    // Find properties where the user is a member
    // This depends on your Prisma schema. Assuming Implicit M-N or Explicit.
    // Based on POST /api/users, it seems to be Explicit or Implicit via 'users' relation.
    // Checking schema implicitly from code: property.users.connect
    const properties = await prisma.property.findMany({
      where: {
        users: {
          some: {
            id: uid
          }
        }
      },
      include: {
        rooms: true, // Optional: include counts if needed
        bookings: true
      }
    });
    res.json({ properties });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// 7. GET DASHBOARD (Single Property)
app.get('/api/properties/:id/dashboard', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) return res.status(404).json({ error: 'Property not found' });

    const rooms = await prisma.room.findMany({
      where: { propertyId: id }
    });

    const bookings = await prisma.booking.findMany({
      where: { propertyId: id },
      include: {
        room: true // Include room details for the booking
      }
    });

    res.json({ property, rooms, bookings });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// 8. GET USER (Me)
app.get('/api/users/:uid', authMiddleware, async (req, res) => {
  const { uid } = req.params; // Or use req.user.uid
  try {
    const user = await prisma.user.findUnique({
      where: { id: uid },
      include: {
        properties: true // Include properties they belong to?
      }
    });

    // Return default property ID logic if needed
    let defaultPropertyId = null;
    if (user && user.properties && user.properties.length > 0) {
      defaultPropertyId = user.properties[0].id;
    }

    res.json({ ...user, defaultPropertyId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// --- NEW ENDPOINTS ---

// 9. MAINTENANCE REQUESTS
// GET /api/maintenance?propertyId=...
app.get('/api/maintenance', authMiddleware, async (req, res) => {
  const { propertyId } = req.query;
  if (!propertyId) return res.status(400).json({ error: 'Property ID required' });

  try {
    const tasks = await prisma.maintenanceRequest.findMany({
      where: { propertyId: String(propertyId) },
      orderBy: { reportedDate: 'desc' },
      include: { assignedTo: true, reporter: true }
    });
    res.json({ tasks });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/maintenance
app.post('/api/maintenance', authMiddleware, async (req, res) => {
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

    // Real-time Trigger (Firestore) - Dual Write
    await db.collection('hotels').doc(propertyId).collection('maintenance_events').add({
      type: 'NEW_TASK',
      taskId: task.id,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true, task });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/maintenance/:id
app.put('/api/maintenance/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status, cost, assignedToId, completedDate } = req.body;
  try {
    const task = await prisma.maintenanceRequest.update({
      where: { id },
      data: { status, cost, assignedToId, completedDate: completedDate ? new Date(completedDate) : undefined }
    });

    // Real-time Trigger
    await db.collection('hotels').doc(task.propertyId).collection('maintenance_events').add({
      type: 'UPDATE_TASK',
      taskId: task.id,
      status: status,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true, task });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


// 10. GUESTS
// GET /api/guests?propertyId=...
app.get('/api/guests', authMiddleware, async (req, res) => {
  try {
    const { searchQuery, isDNR } = req.query;

    const where = {};

    if (searchQuery) {
      where.OR = [
        { name: { contains: String(searchQuery), mode: 'insensitive' } },
        { email: { contains: String(searchQuery), mode: 'insensitive' } },
        { phoneNumber: { contains: String(searchQuery), mode: 'insensitive' } },
        { idNumber: { contains: String(searchQuery), mode: 'insensitive' } }
      ];
    }

    if (isDNR) {
      where.isDNR = isDNR === 'true';
    }

    const guests = await prisma.guest.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      take: 50,
      include: {
        _count: {
          select: { bookings: true }
        }
      }
    });

    // Calculate lifetime spend (simple aggregate if possible, or do it in SQL)
    // Prisma aggregate is cleaner
    // For now, returning basic list. Lifetime spend usually requires a separate aggregate query per guest or a raw query.
    // We'll skip complex lifetime spend calculation in List view for performance unless needed.

    res.json({ guests });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/guests/:id
app.get('/api/guests/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const guest = await prisma.guest.findUnique({
      where: { id },
      include: {
        bookings: {
          include: { room: true },
          orderBy: { checkInDate: 'desc' }
        },
        notes: { orderBy: { createdAt: 'desc' } },
        invoices: { include: { payments: true } },
        documents: { orderBy: { uploadDate: 'desc' } }
      }
    });
    if (!guest) return res.status(404).json({ error: 'Guest not found' });

    // Calculate Stats
    // This is simple in-memory calc for single record.
    const completedBookings = guest.bookings.filter(b => b.status === 'Completed' || b.status === 'CheckedOut');
    const lifetimeSpend = guest.invoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);

    res.json({
      guest: {
        ...guest,
        lifetimeSpend,
        totalStays: completedBookings.length
      }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/guests (Upsert)
app.post('/api/guests', authMiddleware, async (req, res) => {
  const { email, name, phoneNumber, address, idNumber, status, isDNR, dnrReason, photoUrl } = req.body;
  try {
    const guest = await prisma.guest.upsert({
      where: { email },
      update: {
        name, phoneNumber, address, idNumber, status, isDNR: Boolean(isDNR), dnrReason, photoUrl
      },
      create: {
        email, name, phoneNumber, address, idNumber, status, isDNR: Boolean(isDNR), dnrReason, photoUrl
      }
    });
    res.json({ success: true, guest });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/guests/:id/documents
app.post('/api/guests/:id/documents', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { fileName, fileUrl, type, amount } = req.body;

  try {
    const doc = await prisma.guestDocument.create({
      data: {
        guestId: id,
        fileName,
        fileUrl,
        type,
        amount: amount ? Number(amount) : null
      }
    });
    res.json({ success: true, document: doc });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/guests/:id/invoices
app.post('/api/guests/:id/invoices', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { amount, bookingId } = req.body; // Optional bookingId
  try {
    const invoice = await prisma.invoice.create({
      data: {
        guestId: id,
        bookingId: bookingId || null, // Optional link
        totalAmount: Number(amount) || 0,
        status: 'PENDING',
        generatedAt: new Date()
      }
    });

    // Also create a "Document" record for this invoice
    await prisma.guestDocument.create({
      data: {
        guestId: id,
        type: 'Invoice',
        fileName: `Invoice_${invoice.id.split('-')[0]}.pdf`, // Mock PDF name
        fileUrl: '#', // In real app, generate PDF -> upload -> get URL
        uploadDate: new Date(),
        amount: invoice.totalAmount
      }
    });

    res.json({ success: true, invoice });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 11. FEATURE REQUESTS
app.get('/api/features', authMiddleware, async (req, res) => {
  try {
    const requests = await prisma.featureRequest.findMany({
      orderBy: { votes: 'desc' },
      include: { requester: true }
    });
    res.json({ requests });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/features', authMiddleware, async (req, res) => {
  const { title, description, priority } = req.body;
  try {
    const reqItem = await prisma.featureRequest.create({
      data: {
        title,
        description,
        priority,
        requesterId: req.user.uid
      }
    });

    // Real-time Trigger
    await db.collection('global').doc('features').collection('events').add({
      type: 'NEW_FEATURE',
      featureId: reqItem.id,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true, request: reqItem });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));