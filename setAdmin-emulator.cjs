
const admin = require("firebase-admin");

// Point to the Emulator - Since you are running locally, we don't need the service account key!
process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
process.env.GCLOUD_PROJECT = "staysync-hotelos";

admin.initializeApp({
    projectId: "staysync-hotelos"
});

// We are targeting the user we instructed you to create earlier.
// If you created a different email, change this value.
const TARGET_EMAIL = "officer@staysync.com";

async function setAdmin() {
    try {
        console.log(`Connecting to Emulator...`);
        console.log(`Looking for user ${TARGET_EMAIL}...`);

        const user = await admin.auth().getUserByEmail(TARGET_EMAIL);
        console.log(`Found user: ${user.uid}`);

        // Force set the claims
        await admin.auth().setCustomUserClaims(user.uid, {
            role: "ADMIN",
            propertyId: null
        });

        console.log(`\nSUCCESS! ---------------------------------------------------`);
        console.log(`User ${TARGET_EMAIL} has been promoted to ADMIN.`);
        console.log(`You may now login. If you are already logged in, LOG OUT and LOG BACK IN.`);
        console.log(`------------------------------------------------------------\n`);
    } catch (error) {
        console.error("\nERROR ------------------------------------------------------");
        console.error(error.message);
        if (error.code === 'auth/user-not-found') {
            console.error(`\nThe user '${TARGET_EMAIL}' does not exist in the emulator.`);
            console.error(`Please go to http://localhost:4000/auth and create this user first.`);
        }
        console.error("------------------------------------------------------------\n");
    }
}

setAdmin();
