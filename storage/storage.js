import AsyncStorage from '@react-native-async-storage/async-storage';

export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (!value) return [];
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error reading storage key:', key, e);
    return [];
  }
};

export const setData = async (key, value) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const addItem = async (key, item) => {
  const arr = await getData(key);
  arr.push(item);
  await setData(key, arr);
};

export const updateItem = async (key, id, updates) => {
  const arr = await getData(key);
  const idx = arr.findIndex((x) => x.id === id);
  if (idx !== -1) arr[idx] = { ...arr[idx], ...updates };
  await setData(key, arr);
};

export const deleteItem = async (key, id) => {
  const arr = await getData(key);
  await setData(
    key,
    arr.filter((x) => x.id !== id)
  );
};
