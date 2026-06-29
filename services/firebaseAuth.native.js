import AsyncStorage from '../storage/safeAsyncStorage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
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
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    authInstance = getAuth(app);
  }

  return authInstance;
};
