
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { gql, GraphQLClient } from 'graphql-request';

// Initialize Firebase Admin
admin.initializeApp();

// Configuration for Data Connect (Postgres)
// In production, this URL comes from your Data Connect service
const DATA_CONNECT_ENDPOINT = process.env.DATA_CONNECT_ENDPOINT || 'https://api.firebasedataconnect.com/v1/projects/...';
const client = new GraphQLClient(DATA_CONNECT_ENDPOINT);

/**
 * Creates a new Tenant User (Manager or Staff).
 * 
 * ACTIONS:
 * 1. Creates Authentication User
 * 2. Sets Custom Claims (propertyId, role) - CRITICAL FOR SECURITY
 * 3. Inserts record into Cloud SQL via Data Connect
 */
export const createTenantUser = functions.https.onCall(async (data, context) => {
  // 1. SECURITY: Only Super Admins can create new users
  // This prevents unauthorized account creation
  if (context.auth?.token.role !== 'SYSTEM_ADMIN') {
    throw new functions.https.HttpsError(
      'permission-denied', 
      'Only System Administrators can onboard new users.'
    );
  }

  const { email, password, name, role, propertyId } = data;

  // Validate inputs
  if (!email || !password || !role || !propertyId) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields.');
  }

  try {
    // 2. Create User in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // 3. Set Custom Claims (The "Bridge" between Auth and DBs)
    // By baking propertyId into the token, Firestore rules and Data Connect
    // can instantly validate tenancy without extra database lookups.
    const customClaims = {
      role: role,         // 'PROPERTY_MANAGER' or 'STAFF'
      propertyId: propertyId 
    };
    
    await admin.auth().setCustomUserClaims(userRecord.uid, customClaims);

    // 4. Insert into Cloud SQL via Data Connect Mutation
    // We maintain a User table in SQL for relational queries (e.g., Bookings linked to User)
    const mutation = gql`
      mutation CreateUserInSql($id: String!, $email: String!, $name: String, $role: String!, $propertyId: UUID!) {
        user_insert(data: {
          id: $id,
          email: $email,
          name: $name,
          role: $role,
          propertyId: $propertyId
        }) {
          id
        }
      }
    `;

    // Execute GraphQL mutation
    await client.request(mutation, {
      id: userRecord.uid,
      email: email,
      name: name,
      role: role,
      propertyId: propertyId
    });

    console.log(`User ${userRecord.uid} created for property ${propertyId}`);

    return { 
      success: true, 
      uid: userRecord.uid,
      message: 'User created and synced to SQL successfully.' 
    };

  } catch (error) {
    console.error('Onboarding Error:', error);
    // If SQL fails, we might want to rollback Auth, but for now just throw error
    throw new functions.https.HttpsError('internal', 'Failed to create user or sync data.');
  }
});
