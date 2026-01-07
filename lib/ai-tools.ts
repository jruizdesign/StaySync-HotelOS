import { getPropertyDashboard } from "@firebasegen/default";

// --- Tool Schemas for Gemini ---

export const toolDefinitions = [
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
        const res = await getPropertyDashboard({ propertyId });
        const data = res.data;

        if (!data.property) return { error: "Property not found" };

        const rooms = data.rooms || [];
        const totalRooms = rooms.length;
        const occupied = rooms.filter(r => r.roomStatus === 'OCCUPIED').length;
        const occupancyRate = totalRooms > 0 ? ((occupied / totalRooms) * 100).toFixed(1) + '%' : '0%';

        // RevPAR simplified calculation
        const bookings = data.bookings || [];
        const revenue = bookings.reduce((sum, b) => sum + (b.currentStayTotalAmount || 0), 0);

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
        const res = await getPropertyDashboard({ propertyId });
        const bookings = res.data.bookings || [];

        const debtors = bookings
            .map(b => ({
                guestName: b.guestName,
                room: b.room?.roomNumber || 'Unknown',
                total: b.currentStayTotalAmount || 0,
                paid: b.amountPaid || 0,
                owing: (b.currentStayTotalAmount || 0) - (b.amountPaid || 0)
            }))
            .filter(g => g.owing > 0)
            .sort((a, b) => b.owing - a.owing) // Highest debt first
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
        const res = await getPropertyDashboard({ propertyId });
        const room = res.data.rooms.find(r => r.roomNumber === roomNumber);

        if (!room) return { error: `Room ${roomNumber} not found.` };

        return {
            roomNumber: room.roomNumber,
            status: room.roomStatus,
            type: room.roomType,
            floor: room.floor
        };
    } catch (e: any) {
        return { error: e.message };
    }
}
