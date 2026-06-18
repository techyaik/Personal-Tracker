import AsyncStorage from '@react-native-async-storage/async-storage';

export const getData = async (key) => {
  const value = await AsyncStorage.getItem(key);
  return value ? JSON.parse(value) : [];
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
