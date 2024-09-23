import * as admin from 'firebase-admin';

// Initialize Firebase at the top of the file
admin.initializeApp();

export const db = admin.firestore();
