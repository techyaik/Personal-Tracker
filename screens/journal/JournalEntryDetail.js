import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { MOODS } from '../../constants/categories';
import { AppHeader } from '../../components/AppHeader';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { useJournal } from '../../hooks/useJournal';
import { displayDate } from '../../utils/dates';
import { RADIUS, SHADOWS } from '../../constants/theme';

export default function JournalEntryDetail({ navigation, route }) {
  const { entries, deleteEntry } = useJournal();
  const entry = entries.find((item) => item.id === route.params?.entry?.id) || route.params?.entry;
  if (!entry) return null;
  const mood = MOODS.find((item) => item.key === entry.mood);

  const confirmDelete = () =>
    Alert.alert('Delete entry?', 'This journal entry will be removed permanently.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await deleteEntry(entry.id);
        navigation.navigate('JournalList');
      } },
    ]);

  return (
    <Screen>
      <AppHeader
        title={displayDate(entry.date, 'MMM d')}
        onBack={() => navigation.goBack()}
        rightIcon="pencil"
        accent={COLORS.journal}
        onRight={() => navigation.navigate('JournalNewEntry', { entry })}
      />
      <View style={styles.card}>
        <Text style={styles.emoji}>{mood?.emoji}</Text>
        <Text selectable style={[styles.mood, { color: mood?.color }]}>{mood?.label}</Text>
        <Text selectable style={styles.title}>{entry.title}</Text>
        <Text selectable style={styles.body}>{entry.body}</Text>
        <Text selectable style={styles.footer}>Created {displayDate(entry.createdAt)} · Updated {displayDate(entry.updatedAt)}</Text>
      </View>
      <PrimaryButton title="Delete entry" color={COLORS.danger} onPress={confirmDelete} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.white, borderColor: COLORS.borderLight, borderRadius: RADIUS.lg, borderWidth: 1, gap: 12, padding: 16, ...SHADOWS.subtle },
  emoji: { fontSize: 42, textAlign: 'center' },
  mood: { fontSize: 13, fontWeight: '700', textAlign: 'center' },
  title: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700' },
  body: { color: COLORS.textPrimary, fontSize: 15, lineHeight: 23 },
  footer: { color: COLORS.textHint, fontSize: 10 },
});
