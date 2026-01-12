import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const { Pool } = pg;

// Helper to get connection string
const getConnectionString = () => {
    // In functions, env vars are set via .env or secrets
    return process.env.DATABASE_URL;
};

// Setup Global Client (Connection Pool)
// Note: In Cloud Functions, global scope is retained between warm start invocations
const connectionString = getConnectionString();
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const globalPrisma = new PrismaClient({ adapter });

/**
 * Returns a Restricted Prisma Client that enforces property isolation.
 * @param {Object} user - The authenticated user object (from req.user)
 * @param {string} [selectedPropertyId] - The ID selected by Super Admin (optional)
 */
export const getTenantClient = (user: any, selectedPropertyId: string | null = null) => {

    // 1. DETERMINE THE PROPERTY ID
    let targetPropertyId;

    // Normalize role checking (handling potential casing issues)
    const role = user.role ? user.role.toUpperCase() : 'STAFF';

    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
        // Admin: Can switch properties dynamically
        targetPropertyId = selectedPropertyId;
    } else {
        // Staff/Manager: LOCKED to their assigned ID (token/DB)
        targetPropertyId = user.hotelId;
    }

    if (!targetPropertyId) {
        throw new Error("Zero Tolerance: No Property ID context identified for this session.");
    }

    // 2. RETURN A RESTRICTED CLIENT
    return globalPrisma.$extends({
        query: {
            $allModels: {
                async $allOperations({ model, operation, args, query }) {

                    // Only apply filter to 'find' operations + update/delete
                    if (['findUnique', 'findFirst', 'findMany', 'count', 'update', 'delete', 'updateMany', 'deleteMany'].includes(operation)) {

                        // Models that have direct 'propertyId' field
                        const DIRECT_PROPERTY_MODELS = ['Room', 'Booking', 'MaintenanceRequest', 'User'];

                        if (DIRECT_PROPERTY_MODELS.includes(model)) {
                            (args as any).where = {
                                ...(args as any).where,
                                propertyId: targetPropertyId
                            };
                        }
                        // Models that need Association Filtering (Guest)
                        else if (model === 'Guest') {
                            // Guest -> Bookings -> Property
                            (args as any).where = {
                                ...(args as any).where,
                                bookings: {
                                    some: {
                                        propertyId: targetPropertyId
                                    }
                                }
                            };
                        }
                    }

                    // For 'create', inject the propertyId automatically
                    if (operation === 'create' || operation === 'createMany') {
                        const DIRECT_PROPERTY_MODELS = ['Room', 'Booking', 'MaintenanceRequest'];
                        if (DIRECT_PROPERTY_MODELS.includes(model)) {
                            // If data is array (createMany), map it. Else object.
                            if (Array.isArray((args as any).data)) {
                                (args as any).data = (args as any).data.map((d: any) => ({ ...d, propertyId: targetPropertyId }));
                            } else {
                                (args as any).data = {
                                    ...(args as any).data,
                                    propertyId: targetPropertyId
                                };
                            }
                        }
                    }

                    return query(args);
                },
            },
        },
    });
};
