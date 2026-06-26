import { useMemo } from 'react';
import { parseISO } from 'date-fns';
import { useStoredList } from './useStoredList';
import { todayKey } from '../utils/dates';

const KEY = 'health_logs';

export const HEALTH_MOODS = ['Great', 'Good', 'Okay', 'Low', 'Stressed'];
export const ENERGY_LEVELS = ['High', 'Steady', 'Low', 'Drained'];
export const SYMPTOMS = ['Headache', 'Cramps', 'Fatigue', 'Acne', 'Mood changes', 'Sore throat', 'Cough', 'Other'];
export const FLOW_LEVELS = ['Light', 'Medium', 'Heavy', 'Spotting'];

export function useHealth() {
  const { items, loading, saveAll, refresh } = useStoredList(KEY);
  const logs = useMemo(
    () =>
      [...items].sort((a, b) => {
        const dateDiff = parseISO(b.date) - parseISO(a.date);
        if (dateDiff) return dateDiff;
        return (b.createdAt || '').localeCompare(a.createdAt || '');
      }),
    [items]
  );

  const addLog = async (log) => {
    const withoutSameDate = items.filter((item) => item.date !== log.date);
    await saveAll([...withoutSameDate, log]);
  };
  const updateLog = async (id, updates) => saveAll(items.map((log) => (log.id === id ? { ...log, ...updates } : log)));
  const deleteLog = async (id) => saveAll(items.filter((log) => log.id !== id));
  const getTodayLog = () => logs.find((log) => log.date === todayKey());
  const getLogsByDate = (date) => logs.filter((log) => log.date === date);

  return { logs, loading, refresh, addLog, updateLog, deleteLog, getTodayLog, getLogsByDate };
}
