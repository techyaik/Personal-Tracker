import { getApp, getApps, initializeApp } from 'firebase/app';
import { browserLocalPersistence, getAuth, initializeAuth } from 'firebase/auth';
import { getFirebaseConfig } from './firebaseConfig';

let authInstance;

const getFirebaseApp = () => {
  if (getApps().length) {
    return getApp();
  }
  return initializeApp(getFirebaseConfig());
};

export const getFirebaseAuth = () => {
  if (authInstance) {
    return authInstance;
  }

  const app = getFirebaseApp();
  try {
    authInstance = initializeAuth(app, {
      persistence: browserLocalPersistence,
    });
  } catch (error) {
    authInstance = getAuth(app);
  }

  return authInstance;
};
