import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { gql, GraphQLClient } from "graphql-request";
import { GoogleAuth } from "google-auth-library";

admin.initializeApp();

// Configuration
const DATA_CONNECT_ENDPOINT = process.env.DATA_CONNECT_ENDPOINT ||
  'https://firebasedataconnect.googleapis.com/v1/projects/staysync-hotelos/locations/us-central1/services/staysync-hotelos-service:executeGraphql';


/**
 * Creates a new Tenant User (Manager or Staff).
 */
export const createTenantUser = onCall(async (request) => {
  // -------------------------------------------------------------
  // FIX 1: Extract 'data' and 'auth' from the single 'request' object
  // -------------------------------------------------------------
  const { data, auth } = request;

  // 1. SECURITY: Check 'auth.token' (formerly context.auth.token)
  if (auth?.token.role !== 'SYSTEM_ADMIN' && auth?.token.role !== 'MANAGER') {
    throw new HttpsError('permission-denied', 'Not authorized to create users.');
  }

  // FIX 2: Read inputs from 'data'
  const { email, password, name, role, propertyId } = data;

  if (!email || !password || !role || !propertyId) {
    throw new HttpsError('invalid-argument', 'Missing required fields.');
  }

  try {
    // --- STEP 1: Create User in Firebase Auth ---
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // --- STEP 2: Set Custom Claims ---
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role,
      propertyId
    });

    // --- STEP 3: Data Connect Request ---
    const googleAuth = new GoogleAuth();
    const client_credentials = await googleAuth.getIdTokenClient(DATA_CONNECT_ENDPOINT);
    const tokenHeaders = await client_credentials.getRequestHeaders();

    const client = new GraphQLClient(DATA_CONNECT_ENDPOINT, {
      headers: tokenHeaders,
    });

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

    await client.request(mutation, {
      id: userRecord.uid,
      email,
      name,
      role,
      propertyId
    });

    return { success: true, uid: userRecord.uid };

  } catch (error: any) {
    console.error('Onboarding Error:', error);
    throw new HttpsError('internal', error.message || 'Failed to create user.');
  }
});

