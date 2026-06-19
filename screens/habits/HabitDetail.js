import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { format, isSameMonth, parseISO } from 'date-fns';
import { COLORS } from '../../constants/colors';
import { AppHeader } from '../../components/AppHeader';
import { MetricCard } from '../../components/MetricCard';
import { Screen } from '../../components/Screen';
import { SectionHeader } from '../../components/SectionHeader';
import { useHabits } from '../../hooks/useHabits';
import { displayDate, isFutureDate, monthGridDays, todayKey } from '../../utils/dates';
import { RADIUS, SHADOWS } from '../../constants/theme';

export default function HabitDetail({ navigation, route }) {
  const { habits, isDone, getStreak, getBestStreak, getDayCompletionPercent } = useHabits();
  const habit = habits.find((item) => item.id === route.params?.habit?.id) || route.params?.habit;
  const month = new Date();
  const days = monthGridDays(month);

  if (!habit) {
    return (
      <Screen>
        <AppHeader title="Habit" onBack={() => navigation.goBack()} />
        <Text>Habit not found.</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <AppHeader
        title={habit.name}
        onBack={() => navigation.goBack()}
        rightIcon="pencil"
        accent={COLORS.habits}
        onRight={() => navigation.navigate('HabitEdit', { habit })}
      />
      <View style={styles.grid}>
        <MetricCard value={getStreak(habit)} label="Current streak" accent={COLORS.habits} />
        <MetricCard value={`${getDayCompletionPercent(todayKey())}%`} label="Today all habits" accent={COLORS.habits} />
        <MetricCard value={getBestStreak(habit)} label="Best streak" accent={COLORS.habits} />
      </View>
      <View style={styles.calendarCard}>
        <SectionHeader>{format(month, 'MMMM yyyy')}</SectionHeader>
        <View style={styles.weekHeader}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, index) => (
            <Text key={`${d}-${index}`} style={styles.weekText}>{d}</Text>
          ))}
        </View>
        <View style={styles.calendar}>
          {days.map((day) => {
            const key = format(day, 'yyyy-MM-dd');
            const done = isDone(habit.id, key);
            const inMonth = isSameMonth(day, month);
            const future = isFutureDate(day);
            return (
              <View key={key} style={styles.dayCell}>
                <View
                  style={[
                    styles.dayDot,
                    done ? styles.done : null,
                    !done && inMonth && !future ? styles.missed : null,
                    key === todayKey() ? styles.today : null,
                    !inMonth ? styles.outside : null,
                  ]}
                >
                  <Text style={[styles.dayText, done ? styles.doneText : null]}>{format(day, 'd')}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.habits }]} />
          <Text style={styles.legendText}>Done</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.pillMindful.bg }]} />
          <Text style={styles.legendText}>Missed</Text>
        </View>
      </View>
      <View style={styles.infoCard}>
        <Ionicons name="information-circle-outline" size={16} color={COLORS.textSecondary} />
        <Text selectable style={styles.info}>Started on {displayDate(habit.createdAt)} · Goal is {habit.goal}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', gap: 8 },
  calendarCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: 12,
    padding: 16,
    ...SHADOWS.subtle,
  },
  weekHeader: { flexDirection: 'row', marginBottom: 6 },
  weekText: { color: COLORS.textHint, flex: 1, fontSize: 11, fontWeight: '600', textAlign: 'center' },
  calendar: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 8 },
  dayCell: { alignItems: 'center', width: `${100 / 7}%` },
  dayDot: { alignItems: 'center', borderRadius: 16, height: 32, justifyContent: 'center', width: 32 },
  done: { backgroundColor: COLORS.habits },
  missed: { backgroundColor: COLORS.pillMindful.bg },
  today: { borderColor: COLORS.habits, borderWidth: 1.5 },
  outside: { opacity: 0.28 },
  dayText: { color: COLORS.textSecondary, fontSize: 11 },
  doneText: { color: COLORS.white, fontWeight: '700' },
  legend: { flexDirection: 'row', gap: 20, paddingHorizontal: 4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '500' },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: 12,
    gap: 8,
    marginTop: 4,
    ...SHADOWS.subtle,
  },
  info: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '500', flex: 1 },
});
