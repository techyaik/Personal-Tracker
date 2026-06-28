import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { getFirebaseAuth } from '../services/firebaseAuth';

export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());

const authErrorMessages = {
  'auth/email-already-in-use': 'An account already exists for this email.',
  'auth/invalid-credential': 'Email or password is incorrect.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/missing-password': 'Enter your password.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
  'auth/too-many-requests': 'Too many attempts. Please wait and try again.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/user-not-found': 'No account was found for this email.',
  'auth/weak-password': 'Use a password with at least 6 characters.',
  'auth/wrong-password': 'Email or password is incorrect.',
};

export const getAuthErrorMessage = (error) => {
  if (!error) return 'Authentication failed. Please try again.';
  return authErrorMessages[error.code] || error.message || 'Authentication failed. Please try again.';
};

export const loginWithCredentials = async ({ email, password }) => {
  const auth = getFirebaseAuth();
  const credential = await signInWithEmailAndPassword(auth, String(email || '').trim(), password);
  const token = await credential.user.getIdToken();
  return { user: credential.user, token };
};

export const signUpWithCredentials = async ({ email, password }) => {
  const auth = getFirebaseAuth();
  const credential = await createUserWithEmailAndPassword(auth, String(email || '').trim(), password);
  const token = await credential.user.getIdToken();
  return { user: credential.user, token };
};

export const sendPasswordReset = async (email) => {
  const auth = getFirebaseAuth();
  await sendPasswordResetEmail(auth, String(email || '').trim());
};

export const getAuthToken = async () => {
  const auth = getFirebaseAuth();
  return auth.currentUser ? auth.currentUser.getIdToken() : null;
};

export const clearAuthToken = async () => {
  const auth = getFirebaseAuth();
  await signOut(auth);
};
