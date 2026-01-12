import { onCall, HttpsError, onRequest } from "firebase-functions/v2/https";
import { apiApp } from "./api.js";
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


import { defineSecret } from "firebase-functions/params";
import { GoogleGenAI } from "@google/genai";

const geminiApiKey = defineSecret("GEMINI_API_KEY");

/**
 * Generates an operational insight using Google Gemini.
 * Securely access the API Key on the server side.
 */
export const generateOpInsight = onCall({ secrets: [geminiApiKey], cors: true }, async (request) => {
  // 1. Authenticate Request
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be logged in.');
  }

  const { contextData, propertyName } = request.data;
  const apiKey = geminiApiKey.value();

  if (!apiKey) {
    throw new HttpsError('internal', 'AI Service not configured.');
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // This 'gemini-2.0-flash-exp' is a placeholder. 
    // Use 'gemini-1.5-flash' or similar for production stability if needed.
    // But per your code, we will stick to a standard model name if one wasn't specified.
    // Let's use 'gemini-1.5-flash' as a safe default for production.
    const model = "gemini-1.5-flash";

    const prompt = `Perform a high-priority operational analysis for ${propertyName}.
            Focus EXCLUSIVELY on these two categories:
            1. DEBT/ARREARS (Who owes money): ${JSON.stringify(contextData.arrears)}
            2. MAINTENANCE (What needs repair): ${JSON.stringify(contextData.maintenance)}
    
            Provide a 2-sentence executive strategic summary highlighting the biggest financial or physical risk. 
            Then, provide one single 'Priority Action' for the manager to execute immediately.
            
            Format your response exactly like this:
            Summary: [analysis text]
            Action: [immediate task]`;

    const response = await ai.models.generateContent({
      model: model,
      contents: [{ parts: [{ text: prompt }] }]
    });

    // Extract text safely
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate insight.";

    return { success: true, insight: text };

  } catch (error: any) {
    console.error("AI Error:", error);
    throw new HttpsError('internal', "AI generation failed.");
  }
});
// Export the Express API as a Cloud Function
export const api = onRequest(apiApp);
