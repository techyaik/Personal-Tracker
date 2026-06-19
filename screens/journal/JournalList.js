import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { COLORS } from '../../constants/colors';
import { MOODS } from '../../constants/categories';
import { AppHeader } from '../../components/AppHeader';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { SectionHeader } from '../../components/SectionHeader';
import { useJournal } from '../../hooks/useJournal';
import { displayDate } from '../../utils/dates';
import { RADIUS, SHADOWS } from '../../constants/theme';

export default function JournalList({ navigation }) {
  const { entries, loading } = useJournal();

  const header = (
    <>
      <AppHeader
        title="Journal"
        rightIcon="add"
        accent={COLORS.journal}
        onRight={() => navigation.navigate('JournalNewEntry')}
      />
      <Pressable onPress={() => navigation.navigate('MoodCalendar')} style={styles.calendarButton}>
        <Ionicons name="calendar-outline" size={18} color={COLORS.journal} />
        <Text style={styles.calendarText}>Mood calendar</Text>
      </Pressable>
    </>
  );

  return (
    <Screen loading={loading} scroll={false}>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={header}
        renderItem={({ item: entry, index }) => {
          const month = format(parseISO(entry.date), 'MMMM yyyy');
          const previousMonth = index > 0 ? format(parseISO(entries[index - 1].date), 'MMMM yyyy') : '';
          const showHeader = month !== previousMonth;
          const mood = MOODS.find((item) => item.key === entry.mood);
          return (
            <View style={styles.group}>
              {showHeader ? <SectionHeader>{month}</SectionHeader> : null}
              <Pressable style={styles.row} onPress={() => navigation.navigate('JournalEntryDetail', { entry })}>
                <Text style={styles.emoji}>{mood?.emoji}</Text>
                <View style={styles.textWrap}>
                  <View style={styles.titleRow}>
                    <Text selectable style={styles.title} numberOfLines={1}>{entry.title || 'Untitled'}</Text>
                    <Text selectable style={styles.date}>{displayDate(entry.date, 'MMM d')}</Text>
                  </View>
                  <Text selectable style={styles.preview} numberOfLines={2}>{entry.body}</Text>
                </View>
              </Pressable>
            </View>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon="book-outline"
            message="No entries yet. How are you feeling?"
            actionLabel="+ Write entry"
            action={() => navigation.navigate('JournalNewEntry')}
            accent={COLORS.journal}
          />
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={7}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  calendarButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.white,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    ...SHADOWS.subtle,
  },
  calendarText: { color: COLORS.journal, fontSize: 13, fontWeight: '600' },
  list: { gap: 16, padding: 16 },
  group: { gap: 8 },
  row: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    ...SHADOWS.subtle,
  },
  emoji: { fontSize: 26 },
  textWrap: { flex: 1, gap: 6 },
  titleRow: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  title: { color: COLORS.textPrimary, flex: 1, fontSize: 15, fontWeight: '700' },
  date: { color: COLORS.textSecondary, fontSize: 11 },
  preview: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 18 },
});
