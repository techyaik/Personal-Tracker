import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addMonths, format, isSameMonth } from 'date-fns';
import { useTheme } from '../../theme/ThemeContext';
import { MOODS } from '../../constants/categories';
import { AppHeader } from '../../components/AppHeader';
import { MetricCard } from '../../components/MetricCard';
import { Screen } from '../../components/Screen';
import { SectionHeader } from '../../components/SectionHeader';
import { useJournal } from '../../hooks/useJournal';
import { isFutureDate, monthGridDays, todayKey } from '../../utils/dates';
import { RADIUS, SHADOWS } from '../../constants/theme';

export default function MoodCalendar({ navigation }) {
  const { entries, getMoodForDate } = useJournal();
  const { colors } = useTheme();

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
        <Pressable
          onPress={() => setMonth((current) => addMonths(current, -1))}
          style={[styles.arrow, { backgroundColor: colors.white, borderColor: colors.borderLight }]}
        >
          <Ionicons name="chevron-back" size={20} color={colors.journal} />
        </Pressable>
        <Text selectable style={[styles.month, { color: colors.textPrimary }]}>{format(month, 'MMMM yyyy')}</Text>
        <Pressable
          onPress={() => setMonth((current) => addMonths(current, 1))}
          style={[styles.arrow, { backgroundColor: colors.white, borderColor: colors.borderLight }]}
        >
          <Ionicons name="chevron-forward" size={20} color={colors.journal} />
        </Pressable>
      </View>
      <View style={[styles.grid, { backgroundColor: colors.white, borderColor: colors.borderLight }]}>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, index) => (
          <Text key={`${d}-${index}`} style={[styles.weekText, { color: colors.textHint }]}>{d}</Text>
        ))}
        {days.map((day) => {
          const key = format(day, 'yyyy-MM-dd');
          const moodKey = getMoodForDate(key);
          const mood = MOODS.find((item) => item.key === moodKey);
          const isToday = key === todayKey();
          return (
            <View key={key} style={styles.dayCell}>
              <View
                style={[
                  styles.day,
                  isToday ? { borderColor: colors.journal, borderWidth: 1.5 } : null,
                  !isSameMonth(day, month) || isFutureDate(day) ? styles.dim : null,
                ]}
              >
                <Text style={[styles.dayNumber, { color: colors.textSecondary }]}>{format(day, 'd')}</Text>
                <Text style={styles.moodEmoji}>{mood?.emoji || ''}</Text>
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.section}>
        <SectionHeader>Monthly stats</SectionHeader>
        <View style={styles.stats}>
          <MetricCard
            value={stats.common}
            label="Common mood"
            accent={colors.journal}
            icon={<Ionicons name="happy-outline" size={16} color={colors.journal} />}
          />
          <MetricCard
            value={stats.positive}
            label="Happy + excited"
            accent={colors.journal}
            icon={<Ionicons name="sunny-outline" size={16} color={colors.journal} />}
          />
          <MetricCard
            value={stats.heavy}
            label="Sad + stressed"
            accent={colors.journal}
            icon={<Ionicons name="cloud-outline" size={16} color={colors.journal} />}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  monthNav: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  arrow: { alignItems: 'center', borderRadius: RADIUS.pill, borderWidth: 1, height: 38, justifyContent: 'center', width: 38, ...SHADOWS.subtle },
  month: { fontSize: 17, fontWeight: '700' },
  grid: { borderRadius: RADIUS.lg, borderWidth: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 10, rowGap: 8, ...SHADOWS.subtle },
  weekText: { fontSize: 10, textAlign: 'center', width: `${100 / 7}%` },
  dayCell: { alignItems: 'center', width: `${100 / 7}%` },
  day: { alignItems: 'center', borderRadius: 18, height: 44, justifyContent: 'center', width: 40 },
  dim: { opacity: 0.32 },
  dayNumber: { fontSize: 10 },
  moodEmoji: { fontSize: 16 },
  section: { gap: 8 },
  stats: { flexDirection: 'row', gap: 8 },
});
