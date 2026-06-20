import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { CATEGORIES } from '../../constants/categories';
import { AppHeader } from '../../components/AppHeader';
import { EmptyState } from '../../components/EmptyState';
import { HabitRow } from '../../components/Rows';
import { Screen } from '../../components/Screen';
import { SectionHeader } from '../../components/SectionHeader';
import { FAB } from '../../components/FAB';
import { useHabits } from '../../hooks/useHabits';
import { displayDate, todayKey, shouldCountForGoal } from '../../utils/dates';
import { RADIUS, SHADOWS } from '../../constants/theme';

export default function HabitsToday({ navigation }) {
  const { habits, loading, isDone, toggleCompletion, getStreak, getWeekPercents, deleteHabit } = useHabits();
  const { colors } = useTheme();
  
  const activeHabits = habits.filter((h) => shouldCountForGoal(todayKey(), h.goal));
  const doneCount = activeHabits.filter((habit) => isDone(habit.id)).length;
  const week = getWeekPercents();

  const quickOptions = (habit) =>
    Alert.alert(habit.name, 'Quick options', [
      { text: 'Edit', onPress: () => navigation.navigate('HabitEdit', { habit }) },
      { text: 'Delete', style: 'destructive', onPress: () => deleteHabit(habit.id) },
      { text: 'Cancel', style: 'cancel' },
    ]);

  return (
    <View style={styles.container}>
      <Screen loading={loading}>
        <AppHeader title="Habits" />
        <View style={styles.section}>
          <SectionHeader>Today — {doneCount} of {activeHabits.length} done</SectionHeader>
          {activeHabits.length ? (
            activeHabits.map((habit) => {
              const category = CATEGORIES.find((item) => item.key === habit.category) || CATEGORIES[CATEGORIES.length - 1];
              return (
                <HabitRow
                  key={habit.id}
                  habit={habit}
                  done={isDone(habit.id)}
                  streak={getStreak(habit)}
                  category={category}
                  onToggle={() => toggleCompletion(habit.id)}
                  onPress={() => navigation.navigate('HabitDetail', { habit })}
                  onLongPress={() => quickOptions(habit)}
                />
              );
            })
          ) : (
            <EmptyState
              icon="checkmark-circle-outline"
              message={habits.length ? "No habits scheduled for today." : "No habits yet. Build your first one."}
              actionLabel="+ Add habit"
              action={() => navigation.navigate('AddHabit')}
              accent={colors.habits}
            />
          )}
        </View>
        {habits.length ? (
          <View style={styles.section}>
            <SectionHeader>Weekly completion</SectionHeader>
            <View style={[styles.weekBars, { backgroundColor: colors.white, borderColor: colors.borderLight }]}>
              {week.map((day) => {
                const isToday = day.date === todayKey();
                return (
                  <View key={day.date} style={styles.barItem}>
                    <View style={[styles.barTrack, { backgroundColor: colors.surface }]}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            height: `${day.percent || 0}%`,
                            backgroundColor: isToday ? colors.habits : colors.accentLight.habits,
                            opacity: day.percent === 0 ? 0 : 1,
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.dayLabel, { color: colors.textSecondary }, isToday ? { color: colors.habits, fontWeight: '800' } : null]}>
                      {displayDate(day.date, 'EEE')}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}
      </Screen>
      {!loading && habits.length > 0 && (
        <View style={styles.fabWrap}>
          <FAB color={colors.habits} onPress={() => navigation.navigate('AddHabit')} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  section: { gap: 12, marginBottom: 8 },
  weekBars: {
    alignItems: 'flex-end',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    minHeight: 136,
    paddingHorizontal: 16,
    paddingVertical: 14,
    ...SHADOWS.subtle,
  },
  barItem: { alignItems: 'center', flex: 1, gap: 8 },
  barTrack: { borderRadius: RADIUS.pill, height: 80, justifyContent: 'flex-end', overflow: 'hidden', width: 14 },
  barFill: { borderRadius: RADIUS.pill, width: 14 },
  dayLabel: { fontSize: 10, fontWeight: '500' },
  fabWrap: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    ...SHADOWS.glow,
  },
});
