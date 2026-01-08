// import { getPropertyDashboard } from "@firebasegen/default"; // REMOVED
import { api } from './api';

// --- Tool Schemas for Gemini ---

export const toolDefinitions: any = [
    {
        name: "get_property_stats",
        description: "Get real-time operational statistics for a property (Occupancy, RevPAR, Total Rooms).",
        parameters: {
            type: "OBJECT",
            properties: {
                propertyId: { type: "STRING", description: "The UUID of the property operating on." }
            },
            required: ["propertyId"]
        }

    },
    {
        name: "list_guests_with_arrears",
        description: "Get a list of guests who have outstanding balances (owe money).",
        parameters: {
            type: "OBJECT",
            properties: {
                propertyId: { type: "STRING", description: "The UUID of the property." }
            },
            required: ["propertyId"]
        }
    },
    {
        name: "check_room_status",
        description: "Get the current status (Clean, Dirty, Occupied) of a specific room.",
        parameters: {
            type: "OBJECT",
            properties: {
                propertyId: { type: "STRING", description: "The UUID of the property." },
                roomNumber: { type: "STRING", description: "The room number (e.g. '101', '305')." }
            },
            required: ["propertyId", "roomNumber"]
        }
    }
];

// --- Tool Execution Logic ---

export async function executeTool(name: string, args: any) {
    console.log(`[AI-Tools] Executing ${name} with`, args);

    switch (name) {
        case "get_property_stats":
            return await getPropertyStats(args.propertyId);

        case "list_guests_with_arrears":
            return await listGuestsWithArrears(args.propertyId);

        case "check_room_status":
            return await checkRoomStatus(args.propertyId, args.roomNumber);

        default:
            throw new Error(`Unknown tool: ${name}`);
    }
}

// --- Implementation Helpers ---

async function getPropertyStats(propertyId: string) {
    try {
        const data = await api.properties.getDashboard(propertyId);

        if (!data.property) return { error: "Property not found" };

        const rooms = data.rooms || [];
        const totalRooms = rooms.length;
        const occupied = rooms.filter((r: any) => r.status === 'OCCUPIED').length; // Check property name (status vs roomStatus)
        const occupancyRate = totalRooms > 0 ? ((occupied / totalRooms) * 100).toFixed(1) + '%' : '0%';

        // RevPAR simplified calculation
        const bookings = data.bookings || [];
        const revenue = bookings.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);

        return {
            propertyName: data.property.name,
            totalRooms,
            occupiedRooms: occupied,
            occupancyRate,
            activeBookings: bookings.length,
            estimatedRevenue: revenue,
            timestamp: new Date().toISOString()
        };
    } catch (e: any) {
        return { error: e.message };
    }
}

async function listGuestsWithArrears(propertyId: string) {
    try {
        const res = await api.properties.getDashboard(propertyId);
        const bookings = res.bookings || [];

        const debtors = bookings
            .map((b: any) => ({
                guestName: b.guestName,
                room: b.room?.roomNumber || 'Unknown',
                total: b.totalAmount || 0,
                paid: b.amountPaid || 0,
                owing: (b.totalAmount || 0) - (b.amountPaid || 0)
            }))
            .filter((g: any) => g.owing > 0)
            .sort((a: any, b: any) => b.owing - a.owing) // Highest debt first
            .slice(0, 10); // Top 10

        return {
            count: debtors.length,
            guests: debtors
        };
    } catch (e: any) {
        return { error: e.message };
    }
}

async function checkRoomStatus(propertyId: string, roomNumber: string) {
    try {
        const res = await api.properties.getDashboard(propertyId);
        const room = res.rooms.find((r: any) => r.roomNumber === roomNumber);

        if (!room) return { error: `Room ${roomNumber} not found.` };

        return {
            roomNumber: room.roomNumber,
            status: room.status,
            type: room.roomType,
            floor: room.floor
        };
    } catch (e: any) {
        return { error: e.message };
    }
}
