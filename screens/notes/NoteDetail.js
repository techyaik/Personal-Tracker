import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { AppHeader } from '../../components/AppHeader';
import { Pill } from '../../components/Pill';
import { Screen } from '../../components/Screen';
import { useNotes } from '../../hooks/useNotes';
import { displayDate } from '../../utils/dates';
import { RADIUS, SHADOWS } from '../../constants/theme';

export default function NoteDetail({ navigation, route }) {
  const { notes } = useNotes();
  const note = notes.find((item) => item.id === route.params?.note?.id) || route.params?.note;

  if (!note) return null;

  return (
    <Screen>
      <AppHeader title="Note" onBack={() => navigation.goBack()} rightText="Edit" accent={COLORS.notes} onRight={() => navigation.navigate('NoteEditor', { note })} />
      <View style={styles.card}>
        <Text selectable style={styles.title}>{note.title || 'Untitled'}</Text>
        <Text selectable style={styles.date}>Updated {displayDate(note.updatedAt)}</Text>
        <View style={styles.tags}>
          {note.tags?.map((tag) => <Pill key={tag} label={tag} palette={COLORS.pillFitness} />)}
        </View>
        <Text selectable style={styles.body}>{note.body}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.white, borderColor: COLORS.borderLight, borderRadius: RADIUS.lg, borderWidth: 1, gap: 12, padding: 16, ...SHADOWS.subtle },
  title: { color: COLORS.textPrimary, fontSize: 22, fontWeight: '700' },
  date: { color: COLORS.textHint, fontSize: 11 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  body: { color: COLORS.textPrimary, fontSize: 15, lineHeight: 23 },
});
