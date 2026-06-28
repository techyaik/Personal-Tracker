import { useMemo } from 'react';
import { useStoredList } from './useStoredList';
import { useTheme } from '../theme/ThemeContext';

const KEY = 'notes_list';

export function useNotes() {
  const { items, loading, saveAll, refresh } = useStoredList(KEY);
  const { triggerDataRefresh } = useTheme();

  const notes = useMemo(
    () =>
      [...items].sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return b.updatedAt.localeCompare(a.updatedAt);
      }),
    [items]
  );
  const allTags = useMemo(
    () => [...new Set(items.flatMap((note) => note.tags || []).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [items]
  );

  const addNote = async (note) => {
    await saveAll((current) => [...current, note]);
    triggerDataRefresh();
  };
  const updateNote = async (id, updates) => {
    await saveAll((current) => current.map((note) => (note.id === id ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note)));
    triggerDataRefresh();
  };
  const deleteNote = async (id) => {
    await saveAll((current) => current.filter((note) => note.id !== id));
    triggerDataRefresh();
  };
  const getAllTags = () => allTags;

  return { notes, loading, refresh, addNote, updateNote, deleteNote, getAllTags };
}
