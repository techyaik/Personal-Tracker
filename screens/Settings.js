import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { addDays, format, subDays } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/colors';
import { RADIUS, SHADOWS } from '../constants/theme';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionHeader } from '../components/SectionHeader';
import { getData, setData } from '../storage/storage';
import { showToast } from '../utils/feedback';

const DUMMY_PREFIX = 'lifio_dummy_';

const keyFor = (offset = 0) => format(addDays(new Date(), offset), 'yyyy-MM-dd');
const isoFor = (offset = 0) => addDays(new Date(), offset).toISOString();

const removeDummyItems = (items) => items.filter((item) => !String(item.id || '').startsWith(DUMMY_PREFIX));

async function fillDummyData() {
  const today = keyFor(0);
  const yesterday = keyFor(-1);
  const twoDaysAgo = keyFor(-2);

  const healthLogs = [
    {
      id: `${DUMMY_PREFIX}health_today`,
      date: today,
      weight: 70.2,
      sleep: 7.5,
      steps: 8320,
      water: 6,
      notes: 'Felt steady today. Short walk after lunch helped energy.',
      createdAt: isoFor(0),
    },
    {
      id: `${DUMMY_PREFIX}health_yesterday`,
      date: yesterday,
      weight: 70.4,
      sleep: 6.5,
      steps: 7200,
      water: 5,
      notes: 'Skipped the gym, walked home from work instead.',
      createdAt: isoFor(-1),
    },
    {
      id: `${DUMMY_PREFIX}health_two_days`,
      date: twoDaysAgo,
      weight: 70.1,
      sleep: 8,
      steps: 9800,
      water: 7,
      notes: '',
      createdAt: isoFor(-2),
    },
  ];

  const habits = [
    {
      id: `${DUMMY_PREFIX}habit_walk`,
      name: 'Morning walk',
      category: 'fitness',
      reminderTime: '07:00',
      goal: 'daily',
      createdAt: subDays(new Date(), 14).toISOString(),
    },
    {
      id: `${DUMMY_PREFIX}habit_read`,
      name: 'Read 20 mins',
      category: 'learning',
      reminderTime: '21:00',
      goal: 'daily',
      createdAt: subDays(new Date(), 10).toISOString(),
    },
    {
      id: `${DUMMY_PREFIX}habit_water`,
      name: 'Drink 8 glasses',
      category: 'health',
      reminderTime: null,
      goal: 'weekdays',
      createdAt: subDays(new Date(), 7).toISOString(),
    },
  ];

  const completions = [];
  habits.forEach((habit, habitIndex) => {
    for (let offset = -6; offset <= 0; offset += 1) {
      if (habitIndex === 2 && offset < -3) continue;
      completions.push({ habitId: habit.id, date: keyFor(offset), done: !(habitIndex === 1 && offset === -2) });
    }
  });

  const notes = [
    {
      id: `${DUMMY_PREFIX}note_ideas`,
      title: 'App ideas for 2026',
      body: 'Add AI insights, mood-based suggestions, weekly summaries, and export options.',
      tags: ['Ideas'],
      pinned: true,
      createdAt: isoFor(-3),
      updatedAt: isoFor(-1),
    },
    {
      id: `${DUMMY_PREFIX}note_grocery`,
      title: 'Grocery list',
      body: 'Milk, eggs, spinach, oats, almonds, olive oil, lemons.',
      tags: ['Personal'],
      pinned: false,
      createdAt: isoFor(-2),
      updatedAt: isoFor(-2),
    },
    {
      id: `${DUMMY_PREFIX}note_work`,
      title: 'Meeting notes — Q2 review',
      body: 'Discussed targets, health launch timeline, and weekly KPI reporting.',
      tags: ['Work'],
      pinned: false,
      createdAt: isoFor(-5),
      updatedAt: isoFor(-4),
    },
  ];

  const journalEntries = [
    {
      id: `${DUMMY_PREFIX}journal_today`,
      title: 'A productive day',
      body: 'Finished my habits today and logged health. Feeling positive about the week ahead.',
      mood: 'happy',
      date: today,
      createdAt: isoFor(0),
      updatedAt: isoFor(0),
    },
    {
      id: `${DUMMY_PREFIX}journal_yesterday`,
      title: 'Low energy evening',
      body: 'Skipped gym but took a walk. Feeling okay, need more sleep.',
      mood: 'neutral',
      date: yesterday,
      createdAt: isoFor(-1),
      updatedAt: isoFor(-1),
    },
    {
      id: `${DUMMY_PREFIX}journal_two_days`,
      title: 'Weekend highlight',
      body: 'Visited the botanical garden and took lots of photos. Felt refreshed.',
      mood: 'excited',
      date: twoDaysAgo,
      createdAt: isoFor(-2),
      updatedAt: isoFor(-2),
    },
  ];

  const existingHealth = removeDummyItems(await getData('health_logs'));
  const existingHabits = removeDummyItems(await getData('habits_list'));
  const existingCompletions = (await getData('habits_completions')).filter(
    (item) => !String(item.habitId || '').startsWith(DUMMY_PREFIX)
  );
  const existingNotes = removeDummyItems(await getData('notes_list'));
  const existingJournal = removeDummyItems(await getData('journal_entries'));

  await Promise.all([
    setData('health_logs', [...existingHealth, ...healthLogs]),
    setData('habits_list', [...existingHabits, ...habits]),
    setData('habits_completions', [...existingCompletions, ...completions]),
    setData('notes_list', [...existingNotes, ...notes]),
    setData('journal_entries', [...existingJournal, ...journalEntries]),
  ]);
}

export default function Settings() {
  const navigation = useNavigation();
  const canGoBack = navigation.canGoBack();

  const confirmFill = () => {
    Alert.alert('Fill dummy data?', 'This will add realistic sample data and replace any previous Lifio dummy data.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Fill Dummy Data',
        onPress: async () => {
          try {
            await fillDummyData();
            showToast('Dummy data added ✓');
          } catch (error) {
            Alert.alert('Could not add dummy data', error.message || 'Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <Screen>
      <AppHeader
        title="Settings"
        showSettings={false}
        onBack={canGoBack ? () => navigation.goBack() : undefined}
      />
      
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.iconWrap}>
            <Ionicons name="flask" size={24} color={COLORS.health} />
          </View>
          <View style={styles.titleColumn}>
            <SectionHeader>Development</SectionHeader>
            <Text style={styles.title}>Sample Data Generator</Text>
          </View>
        </View>
        <Text style={styles.body}>
          Populate your logs, habits list, notes space, and mood calendar with realistic demo entries to test the dashboard statistics.
        </Text>
        <PrimaryButton title="Fill Dummy Data" color={COLORS.health} onPress={confirmFill} />
      </View>

      <View style={[styles.card, styles.aboutCard]}>
        <View style={styles.headerRow}>
          <View style={[styles.iconWrap, { backgroundColor: COLORS.accentLight.habits }]}>
            <Ionicons name="sparkles" size={22} color={COLORS.habits} />
          </View>
          <View style={styles.titleColumn}>
            <SectionHeader>About</SectionHeader>
            <Text style={styles.title}>Lifio Tracker</Text>
          </View>
        </View>
        <Text style={styles.body}>
          A minimal daily journal and personal logging companion designed for mindful momentum.
        </Text>
        <Text style={styles.version}>Version 1.0.0 (Production)</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: 16,
    padding: 20,
    ...SHADOWS.subtle,
  },
  aboutCard: {
    marginTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: COLORS.accentLight.health,
    borderRadius: RADIUS.pill,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  titleColumn: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  body: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  version: {
    color: COLORS.textHint,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
});
