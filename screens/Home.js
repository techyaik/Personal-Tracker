import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { AppHeader } from '../components/AppHeader';
import { Screen } from '../components/Screen';
import { useHabits } from '../hooks/useHabits';
import { useHealth } from '../hooks/useHealth';
import { useJournal } from '../hooks/useJournal';
import { useNotes } from '../hooks/useNotes';
import { MOODS } from '../constants/categories';
import { displayDate, todayKey } from '../utils/dates';
import { RADIUS, SHADOWS } from '../constants/theme';
import { showToast } from '../utils/feedback';

export default function Home({ navigation }) {
  const { colors } = useTheme();

  const { habits, completions, getDayCompletionPercent, getStreak, toggleCompletion, isDone } = useHabits();
  const { logs, getTodayLog } = useHealth();
  const { entries, addEntry, getMoodForDate } = useJournal();
  const { notes } = useNotes();

  const today = getTodayLog();
  const todayMood = getMoodForDate(todayKey());
  const activeHabits = habits;
  const completedHabitsCount = activeHabits.filter((h) => isDone(h.id, todayKey())).length;
  
  // Calculate best streak across habits
  const streak = activeHabits.length > 0 ? Math.max(...activeHabits.map(h => getStreak(h)), 0) : 0;
  const habitsCompletionPercent = getDayCompletionPercent(todayKey());

  const currentNote = notes[0];
  const lastEntry = entries[0];

  const handleQuickMood = async (moodKey) => {
    const selectedMood = MOODS.find((m) => m.key === moodKey);
    const newEntry = {
      id: 'journal_' + Date.now().toString(),
      title: 'Daily Mood Log',
      body: `I logged my mood as ${selectedMood?.label} ${selectedMood?.emoji} from the Home dashboard.`,
      mood: moodKey,
      date: todayKey(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      await addEntry(newEntry);
      showToast('Mood logged successfully!');
    } catch (e) {
      console.log('Error logging quick mood:', e);
    }
  };

  return (
    <Screen>
      <AppHeader title="Home" />

      {/* Welcome Banner */}
      <View style={styles.welcomeRow}>
        <View>
          <Text style={[styles.welcomeSub, { color: colors.textSecondary }]}>
            {displayDate(todayKey(), 'EEEE, MMMM d')}
          </Text>
          <Text style={[styles.welcomeTitle, { color: colors.textPrimary }]}>
            Mindful Momentum
          </Text>
        </View>
      </View>

      {/* First Bento Grid Row: Mood & Habits Progress */}
      <View style={styles.gridRow}>
        {/* Mood Card */}
        <View style={[styles.bentoCard, { backgroundColor: colors.white, borderColor: colors.borderLight }]}>
          <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>Daily Mood</Text>
          {todayMood ? (
            <View style={styles.moodDetail}>
              <Text style={styles.hugeEmoji}>
                {MOODS.find((m) => m.key === todayMood)?.emoji || '😊'}
              </Text>
              <Text style={[styles.moodLabel, { color: colors.textPrimary }]}>
                {MOODS.find((m) => m.key === todayMood)?.label || 'Logged'}
              </Text>
            </View>
          ) : (
            <View style={styles.moodPickerContainer}>
              <Text style={[styles.moodPrompt, { color: colors.textPrimary }]}>How are you feeling today?</Text>
              <View style={styles.quickMoodRow}>
                {MOODS.slice(0, 5).map((mood) => (
                  <Pressable
                    key={mood.key}
                    onPress={() => handleQuickMood(mood.key)}
                    style={[styles.miniEmojiCircle, { backgroundColor: colors.surface }]}
                  >
                    <Text style={styles.miniEmoji}>{mood.emoji}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Habits Progress Card */}
        <View style={[styles.bentoCard, { backgroundColor: colors.white, borderColor: colors.borderLight }]}>
          <View style={styles.rowBetween}>
            <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>Habits Today</Text>
            <View style={[styles.streakBadge, { backgroundColor: colors.accentLight.habits }]}>
              <Ionicons name="flame" size={12} color={colors.habits} />
              <Text style={[styles.streakText, { color: colors.habits }]}>{streak}d</Text>
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <Text style={[styles.progressNumber, { color: colors.textPrimary }]}>
              {completedHabitsCount}/{activeHabits.length}
            </Text>
            <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>completed</Text>

            <View style={[styles.barBg, { backgroundColor: colors.borderLight }]}>
              <View style={[styles.barFill, { width: `${habitsCompletionPercent}%`, backgroundColor: colors.habits }]} />
            </View>
          </View>
        </View>
      </View>

      {/* Second Bento Grid Row: Health Metrics Grid (Full width) */}
      <View style={[styles.largeBentoCard, { backgroundColor: colors.white, borderColor: colors.borderLight }]}>
        <View style={styles.rowBetween}>
          <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>Today's Health Metrics</Text>
          <Pressable onPress={() => navigation.navigate('HealthTab')}>
            <Text style={[styles.shortcutLink, { color: colors.health }]}>More</Text>
          </Pressable>
        </View>
        
        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <Ionicons name="walk" size={20} color={colors.health} />
            <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
              {today?.steps ? Number(today.steps).toLocaleString() : '—'}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textHint }]}>Steps</Text>
          </View>

          <View style={styles.metricItem}>
            <Ionicons name="bed" size={20} color={colors.health} />
            <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
              {today?.sleep ? `${today.sleep}h` : '—'}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textHint }]}>Sleep</Text>
          </View>

          <View style={styles.metricItem}>
            <Ionicons name="water" size={20} color={colors.health} />
            <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
              {today?.water ? `${today.water}/8` : '—'}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textHint }]}>Water</Text>
          </View>

          <View style={styles.metricItem}>
            <Ionicons name="scale" size={20} color={colors.health} />
            <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
              {today?.weight ? `${today.weight}k` : '—'}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textHint }]}>Weight</Text>
          </View>
        </View>
      </View>

      {/* Third Bento Grid Row: Recent Note & Recent Journal */}
      <View style={styles.gridRow}>
        {/* Note Card */}
        <View style={[styles.bentoCard, { backgroundColor: colors.white, borderColor: colors.borderLight }]}>
          <View style={styles.rowBetween}>
            <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>Notes Summary</Text>
            <Pressable onPress={() => navigation.navigate('NotesTab')}>
              <Ionicons name="arrow-forward" size={14} color={colors.notes} />
            </Pressable>
          </View>
          {currentNote ? (
            <View style={styles.previewInfo}>
              <Text style={[styles.previewTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                {currentNote.title || 'Untitled'}
              </Text>
              <Text style={[styles.previewBody, { color: colors.textSecondary }]} numberOfLines={2}>
                {currentNote.body || 'Empty note'}
              </Text>
            </View>
          ) : (
            <Text style={[styles.emptyPreview, { color: colors.textHint }]}>No notes written yet.</Text>
          )}
        </View>

        {/* Journal Card */}
        <View style={[styles.bentoCard, { backgroundColor: colors.white, borderColor: colors.borderLight }]}>
          <View style={styles.rowBetween}>
            <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>Recent Journal</Text>
            <Pressable onPress={() => navigation.navigate('JournalTab')}>
              <Ionicons name="arrow-forward" size={14} color={colors.journal} />
            </Pressable>
          </View>
          {lastEntry ? (
            <View style={styles.previewInfo}>
              <Text style={[styles.previewTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                {lastEntry.title || 'Untitled entry'}
              </Text>
              <Text style={[styles.previewBody, { color: colors.textSecondary }]} numberOfLines={2}>
                {lastEntry.body || 'Empty entry'}
              </Text>
            </View>
          ) : (
            <Text style={[styles.emptyPreview, { color: colors.textHint }]}>No journal entries yet.</Text>
          )}
        </View>
      </View>

      {/* Shortcuts grid */}
      <View style={styles.shortcutsSection}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Quick Actions</Text>
        <View style={styles.shortcutGrid}>
          <Pressable
            onPress={() => navigation.navigate('HealthTab', { screen: 'HealthLogEntry', params: { date: todayKey() } })}
            style={[styles.shortcutCard, { backgroundColor: colors.white, borderColor: colors.borderLight }]}
          >
            <Ionicons name="heart" size={18} color={colors.health} />
            <Text style={[styles.shortcutLabel, { color: colors.textPrimary }]}>Log Health</Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('HabitsTab', { screen: 'AddHabit' })}
            style={[styles.shortcutCard, { backgroundColor: colors.white, borderColor: colors.borderLight }]}
          >
            <Ionicons name="checkmark-circle" size={18} color={colors.habits} />
            <Text style={[styles.shortcutLabel, { color: colors.textPrimary }]}>Add Habit</Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('NotesTab', { screen: 'NoteEditor' })}
            style={[styles.shortcutCard, { backgroundColor: colors.white, borderColor: colors.borderLight }]}
          >
            <Ionicons name="document-text" size={18} color={colors.notes} />
            <Text style={[styles.shortcutLabel, { color: colors.textPrimary }]}>New Note</Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('JournalTab', { screen: 'JournalNewEntry' })}
            style={[styles.shortcutCard, { backgroundColor: colors.white, borderColor: colors.borderLight }]}
          >
            <Ionicons name="book" size={18} color={colors.journal} />
            <Text style={[styles.shortcutLabel, { color: colors.textPrimary }]}>Write Journal</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  welcomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  welcomeSub: {
    fontSize: 12,
    fontWeight: '600',
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '800',
  },
  gridRow: {
    flexDirection: 'row',
    gap: 8,
  },
  bentoCard: {
    flex: 1,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: 14,
    minHeight: 120,
    justifyContent: 'space-between',
    ...SHADOWS.subtle,
  },
  largeBentoCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: 14,
    minHeight: 110,
    justifyContent: 'space-between',
    ...SHADOWS.subtle,
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shortcutLink: {
    fontSize: 11,
    fontWeight: '700',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.pill,
  },
  streakText: {
    fontSize: 9,
    fontWeight: '800',
  },
  moodDetail: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 4,
    marginTop: 6,
  },
  hugeEmoji: {
    fontSize: 32,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  moodPickerContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 4,
    gap: 6,
  },
  moodPrompt: {
    fontSize: 11,
    fontWeight: '600',
  },
  quickMoodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  miniEmojiCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniEmoji: {
    fontSize: 15,
  },
  progressContainer: {
    marginTop: 10,
    gap: 2,
  },
  progressNumber: {
    fontSize: 22,
    fontWeight: '800',
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  barBg: {
    height: 5,
    borderRadius: RADIUS.pill,
    marginTop: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: RADIUS.pill,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '600',
  },
  previewInfo: {
    marginTop: 8,
    gap: 2,
  },
  previewTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  previewBody: {
    fontSize: 11,
    lineHeight: 14,
  },
  emptyPreview: {
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 8,
  },
  shortcutsSection: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 4,
  },
  shortcutGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  shortcutCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    gap: 8,
    ...SHADOWS.subtle,
  },
  shortcutLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
});
