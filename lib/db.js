import { PrismaClient } from '../src/generated/prisma/index.js';
import pg from 'pg';
const { Pool } = pg;
import { PrismaPg } from '@prisma/adapter-pg';

// Setup Global Client (Connection Pool)
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
export const globalPrisma = new PrismaClient({ adapter });

/**
 * Returns a Restricted Prisma Client that enforces property isolation.
 * @param {Object} user - The authenticated user object (from req.user)
 * @param {string} [selectedPropertyId] - The ID selected by Super Admin (optional)
 */
export const getTenantClient = (user, selectedPropertyId = null) => {

    // 1. DETERMINE THE PROPERTY ID
    let targetPropertyId;

    // Normalize role checking (handling potential casing issues)
    const role = user.role ? user.role.toUpperCase() : 'STAFF';

    if (role === 'SUPER_ADMIN') {
        // Admin: Can switch properties dynamically
        // If no property selected, they get NO restricted client (or we throw error to enforce selection)
        // User Update: "guests are always scoped... zero tolerance"
        // So if no selectedPropertyId, we strictly require one for data operations.
        targetPropertyId = selectedPropertyId;
    } else {
        // Staff/Manager: LOCKED to their assigned ID (token/DB)
        targetPropertyId = user.hotelId;
    }

    // If we still don't have a ID (e.g. Super Admin didn't pick one), 
    // we cannot act on behalf of a tenant.
    // We'll throw an error so the API call fails safely.
    if (!targetPropertyId) {
        // If it's a Super Admin doing something truly global (like getting list of all properties), 
        // they should use 'globalPrisma' directly in that specific route.
        // For tenant-scoped routes, this is an error.
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
                            args.where = {
                                ...args.where,
                                propertyId: targetPropertyId
                            };
                        }
                        // Models that need Association Filtering (Guest)
                        else if (model === 'Guest') {
                            // Guest -> Bookings -> Property
                            args.where = {
                                ...args.where,
                                bookings: {
                                    some: {
                                        propertyId: targetPropertyId
                                    }
                                }
                            };
                        }
                        // Models that need Association Filtering (Invoice -> Booking?)
                        // For now, focusing on the core leakage vectors.
                    }

                    // For 'create', inject the propertyId automatically
                    if (operation === 'create' || operation === 'createMany') {
                        const DIRECT_PROPERTY_MODELS = ['Room', 'Booking', 'MaintenanceRequest'];
                        if (DIRECT_PROPERTY_MODELS.includes(model)) {
                            // If data is array (createMany), map it. Else object.
                            if (Array.isArray(args.data)) {
                                args.data = args.data.map(d => ({ ...d, propertyId: targetPropertyId }));
                            } else {
                                args.data = {
                                    ...args.data,
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
