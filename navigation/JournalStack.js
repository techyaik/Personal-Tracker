import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import JournalList from '../screens/journal/JournalList';
import JournalNewEntry from '../screens/journal/JournalNewEntry';
import JournalEntryDetail from '../screens/journal/JournalEntryDetail';
import MoodCalendar from '../screens/journal/MoodCalendar';

const Stack = createStackNavigator();

export function JournalStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="JournalList" component={JournalList} />
      <Stack.Screen name="JournalNewEntry" component={JournalNewEntry} />
      <Stack.Screen name="JournalEntryDetail" component={JournalEntryDetail} />
      <Stack.Screen name="MoodCalendar" component={MoodCalendar} />
    </Stack.Navigator>
  );
}
