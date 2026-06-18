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
      <View style={styles.section}>
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
        <Text style={styles.legendText}>● Done</Text>
        <Text style={styles.legendText}>○ Missed</Text>
      </View>
      <Text selectable style={styles.info}>Best streak: {getBestStreak(habit)} days · Started {displayDate(habit.createdAt)}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', gap: 8 },
  section: { gap: 8 },
  weekHeader: { flexDirection: 'row' },
  weekText: { color: COLORS.textHint, flex: 1, fontSize: 10, textAlign: 'center' },
  calendar: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 8 },
  dayCell: { alignItems: 'center', width: `${100 / 7}%` },
  dayDot: { alignItems: 'center', borderRadius: 16, height: 32, justifyContent: 'center', width: 32 },
  done: { backgroundColor: COLORS.habits },
  missed: { backgroundColor: COLORS.pillMindful.bg },
  today: { borderColor: COLORS.habits, borderWidth: 1.5 },
  outside: { opacity: 0.28 },
  dayText: { color: COLORS.textSecondary, fontSize: 11 },
  doneText: { color: COLORS.white, fontWeight: '700' },
  legend: { flexDirection: 'row', gap: 16 },
  legendText: { color: COLORS.textSecondary, fontSize: 12 },
  info: { color: COLORS.textSecondary, fontSize: 12 },
});
