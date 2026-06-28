import { Alert, Platform, ToastAndroid } from 'react-native';

export const showToast = (message) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
    return;
  }
  if (Platform.OS === 'web') {
    try {
      alert(message);
    } catch (e) {
      console.log('[Toast Fallback]', message);
    }
    return;
  }
  try {
    Alert.alert(message);
  } catch (e) {
    console.log('[Toast Fallback]', message);
  }
};

export const safeConfirm = (title, message, onConfirm, cancelText = 'Cancel', confirmText = 'Confirm') => {
  if (Platform.OS === 'web') {
    try {
      const confirmed = window.confirm(`${title}\n\n${message}`);
      if (confirmed) {
        onConfirm();
      }
    } catch (e) {
      console.warn('[safeConfirm] window.confirm blocked by browser. Executing action directly.', e);
      onConfirm();
    }
  } else {
    Alert.alert(
      title,
      message,
      [
        { text: cancelText, style: 'cancel' },
        { text: confirmText, style: 'destructive', onPress: onConfirm }
      ]
    );
  }
};
