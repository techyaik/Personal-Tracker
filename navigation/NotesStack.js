import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NotesList from '../screens/notes/NotesList';
import NoteEditor from '../screens/notes/NoteEditor';
import NoteDetail from '../screens/notes/NoteDetail';
import TagFilter from '../screens/notes/TagFilter';

const Stack = createStackNavigator();

export function NotesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NotesList" component={NotesList} />
      <Stack.Screen name="NoteEditor" component={NoteEditor} />
      <Stack.Screen name="NoteDetail" component={NoteDetail} />
      <Stack.Screen name="TagFilter" component={TagFilter} />
    </Stack.Navigator>
  );
}
