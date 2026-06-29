const memoryStore = {};
let nativeAvailable = true;
let nativeStorageModule = null;

const isNativeStorageError = (error) => {
  const message = String(error?.message || error || '');
  return (
    message.includes('Native module is null') ||
    message.includes('legacy storage') ||
    message.includes('AsyncStorage')
  );
};

const getWebStorage = () => {
  try {
    return typeof globalThis !== 'undefined' ? globalThis.localStorage : null;
  } catch (error) {
    return null;
  }
};

const fallbackStorage = {
  async getItem(key) {
    const webStorage = getWebStorage();
    if (webStorage) return webStorage.getItem(key);
    return Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : null;
  },
  async setItem(key, value) {
    const stringValue = String(value);
    const webStorage = getWebStorage();
    if (webStorage) {
      webStorage.setItem(key, stringValue);
      return;
    }
    memoryStore[key] = stringValue;
  },
  async removeItem(key) {
    const webStorage = getWebStorage();
    if (webStorage) {
      webStorage.removeItem(key);
      return;
    }
    delete memoryStore[key];
  },
  async getAllKeys() {
    const webStorage = getWebStorage();
    if (webStorage) {
      return Array.from({ length: webStorage.length }, (_, index) => webStorage.key(index)).filter(Boolean);
    }
    return Object.keys(memoryStore);
  },
  async multiRemove(keys) {
    await Promise.all(keys.map((key) => fallbackStorage.removeItem(key)));
  },
};

const loadNativeStorage = () => {
  if (!nativeAvailable) return null;
  if (nativeStorageModule) return nativeStorageModule;

  try {
    const loaded = require('@react-native-async-storage/async-storage');
    nativeStorageModule = loaded?.default || loaded;
    return nativeStorageModule;
  } catch (error) {
    if (!isNativeStorageError(error)) {
      throw error;
    }
    nativeAvailable = false;
    return null;
  }
};

const callStorage = async (method, ...args) => {
  const nativeStorage = loadNativeStorage();
  if (nativeStorage?.[method]) {
    try {
      return await nativeStorage[method](...args);
    } catch (error) {
      if (!isNativeStorageError(error)) {
        throw error;
      }
      nativeAvailable = false;
    }
  }

  return fallbackStorage[method](...args);
};

const safeAsyncStorage = {
  getItem: (key) => callStorage('getItem', key),
  setItem: (key, value) => callStorage('setItem', key, value),
  removeItem: (key) => callStorage('removeItem', key),
  getAllKeys: () => callStorage('getAllKeys'),
  multiRemove: (keys) => callStorage('multiRemove', keys),
};

export default safeAsyncStorage;
