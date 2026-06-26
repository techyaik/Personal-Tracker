import { Alert, Platform, ToastAndroid } from 'react-native';

export const showToast = (message) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
    return;
  }
  if (Platform.OS === 'web') {
    alert(message);
    return;
  }
  Alert.alert(message);
};
