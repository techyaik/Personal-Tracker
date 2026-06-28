import { useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { addDays, differenceInCalendarDays, format, parseISO, subDays } from 'date-fns';
import { useStoredList } from './useStoredList';
import { todayKey, shouldCountForGoal } from '../utils/dates';
import { useTheme } from '../theme/ThemeContext';

const HABITS_KEY = 'habits_list';
const COMPLETIONS_KEY = 'habits_completions';

export function useHabits() {
  const habitsStore = useStoredList(HABITS_KEY);
  const completionsStore = useStoredList(COMPLETIONS_KEY);
  const habits = habitsStore.items;
  const completions = completionsStore.items;
  const loading = habitsStore.loading || completionsStore.loading;
  const { triggerDataRefresh } = useTheme();

  const doneSet = useMemo(
    () => new Set(completions.filter((c) => c.done).map((c) => `${c.habitId}:${c.date}`)),
    [completions]
  );

  const addHabit = async (habit) => {
    await habitsStore.saveAll((current) => [...current, habit]);
    triggerDataRefresh();
  };
  const updateHabit = async (id, updates) => {
    await habitsStore.saveAll((current) => current.map((h) => (h.id === id ? { ...h, ...updates } : h)));
    triggerDataRefresh();
  };
  const deleteHabit = async (id) => {
    await habitsStore.saveAll((current) => current.filter((h) => h.id !== id));
    await completionsStore.saveAll((current) => current.filter((c) => c.habitId !== id));
    triggerDataRefresh();
  };

  const toggleCompletion = async (habitId, date = todayKey()) => {
    if (Platform.OS === 'ios') Haptics.selectionAsync();
    const idx = completions.findIndex((c) => c.habitId === habitId && c.date === date);
    if (idx === -1) {
      await completionsStore.saveAll([...completions, { habitId, date, done: true }]);
      return;
    }
    const next = [...completions];
    next[idx] = { ...next[idx], done: !next[idx].done };
    await completionsStore.saveAll(next);
  };

  const isDone = (habitId, date = todayKey()) => doneSet.has(`${habitId}:${date}`);

  const getStreak = (habit) => {
    const today = parseISO(todayKey());
    const anchor = isDone(habit.id, todayKey()) ? today : subDays(today, 1);
    let streak = 0;
    let cursor = anchor;
    for (let i = 0; i < 730; i += 1) {
      const key = format(cursor, 'yyyy-MM-dd');
      if (!shouldCountForGoal(key, habit.goal)) {
        cursor = subDays(cursor, 1);
        continue;
      }
      if (!isDone(habit.id, key)) break;
      streak += 1;
      cursor = subDays(cursor, 1);
    }
    return streak;
  };

  const getBestStreak = (habit) => {
    const dates = completions
      .filter((c) => c.habitId === habit.id && c.done && shouldCountForGoal(c.date, habit.goal))
      .map((c) => c.date)
      .sort();
    let best = 0;
    let current = 0;
    let previous = null;
    dates.forEach((date) => {
      const expectedGap = previous ? differenceInCalendarDays(parseISO(date), parseISO(previous)) : 1;
      current = expectedGap === 1 ? current + 1 : 1;
      best = Math.max(best, current);
      previous = date;
    });
    return best;
  };

  const getMonthCompletions = (habitId, monthDate = new Date()) =>
    completions.filter((c) => c.habitId === habitId && format(parseISO(c.date), 'yyyy-MM') === format(monthDate, 'yyyy-MM'));

  const getDayCompletionPercent = (date) => {
    const active = habits.filter((h) => shouldCountForGoal(date, h.goal));
    if (!active.length) return 0;
    const done = active.filter((h) => isDone(h.id, date)).length;
    return Math.round((done / active.length) * 100);
  };

  const getWeekPercents = () => {
    const start = subDays(parseISO(todayKey()), 6);
    return Array.from({ length: 7 }, (_, i) => {
      const date = format(addDays(start, i), 'yyyy-MM-dd');
      return { date, percent: getDayCompletionPercent(date) };
    });
  };

  const refresh = async () => Promise.all([habitsStore.refresh(), completionsStore.refresh()]);

  return {
    habits,
    completions,
    loading,
    refresh,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    isDone,
    getStreak,
    getBestStreak,
    getMonthCompletions,
    getDayCompletionPercent,
    getWeekPercents,
  };
}
