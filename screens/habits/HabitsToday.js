import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { CATEGORIES } from '../../constants/categories';
import { AppHeader } from '../../components/AppHeader';
import { EmptyState } from '../../components/EmptyState';
import { HabitRow } from '../../components/Rows';
import { Screen } from '../../components/Screen';
import { SectionHeader } from '../../components/SectionHeader';
import { useHabits } from '../../hooks/useHabits';
import { displayDate, todayKey } from '../../utils/dates';
import { RADIUS, SHADOWS } from '../../constants/theme';

export default function HabitsToday({ navigation }) {
  const { habits, loading, isDone, toggleCompletion, getStreak, getWeekPercents, deleteHabit } = useHabits();
  const doneCount = habits.filter((habit) => isDone(habit.id)).length;
  const week = getWeekPercents();

  const quickOptions = (habit) =>
    Alert.alert(habit.name, 'Quick options', [
      { text: 'Edit', onPress: () => navigation.navigate('HabitEdit', { habit }) },
      { text: 'Delete', style: 'destructive', onPress: () => deleteHabit(habit.id) },
      { text: 'Cancel', style: 'cancel' },
    ]);

  return (
    <Screen loading={loading}>
      <AppHeader title="Habits" rightIcon="add" accent={COLORS.habits} onRight={() => navigation.navigate('AddHabit')} />
      <View style={styles.section}>
        <SectionHeader>Today — {doneCount} of {habits.length} done</SectionHeader>
        {habits.length ? (
          habits.map((habit) => {
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
            message="No habits yet. Build your first one."
            actionLabel="+ Add habit"
            action={() => navigation.navigate('AddHabit')}
            accent={COLORS.habits}
          />
        )}
      </View>
      {habits.length ? (
        <View style={styles.section}>
          <SectionHeader>Weekly completion</SectionHeader>
          <View style={styles.weekBars}>
            {week.map((day) => {
              const isToday = day.date === todayKey();
              return (
                <View key={day.date} style={styles.barItem}>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${day.percent || 0}%`,
                          backgroundColor: isToday ? COLORS.habits : COLORS.accentLight.habits,
                          opacity: day.percent === 0 ? 0 : 1,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.dayLabel, isToday ? styles.todayLabel : null]}>
                    {displayDate(day.date, 'EEE')}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12, marginBottom: 8 },
  weekBars: {
    alignItems: 'flex-end',
    backgroundColor: COLORS.white,
    borderColor: COLORS.borderLight,
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
  barTrack: { backgroundColor: COLORS.surface, borderRadius: RADIUS.pill, height: 80, justifyContent: 'flex-end', overflow: 'hidden', width: 14 },
  barFill: { borderRadius: RADIUS.pill, width: 14 },
  dayLabel: { color: COLORS.textSecondary, fontSize: 10, fontWeight: '500' },
  todayLabel: { color: COLORS.habits, fontWeight: '800' },
});
