import AsyncStorage from '../storage/safeAsyncStorage';

const WALLET_PASSCODE_KEY = 'lifio_wallet_passcode_v1';
const WALLET_PASSCODE_FALLBACK_KEY = 'lifio_wallet_passcode_fallback_v1';

let secureStoreModule;
let secureStoreChecked = false;
let secureStoreWarningShown = false;

const getSecureStoreModule = () => {
  if (secureStoreChecked) {
    return secureStoreModule;
  }

  secureStoreChecked = true;
  try {
    // SecureStore is a native module, so older dev clients can fail at require time.
    // Loading it lazily lets the app keep working until the native client is rebuilt.
    // eslint-disable-next-line global-require
    secureStoreModule = require('expo-secure-store');
  } catch (error) {
    secureStoreModule = null;
    if (!secureStoreWarningShown) {
      secureStoreWarningShown = true;
      console.warn('Secure wallet storage unavailable. Using local fallback storage until the app is rebuilt with expo-secure-store.');
    }
  }

  return secureStoreModule;
};

const getSecureStoreOptions = (SecureStore) => ({
  keychainAccessible: SecureStore?.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
});

const isSecureStoreAvailable = async () => {
  const SecureStore = getSecureStoreModule();
  if (!SecureStore?.isAvailableAsync) {
    return false;
  }

  try {
    return await SecureStore.isAvailableAsync();
  } catch (error) {
    console.error('Error checking wallet secure storage:', error);
    return false;
  }
};

export const normalizeWalletPasscode = (value) => String(value || '').trim();

export const isValidWalletPasscode = (value) => /^\d{4,8}$/.test(normalizeWalletPasscode(value));

export const getWalletPasscode = async () => {
  const SecureStore = getSecureStoreModule();
  const secureAvailable = await isSecureStoreAvailable();
  if (secureAvailable) {
    return SecureStore.getItemAsync(WALLET_PASSCODE_KEY, getSecureStoreOptions(SecureStore));
  }
  return AsyncStorage.getItem(WALLET_PASSCODE_FALLBACK_KEY);
};

export const saveWalletPasscode = async (passcode) => {
  const normalized = normalizeWalletPasscode(passcode);
  if (!isValidWalletPasscode(normalized)) {
    throw new Error('Wallet passcode must be 4 to 8 digits.');
  }

  const SecureStore = getSecureStoreModule();
  const secureAvailable = await isSecureStoreAvailable();
  if (secureAvailable) {
    await SecureStore.setItemAsync(WALLET_PASSCODE_KEY, normalized, getSecureStoreOptions(SecureStore));
    await AsyncStorage.removeItem(WALLET_PASSCODE_FALLBACK_KEY);
    return;
  }

  await AsyncStorage.setItem(WALLET_PASSCODE_FALLBACK_KEY, normalized);
};

export const verifyWalletPasscode = async (passcode) => {
  const stored = await getWalletPasscode();
  return Boolean(stored && normalizeWalletPasscode(passcode) === stored);
};
