import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HabitsToday from '../screens/habits/HabitsToday';
import AddHabit from '../screens/habits/AddHabit';
import HabitDetail from '../screens/habits/HabitDetail';
import HabitEdit from '../screens/habits/HabitEdit';

const Stack = createStackNavigator();

export function HabitsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HabitsToday" component={HabitsToday} />
      <Stack.Screen name="AddHabit" component={AddHabit} options={{ presentation: 'modal' }} />
      <Stack.Screen name="HabitDetail" component={HabitDetail} />
      <Stack.Screen name="HabitEdit" component={HabitEdit} />
    </Stack.Navigator>
  );
}
