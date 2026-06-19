import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { AppHeader } from '../../components/AppHeader';
import { EmptyState } from '../../components/EmptyState';
import { InputField } from '../../components/InputField';
import { NoteCard } from '../../components/NoteCard';
import { Pill } from '../../components/Pill';
import { Screen } from '../../components/Screen';
import { useNotes } from '../../hooks/useNotes';
import { RADIUS, SHADOWS } from '../../constants/theme';

export default function NotesList({ navigation, route }) {
  const { notes, loading, deleteNote, getAllTags } = useNotes();
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState(route.params?.tag || 'All');
  const tags = getAllTags();

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return notes.filter((note) => {
      const matchesQuery = !normalized || `${note.title} ${note.body}`.toLowerCase().includes(normalized);
      const matchesTag = tag === 'All' || note.tags?.includes(tag);
      return matchesQuery && matchesTag;
    });
  }, [notes, query, tag]);

  const header = (
    <>
      <AppHeader title="Notes" rightIcon="add" accent={COLORS.notes} onRight={() => navigation.navigate('NoteEditor')} />
      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color={COLORS.textHint} />
        <InputField value={query} onChangeText={setQuery} placeholder="Search notes" style={styles.searchInput} />
        <Pressable onPress={() => navigation.navigate('TagFilter')} style={styles.tagButton}>
          <Ionicons name="pricetags-outline" size={18} color={COLORS.notes} />
        </Pressable>
      </View>
      <View style={styles.tags}>
        {['All', ...tags].map((item) => (
          <Pill key={item} label={item} selected={tag === item} onPress={() => setTag(item)} palette={COLORS.pillFitness} />
        ))}
      </View>
    </>
  );

  return (
    <Screen loading={loading} scroll={false}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onPress={() => navigation.navigate('NoteDetail', { note: item })}
            onDelete={() => deleteNote(item.id)}
          />
        )}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <EmptyState
            icon="document-text-outline"
            message="Nothing written yet. Start a note."
            actionLabel="+ New note"
            action={() => navigation.navigate('NoteEditor')}
            accent={COLORS.notes}
          />
        }
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchRow: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  searchInput: { flex: 1 },
  tagButton: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    height: 46,
    justifyContent: 'center',
    width: 46,
    ...SHADOWS.subtle,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  list: { gap: 16, padding: 16 },
});
