import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { RADIUS, SHADOWS } from '../constants/theme';
import { HealthStack } from './HealthStack';
import { HabitsStack } from './HabitsStack';
import { NotesStack } from './NotesStack';
import { JournalStack } from './JournalStack';
import Onboarding from '../screens/Onboarding';
import Settings from '../screens/Settings';
import { todayKey } from '../utils/dates';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const ONBOARDING_KEY = 'lifio_onboarded_v2';

const TAB_META = {
  HealthTab: { label: 'Health', icon: 'heart', color: COLORS.health },
  HabitsTab: { label: 'Habits', icon: 'checkmark-circle', color: COLORS.habits },
  NotesTab: { label: 'Notes', icon: 'document-text', color: COLORS.notes },
  JournalTab: { label: 'Journal', icon: 'book', color: COLORS.journal },
};

function EmptyCenterScreen() {
  return null;
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => {
        const meta = TAB_META[route.name];
        const isCenter = route.name === 'CenterAction';
        return {
          headerShown: false,
          tabBarActiveTintColor: meta?.color || COLORS.health,
          tabBarInactiveTintColor: COLORS.textHint,
          tabBarStyle: styles.tabBar,
          tabBarLabel: meta?.label || '',
          tabBarLabelStyle: styles.tabLabel,
          tabBarItemStyle: isCenter ? styles.centerItem : styles.tabItem,
          tabBarIcon: ({ color, size }) =>
            isCenter ? (
              <View style={styles.centerButton}>
                <Ionicons name="add" size={28} color={COLORS.white} />
              </View>
            ) : (
              <Ionicons name={meta.icon} size={size} color={color} />
            ),
          tabBarButton: isCenter
            ? (props) => (
                <Pressable
                  {...props}
                  onPress={() =>
                    navigation.navigate('HealthTab', {
                      screen: 'HealthLogEntry',
                      params: { date: todayKey() },
                    })
                  }
                  style={styles.centerPressable}
                >
                  {props.children}
                </Pressable>
              )
            : undefined,
        };
      }}
    >
      <Tab.Screen name="HealthTab" component={HealthStack} />
      <Tab.Screen name="HabitsTab" component={HabitsStack} />
      <Tab.Screen
        name="CenterAction"
        component={EmptyCenterScreen}
        options={{
          tabBarAccessibilityLabel: 'Log health',
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen name="NotesTab" component={NotesStack} />
      <Tab.Screen name="JournalTab" component={JournalStack} />
    </Tab.Navigator>
  );
}

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
        <Drawer.Navigator
          id="RootDrawer"
          screenOptions={{
            headerShown: false,
            drawerActiveTintColor: COLORS.health,
            drawerInactiveTintColor: COLORS.textSecondary,
            drawerStyle: styles.drawer,
            drawerLabelStyle: styles.drawerLabel,
          }}
        >
          <Drawer.Screen
            name="Main"
            component={MainTabs}
            options={{ drawerLabel: 'Home', drawerIcon: ({ color, size }) => <Ionicons name="apps" color={color} size={size} /> }}
          />
          <Drawer.Screen
            name="Settings"
            component={Settings}
            options={{ drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" color={color} size={size} /> }}
          />
        </Drawer.Navigator>
      ) : (
        <Onboarding onGetStarted={completeOnboarding} />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopColor: COLORS.borderLight,
    borderTopWidth: 1,
    height: 76,
    paddingBottom: 12,
    paddingTop: 8,
    ...SHADOWS.soft,
  },
  tabLabel: { fontSize: 10, fontWeight: '700' },
  tabItem: { borderRadius: RADIUS.md, marginHorizontal: 1 },
  centerItem: { alignItems: 'center', justifyContent: 'center' },
  centerPressable: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    top: -14,
  },
  centerButton: {
    alignItems: 'center',
    backgroundColor: COLORS.health,
    borderColor: COLORS.white,
    borderRadius: RADIUS.pill,
    borderWidth: 3,
    height: 56,
    justifyContent: 'center',
    width: 56,
    ...SHADOWS.glow,
  },
  drawer: {
    backgroundColor: COLORS.bgWarm,
    width: 286,
  },
  drawerLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
});
