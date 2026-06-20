import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { AppHeader } from '../../components/AppHeader';
import { Pill } from '../../components/Pill';
import { Screen } from '../../components/Screen';
import { useNotes } from '../../hooks/useNotes';
import { displayDate } from '../../utils/dates';
import { RADIUS, SHADOWS } from '../../constants/theme';

export default function NoteDetail({ navigation, route }) {
  const { notes } = useNotes();
  const { colors } = useTheme();
  
  const note = notes.find((item) => item.id === route.params?.note?.id) || route.params?.note;

  if (!note) return null;

  return (
    <Screen>
      <AppHeader title="Note" onBack={() => navigation.goBack()} rightText="Edit" accent={colors.notes} onRight={() => navigation.navigate('NoteEditor', { note })} />
      <View style={[styles.card, { backgroundColor: colors.white, borderColor: colors.borderLight }]}>
        <Text selectable style={[styles.title, { color: colors.textPrimary }]}>{note.title || 'Untitled'}</Text>
        <Text selectable style={[styles.date, { color: colors.textHint }]}>Updated {displayDate(note.updatedAt)}</Text>
        <View style={styles.tags}>
          {note.tags?.map((tag) => <Pill key={tag} label={tag} palette={colors.pillFitness} />)}
        </View>
        <Text selectable style={[styles.body, { color: colors.textPrimary }]}>{note.body}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: RADIUS.lg, borderWidth: 1, gap: 12, padding: 16, ...SHADOWS.subtle },
  title: { fontSize: 22, fontWeight: '700' },
  date: { fontSize: 11 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  body: { fontSize: 15, lineHeight: 23 },
});
