import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { useTheme } from '../../theme/ThemeContext';
import { MOODS } from '../../constants/categories';
import { AppHeader } from '../../components/AppHeader';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { SectionHeader } from '../../components/SectionHeader';
import { FAB } from '../../components/FAB';
import { useJournal } from '../../hooks/useJournal';
import { displayDate } from '../../utils/dates';
import { RADIUS, SHADOWS } from '../../constants/theme';

export default function JournalList({ navigation }) {
  const { entries, loading } = useJournal();
  const { colors } = useTheme();

  const header = (
    <View style={styles.headerContainer}>
      <AppHeader title="Journal" />
      <Pressable
        onPress={() => navigation.navigate('MoodCalendar')}
        style={[styles.calendarButton, { backgroundColor: colors.white, borderColor: colors.borderLight }]}
      >
        <Ionicons name="calendar-outline" size={18} color={colors.journal} />
        <Text style={[styles.calendarText, { color: colors.journal }]}>Mood calendar</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
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
                <Pressable
                  style={[styles.row, { backgroundColor: colors.white, borderColor: colors.borderLight }]}
                  onPress={() => navigation.navigate('JournalEntryDetail', { entry })}
                >
                  <Text style={styles.emoji}>{mood?.emoji}</Text>
                  <View style={styles.textWrap}>
                    <View style={styles.titleRow}>
                      <Text selectable style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>{entry.title || 'Untitled'}</Text>
                      <Text selectable style={[styles.date, { color: colors.textSecondary }]}>{displayDate(entry.date, 'MMM d')}</Text>
                    </View>
                    <Text selectable style={[styles.preview, { color: colors.textSecondary }]} numberOfLines={2}>{entry.body}</Text>
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
              accent={colors.journal}
            />
          }
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={7}
        />
      </Screen>
      {!loading && entries.length > 0 && (
        <View style={styles.fabWrap}>
          <FAB color={colors.journal} onPress={() => navigation.navigate('JournalNewEntry')} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: { gap: 10, paddingHorizontal: 16, paddingTop: 8 },
  calendarButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    ...SHADOWS.subtle,
  },
  calendarText: { fontSize: 13, fontWeight: '600' },
  list: { gap: 16, paddingVertical: 16 },
  group: { gap: 8, paddingHorizontal: 16 },
  row: {
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
  title: { flex: 1, fontSize: 15, fontWeight: '700' },
  date: { fontSize: 11 },
  preview: { fontSize: 13, lineHeight: 18 },
  fabWrap: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    ...SHADOWS.glow,
  },
});
