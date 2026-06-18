import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { HealthStack } from './HealthStack';
import { HabitsStack } from './HabitsStack';
import { NotesStack } from './NotesStack';
import { JournalStack } from './JournalStack';

const Tab = createBottomTabNavigator();

const TAB_META = {
  HealthTab: { label: 'Health', icon: 'heart', color: COLORS.health },
  HabitsTab: { label: 'Habits', icon: 'checkmark-circle', color: COLORS.habits },
  NotesTab: { label: 'Notes', icon: 'document-text', color: COLORS.notes },
  JournalTab: { label: 'Journal', icon: 'book', color: COLORS.journal },
};

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => {
          const meta = TAB_META[route.name];
          return {
            headerShown: false,
            tabBarActiveTintColor: meta.color,
            tabBarInactiveTintColor: COLORS.textHint,
            tabBarStyle: {
              backgroundColor: COLORS.white,
              borderTopColor: COLORS.border,
              height: 62,
              paddingBottom: 8,
              paddingTop: 6,
            },
            tabBarLabel: meta.label,
            tabBarIcon: ({ color, size }) => <Ionicons name={meta.icon} size={size} color={color} />,
          };
        }}
      >
        <Tab.Screen name="HealthTab" component={HealthStack} />
        <Tab.Screen name="HabitsTab" component={HabitsStack} />
        <Tab.Screen name="NotesTab" component={NotesStack} />
        <Tab.Screen name="JournalTab" component={JournalStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
