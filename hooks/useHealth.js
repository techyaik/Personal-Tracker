import { useMemo } from 'react';
import { parseISO } from 'date-fns';
import { useStoredList } from './useStoredList';
import { todayKey } from '../utils/dates';

const KEY = 'health_logs';

export function useHealth() {
  const { items, loading, saveAll, refresh } = useStoredList(KEY);
  const logs = useMemo(
    () => [...items].sort((a, b) => parseISO(b.date) - parseISO(a.date) || b.createdAt.localeCompare(a.createdAt)),
    [items]
  );

  const addLog = async (log) => saveAll([...items, log]);
  const updateLog = async (id, updates) => saveAll(items.map((log) => (log.id === id ? { ...log, ...updates } : log)));
  const deleteLog = async (id) => saveAll(items.filter((log) => log.id !== id));
  const getTodayLog = () => logs.find((log) => log.date === todayKey());
  const getLogsByDate = (date) => logs.filter((log) => log.date === date);

  return { logs, loading, refresh, addLog, updateLog, deleteLog, getTodayLog, getLogsByDate };
}
