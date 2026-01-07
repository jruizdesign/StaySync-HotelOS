const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const email = process.argv[2];

if (!email) {
    console.log("Usage: node debug-claims.js <email>");
    process.exit(1);
}

admin.auth().getUserByEmail(email)
    .then(user => {
        console.log("User UID:", user.uid);
        console.log("Custom Claims:", user.customClaims);
    })
    .catch(error => {
        console.error("Error fetching user:", error);
    });
