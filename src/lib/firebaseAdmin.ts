import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

import type { ServiceAccount } from 'firebase-admin';

let serviceAccount: ServiceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    if (serviceAccount.privateKey) {
      serviceAccount.privateKey = serviceAccount.privateKey.replace(/\\n/g, '\n');
    }
  } catch (error) {
    console.error('Failed to parse Firebase service account key:', error);
    throw error;
  }
} else {
  throw new Error('Firebase service account key not found in environment variables.');
}

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export const db = getFirestore();
export const adminAuth = getAuth();