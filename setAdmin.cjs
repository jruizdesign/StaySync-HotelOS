const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json"); // The file you just downloaded

// Initialize the App
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// 👇 REPLACE THIS WITH THE EMAIL YOU USE TO LOGIN
const USER_EMAIL = "jruizdesign@gmail.com";

async function setAdmin() {
    try {
        // 1. Find the user
        const user = await admin.auth().getUserByEmail(USER_EMAIL);
        console.log(`Found user: ${user.email} (${user.uid})`);

        // 2. STAMP THE PASSPORT (Set Custom Claims)
        await admin.auth().setCustomUserClaims(user.uid, {
            role: "ADMIN", // Or 'MANAGER'
            propertyId: null  // Admins are not locked to a specific hotel
        });

        console.log("✅ SUCCESS! User is now a ADMIN.");
        console.log("👉 ACTION REQUIRED: Log Out and Log Back In on your website.");

        process.exit();
    } catch (error) {
        console.error("❌ ERROR:", error.message);
        process.exit(1);
    }
}

setAdmin();