import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { RADIUS, SHADOWS } from '../constants/theme';
import { HealthStack } from './HealthStack';
import { HabitsStack } from './HabitsStack';
import { NotesStack } from './NotesStack';
import { JournalStack } from './JournalStack';
import Onboarding from '../screens/Onboarding';

const Tab = createBottomTabNavigator();
const ONBOARDING_KEY = 'lifio_onboarded_v2';

const TAB_META = {
  HealthTab: { label: 'Health', icon: 'heart', color: COLORS.health },
  HabitsTab: { label: 'Habits', icon: 'checkmark-circle', color: COLORS.habits },
  NotesTab: { label: 'Notes', icon: 'document-text', color: COLORS.notes },
  JournalTab: { label: 'Journal', icon: 'book', color: COLORS.journal },
};

export default function RootNavigator() {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(ONBOARDING_KEY).then((value) => {
      if (!mounted) return;
      setOnboarded(value === 'true');
      setReady(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const completeOnboarding = async () => {
    setOnboarded(true);
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  };

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bg }}>
        <ActivityIndicator color={COLORS.health} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {onboarded ? (
        <Tab.Navigator
          screenOptions={({ route }) => {
            const meta = TAB_META[route.name];
            return {
              headerShown: false,
              tabBarActiveTintColor: meta.color,
              tabBarInactiveTintColor: COLORS.textHint,
              tabBarStyle: {
                backgroundColor: COLORS.white,
                borderTopColor: COLORS.borderLight,
                borderTopWidth: 1,
                height: 72,
                paddingBottom: 12,
                paddingTop: 8,
                ...SHADOWS.soft,
              },
              tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
              tabBarItemStyle: { borderRadius: RADIUS.md, marginHorizontal: 2 },
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
      ) : (
        <Onboarding onGetStarted={completeOnboarding} />
      )}
    </NavigationContainer>
  );
}
