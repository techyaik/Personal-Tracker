import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addMonths, format, isSameMonth } from 'date-fns';
import { COLORS } from '../../constants/colors';
import { MOODS } from '../../constants/categories';
import { AppHeader } from '../../components/AppHeader';
import { MetricCard } from '../../components/MetricCard';
import { Screen } from '../../components/Screen';
import { SectionHeader } from '../../components/SectionHeader';
import { useJournal } from '../../hooks/useJournal';
import { isFutureDate, monthGridDays, todayKey } from '../../utils/dates';

export default function MoodCalendar({ navigation }) {
  const { entries, getMoodForDate } = useJournal();
  const [month, setMonth] = useState(new Date());
  const days = monthGridDays(month);
  const monthEntries = useMemo(() => entries.filter((entry) => entry.date.startsWith(format(month, 'yyyy-MM'))), [entries, month]);
  const stats = useMemo(() => {
    const counts = {};
    monthEntries.forEach((entry) => {
      counts[entry.mood] = (counts[entry.mood] || 0) + 1;
    });
    const commonKey = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
    return {
      common: MOODS.find((mood) => mood.key === commonKey)?.emoji || '—',
      positive: (counts.happy || 0) + (counts.excited || 0),
      heavy: (counts.sad || 0) + (counts.stressed || 0),
    };
  }, [monthEntries]);

  return (
    <Screen>
      <AppHeader title="Mood calendar" onBack={() => navigation.goBack()} />
      <View style={styles.monthNav}>
        <Pressable onPress={() => setMonth((current) => addMonths(current, -1))} style={styles.arrow}>
          <Ionicons name="chevron-back" size={20} color={COLORS.journal} />
        </Pressable>
        <Text selectable style={styles.month}>{format(month, 'MMMM yyyy')}</Text>
        <Pressable onPress={() => setMonth((current) => addMonths(current, 1))} style={styles.arrow}>
          <Ionicons name="chevron-forward" size={20} color={COLORS.journal} />
        </Pressable>
      </View>
      <View style={styles.grid}>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, index) => (
          <Text key={`${d}-${index}`} style={styles.weekText}>{d}</Text>
        ))}
        {days.map((day) => {
          const key = format(day, 'yyyy-MM-dd');
          const moodKey = getMoodForDate(key);
          const mood = MOODS.find((item) => item.key === moodKey);
          return (
            <View key={key} style={styles.dayCell}>
              <View
                style={[
                  styles.day,
                  key === todayKey() ? styles.today : null,
                  !isSameMonth(day, month) || isFutureDate(day) ? styles.dim : null,
                ]}
              >
                <Text style={styles.dayNumber}>{format(day, 'd')}</Text>
                <Text style={styles.moodEmoji}>{mood?.emoji || ''}</Text>
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.section}>
        <SectionHeader>Monthly stats</SectionHeader>
        <View style={styles.stats}>
          <MetricCard value={stats.common} label="Common mood" accent={COLORS.journal} />
          <MetricCard value={stats.positive} label="Happy + excited" accent={COLORS.journal} />
          <MetricCard value={stats.heavy} label="Sad + stressed" accent={COLORS.journal} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  monthNav: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  arrow: { alignItems: 'center', backgroundColor: COLORS.white, borderColor: COLORS.border, borderRadius: 18, borderWidth: 1, height: 36, justifyContent: 'center', width: 36 },
  month: { color: COLORS.textPrimary, fontSize: 17, fontWeight: '700' },
  grid: { backgroundColor: COLORS.white, borderColor: COLORS.border, borderRadius: 8, borderWidth: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 8, rowGap: 8 },
  weekText: { color: COLORS.textHint, fontSize: 10, textAlign: 'center', width: `${100 / 7}%` },
  dayCell: { alignItems: 'center', width: `${100 / 7}%` },
  day: { alignItems: 'center', borderRadius: 18, height: 44, justifyContent: 'center', width: 40 },
  today: { borderColor: COLORS.journal, borderWidth: 1.5 },
  dim: { opacity: 0.32 },
  dayNumber: { color: COLORS.textSecondary, fontSize: 10 },
  moodEmoji: { fontSize: 16 },
  section: { gap: 8 },
  stats: { flexDirection: 'row', gap: 8 },
});
