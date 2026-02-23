const admin = require("firebase-admin") as typeof import("firebase-admin");

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

function getAdminApp(): ReturnType<typeof admin.initializeApp> {
  if (admin.apps?.length) return admin.app();
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin env (FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) gerekli.");
  }
  return admin.initializeApp({
    projectId,
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

export async function verifyIdToken(idToken: string): Promise<{ uid: string }> {
  const app = getAdminApp();
  const decoded = await app.auth().verifyIdToken(idToken);
  return { uid: decoded.uid };
}

export function getAdminDb(): ReturnType<ReturnType<typeof admin.initializeApp>["firestore"]> {
  const app = getAdminApp();
  return app.firestore();
}
