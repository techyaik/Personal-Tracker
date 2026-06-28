export const getFirebaseConfig = () => {
  const config = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  };

  const missing = ['apiKey', 'projectId', 'appId'].filter((key) => !config[key]);
  if (missing.length) {
    throw new Error(
      `Firebase is not configured. Add ${missing
        .map((key) => `EXPO_PUBLIC_FIREBASE_${key === 'apiKey' ? 'API_KEY' : key === 'projectId' ? 'PROJECT_ID' : 'APP_ID'}`)
        .join(', ')} to your environment.`
    );
  }

  return config;
};
