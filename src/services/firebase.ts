import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth
} from 'firebase/auth';
import { UserProfile } from '../types';

// Admin email matching project owner Dhanush Nandhakumar
export const ADMIN_EMAIL = 'dhanushnandhakumarr@gmail.com';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY'
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  } catch (error) {
    console.error('Failed to initialize Firebase Auth:', error);
  }
}

export function mapFirebaseUser(user: FirebaseUser | null): UserProfile | null {
  if (!user) return null;
  const email = user.email || '';
  return {
    uid: user.uid,
    email: email,
    displayName: user.displayName || (email.split('@')[0] ?? 'User'),
    photoURL: user.photoURL || undefined,
    isAdmin: email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  };
}

export async function loginWithGoogle(): Promise<{ user?: UserProfile; error?: string }> {
  if (!isFirebaseConfigured || !auth || !googleProvider) {
    return {
      error: 'FIREBASE_NOT_CONFIGURED'
    };
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const profile = mapFirebaseUser(result.user);
    return { user: profile || undefined };
  } catch (err: any) {
    if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
      return { error: 'Sign-in window was closed before completion. Please try again.' };
    }
    if (err.code === 'auth/unauthorized-domain') {
      return {
        error: `This app's domain (${window.location.hostname}) is not authorized in your Firebase Authentication settings. Add it under Firebase Console > Authentication > Settings > Authorized domains.`
      };
    }
    if (err.code === 'auth/operation-not-allowed') {
      return {
        error: 'Google Sign-In is not enabled in your Firebase Project. Enable Google under Firebase Console > Authentication > Sign-in method.'
      };
    }
    return { error: err.message || 'Failed to authenticate with Google.' };
  }
}

export async function logoutUser(): Promise<void> {
  if (auth) {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.warn('Firebase signout error:', err);
    }
  }
}

export function subscribeToAuth(callback: (user: UserProfile | null) => void): () => void {
  if (!isFirebaseConfigured || !auth) {
    return () => {};
  }
  return onAuthStateChanged(auth, (fbUser) => {
    callback(mapFirebaseUser(fbUser));
  });
}
