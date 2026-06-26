import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addDays, differenceInCalendarDays, format, parseISO } from 'date-fns';
import { useTheme } from '../../theme/ThemeContext';
import { AppHeader } from '../../components/AppHeader';
import { EmptyState } from '../../components/EmptyState';
import { ListRow } from '../../components/Rows';
import { MetricCard } from '../../components/MetricCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { SectionHeader } from '../../components/SectionHeader';
import { useHealth } from '../../hooks/useHealth';
import { displayDate, todayKey } from '../../utils/dates';
import { RADIUS, SHADOWS } from '../../constants/theme';

const formatSteps = (steps) => (steps || steps === 0 ? Number(steps).toLocaleString() : '—');

export default function HealthDashboard({ navigation }) {
  const { logs, loading, getTodayLog } = useHealth();
  const { colors } = useTheme();
  const today = getTodayLog();

  // Menstrual cycle calculation
  const { cycleStatusText, cycleSubText } = React.useMemo(() => {
    const periodLogs = logs.filter((log) => log.period === true);
    if (periodLogs.length === 0) {
      return {
        cycleStatusText: 'No cycle data logged',
        cycleSubText: "Tap '+ Log today' and check 'Period started' to begin tracking.",
      };
    }

    const sorted = [...periodLogs].sort((a, b) => b.date.localeCompare(a.date));
    const lastPeriod = sorted[0];
    
    try {
      const parsedLast = parseISO(lastPeriod.date);
      const nextPeriod = addDays(parsedLast, 28);
      const diff = differenceInCalendarDays(nextPeriod, parseISO(todayKey()));
      const lastDiff = differenceInCalendarDays(parseISO(todayKey()), parsedLast);

      let status = '';
      if (diff === 0) {
        status = 'Period starts today';
      } else if (diff < 0) {
        status = `Next cycle overdue by ${Math.abs(diff)} day${Math.abs(diff) > 1 ? 's' : ''}`;
      } else {
        status = `Next cycle expected in ${diff} day${diff > 1 ? 's' : ''}`;
      }

      const formattedLast = format(parsedLast, 'MMM d, yyyy');
      const sub = `Last period started on ${formattedLast} (${lastDiff} day${lastDiff !== 1 ? 's' : ''} ago)`;

      return {
        cycleStatusText: status,
        cycleSubText: sub,
      };
    } catch (e) {
      console.log('Error calculating cycle data:', e);
      return {
        cycleStatusText: 'Invalid log date structure',
        cycleSubText: 'Check your logged health dates.',
      };
    }
  }, [logs]);

  return (
    <Screen loading={loading}>
      <AppHeader title="Health" />

      <View style={styles.section}>
        <SectionHeader>Today — {displayDate(todayKey())}</SectionHeader>
        <View style={styles.grid}>
          <MetricCard
            value={today?.weight ? `${today.weight}` : '—'}
            label="Weight kg"
            accent={colors.health}
            icon={<Ionicons name="scale-outline" size={16} color={colors.health} />}
          />
          <MetricCard
            value={today?.sleep ? `${today.sleep}` : '—'}
            label="Sleep hrs"
            accent={colors.health}
            icon={<Ionicons name="bed-outline" size={16} color={colors.health} />}
          />
        </View>
        <View style={styles.grid}>
          <MetricCard
            value={formatSteps(today?.steps)}
            label="Steps"
            accent={colors.health}
            icon={<Ionicons name="walk-outline" size={16} color={colors.health} />}
          />
          <MetricCard
            value={today?.water ? `${today.water}` : '—'}
            label="Water glasses"
            accent={colors.health}
            icon={<Ionicons name="water-outline" size={16} color={colors.health} />}
          />
        </View>
      </View>

      <PrimaryButton
        title="+ Log today"
        color={colors.health}
        onPress={() => navigation.navigate('HealthLogEntry', { date: todayKey() })}
      />

      <View style={styles.section}>
        <SectionHeader>Cycle Tracker</SectionHeader>
        <View style={[styles.cycleCard, { backgroundColor: colors.white, borderColor: colors.borderLight }]}>
          <View style={styles.cycleHeader}>
            <View style={[styles.cycleIconWrap, { backgroundColor: colors.accentLight.health }]}>
              <Ionicons name="water" size={20} color={colors.health} />
            </View>
            <View style={styles.cycleInfo}>
              <Text style={[styles.cycleTitle, { color: colors.textPrimary }]}>{cycleStatusText}</Text>
              <Text style={[styles.cycleSub, { color: colors.textSecondary }]}>{cycleSubText}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <SectionHeader>Recent</SectionHeader>
          {logs.length ? (
            <Pressable onPress={() => navigation.navigate('HealthHistory')} style={styles.historyButton}>
              <Text style={[styles.historyText, { color: colors.health }]}>History</Text>
              <Ionicons name="chevron-forward" size={14} color={colors.health} />
            </Pressable>
          ) : null}
        </View>
        {logs.length ? (
          logs.slice(0, 10).map((log) => (
            <ListRow
              key={log.id}
              title={displayDate(log.date)}
              subtitle={`${log.weight || '—'} kg · ${log.sleep || '—'} hrs · ${formatSteps(log.steps)} steps`}
              onPress={() => navigation.navigate('HealthDayDetail', { entryId: log.id })}
            />
          ))
        ) : (
          <EmptyState
            icon="heart-outline"
            message="No logs yet. Start tracking today."
            actionLabel="+ Log today"
            action={() => navigation.navigate('HealthLogEntry', { date: todayKey() })}
            accent={colors.health}
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { gap: 8 },
  grid: { flexDirection: 'row', gap: 8 },
  sectionTitleRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  historyButton: { alignItems: 'center', flexDirection: 'row', gap: 2 },
  historyText: { fontSize: 12, fontWeight: '600' },
  cycleCard: {
    padding: 16,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    ...SHADOWS.subtle,
  },
  cycleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cycleIconWrap: {
    alignItems: 'center',
    borderRadius: RADIUS.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  cycleInfo: {
    flex: 1,
    gap: 2,
  },
  cycleTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  cycleSub: {
    fontSize: 12,
  },
});
