import { useMemo } from 'react';
import { useStoredList } from './useStoredList';

const KEY = 'notes_list';

export function useNotes() {
  const { items, loading, saveAll, refresh } = useStoredList(KEY);
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

  const addNote = async (note) => saveAll([...items, note]);
  const updateNote = async (id, updates) =>
    saveAll(items.map((note) => (note.id === id ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note)));
  const deleteNote = async (id) => saveAll(items.filter((note) => note.id !== id));
  const getAllTags = () => allTags;

  return { notes, loading, refresh, addNote, updateNote, deleteNote, getAllTags };
}
