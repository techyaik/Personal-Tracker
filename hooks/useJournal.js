import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { useStoredList } from './useStoredList';

const KEY = 'journal_entries';

export function useJournal() {
  const { items, loading, saveAll, refresh } = useStoredList(KEY);
  const entries = useMemo(
    () => [...items].sort((a, b) => parseISO(b.date) - parseISO(a.date) || b.updatedAt.localeCompare(a.updatedAt)),
    [items]
  );
  const moodByDate = useMemo(() => {
    const map = {};
    entries.forEach((entry) => {
      if (!map[entry.date]) map[entry.date] = entry.mood;
    });
    return map;
  }, [entries]);

  const addEntry = async (entry) => saveAll([...items, entry]);
  const updateEntry = async (id, updates) =>
    saveAll(items.map((entry) => (entry.id === id ? { ...entry, ...updates, updatedAt: new Date().toISOString() } : entry)));
  const deleteEntry = async (id) => saveAll(items.filter((entry) => entry.id !== id));

  const getMoodForDate = (date) => {
    return moodByDate[date];
  };

  const getMonthMoods = (monthDate = new Date()) => {
    const monthKey = format(monthDate, 'yyyy-MM');
    return entries.filter((entry) => entry.date.startsWith(monthKey));
  };

  return { entries, loading, refresh, addEntry, updateEntry, deleteEntry, getMoodForDate, getMonthMoods };
}
