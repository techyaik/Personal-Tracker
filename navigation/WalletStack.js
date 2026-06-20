import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WalletList from '../screens/wallet/WalletList';

const Stack = createStackNavigator();

export function WalletStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WalletList" component={WalletList} />
    </Stack.Navigator>
  );
}
