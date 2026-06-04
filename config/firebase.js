const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");

function loadCliRefreshCredential() {
    const firebaseToolsPath = path.join(os.homedir(), ".config", "configstore", "firebase-tools.json");

    if (!fs.existsSync(firebaseToolsPath)) {
        throw new Error("Impossible de trouver la session Firebase CLI locale.");
    }

    const firebaseToolsConfig = JSON.parse(fs.readFileSync(firebaseToolsPath, "utf8"));
    const refreshToken = firebaseToolsConfig?.tokens?.refresh_token;

    if (!refreshToken) {
        throw new Error("Aucun refresh token Firebase CLI disponible.");
    }

    return admin.credential.refreshToken({
        type: "authorized_user",
        client_id: process.env.FIREBASE_CLIENT_ID || "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com",
        client_secret: process.env.FIREBASE_CLIENT_SECRET || "j9iVZfS8kkCEFUPaAeJV0sAi",
        refresh_token: refreshToken,
    });
}

function loadCredential() {
    if (process.env.FIREBASE_AUTH_MODE === "cli") {
        return loadCliRefreshCredential();
    }

    const configuredPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    const serviceAccountPath = configuredPath
        ? path.resolve(process.cwd(), configuredPath)
        : path.join(__dirname, "admin.json");
    const serviceAccount = require(serviceAccountPath);
    return admin.credential.cert(serviceAccount);
}

const auth = admin.initializeApp({
    credential: loadCredential(),
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
});

module.exports = {
    auth
}
