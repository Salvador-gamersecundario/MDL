import admin from 'firebase-admin';
import { App, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

// This function initializes Firebase Admin SDK and returns the database instance.
// It ensures that initialization happens only once.
function getFirebaseAdminApp(): App {
  if (getApps().length > 0) {
    return getApp();
  }

  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);
    const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;

    if (!databaseURL) {
      throw new Error("NEXT_PUBLIC_FIREBASE_DATABASE_URL environment variable is not set.");
    }
    
    const app = initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: databaseURL,
    });
    console.log("Firebase Admin SDK initialized successfully.");
    return app;

  } catch (e: any) {
    console.error('Firebase admin initialization error:', e.stack);
    // Throw a more specific error to make debugging easier.
    throw new Error('Failed to initialize Firebase Admin SDK. Please check your service account credentials and environment variables.');
  }
}

// Helper function to get the database instance
export async function getDb() {
    const app = getFirebaseAdminApp();
    return getDatabase(app);
}
