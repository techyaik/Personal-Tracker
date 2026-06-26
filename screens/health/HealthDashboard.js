import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  addDays,
  differenceInCalendarDays,
  isWithinInterval,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
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
const percent = (value, goal) => {
  const parsedValue = Number(value) || 0;
  const parsedGoal = Number(goal) || 0;
  if (!parsedGoal) return 0;
  return Math.min(100, Math.round((parsedValue / parsedGoal) * 100));
};
const average = (items, key) => {
  const values = items.map((item) => Number(item[key])).filter((value) => !Number.isNaN(value) && value > 0);
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

function BentoCard({ children, style }) {
  const { colors } = useTheme();
  return <View style={[styles.bentoCard, { backgroundColor: colors.white, borderColor: colors.borderLight }, style]}>{children}</View>;
}

function ProgressLine({ label, value, detail, color }) {
  const { colors } = useTheme();
  return (
    <View style={styles.progressLine}>
      <View style={styles.progressTop}>
        <Text style={[styles.progressLabel, { color: colors.textPrimary }]}>{label}</Text>
        <Text style={[styles.progressDetail, { color: colors.textSecondary }]}>{detail}</Text>
      </View>
      <View style={[styles.progressTrack, { backgroundColor: colors.surfaceTint }]}>
        <View style={[styles.progressFill, { width: `${value}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

function MiniBars({ logs, field, goal }) {
  const { colors } = useTheme();
  const recent = [...logs].slice(0, 7).reverse();
  const data = recent.length ? recent : Array.from({ length: 7 }, (_, index) => ({ id: String(index), [field]: 0 }));
  return (
    <View style={styles.miniBars}>
      {data.map((item, index) => {
        const height = Math.max(8, Math.min(46, percent(item[field], goal || Math.max(...data.map((d) => Number(d[field]) || 0), 1)) * 0.46));
        return <View key={item.id || index} style={[styles.miniBar, { height, backgroundColor: index === data.length - 1 ? colors.health : colors.accentLight.health }]} />;
      })}
    </View>
  );
}

const getCycleInfo = (logs) => {
  const cycleLog =
    logs.find((log) => log.cycleEnabled && log.lastPeriodStart) ||
    logs.find((log) => log.period && (log.lastPeriodStart || log.date));

  if (!cycleLog) {
    return {
      title: 'Cycle reminders off',
      detail: 'Add your last period date to enable private local reminders.',
      nextDate: null,
      reminder: '',
    };
  }

  const lastStart = cycleLog.lastPeriodStart || cycleLog.date;
  try {
    const last = parseISO(lastStart);
    const cycleLength = Number(cycleLog.cycleLength) || 28;
    const duration = Number(cycleLog.periodDuration) || 5;
    const reminderDays = Number(cycleLog.periodReminderDays) || 0;
    const next = addDays(last, cycleLength);
    const daysUntil = differenceInCalendarDays(next, parseISO(todayKey()));
    const reminderDate = addDays(next, -reminderDays);

    return {
      title: daysUntil < 0 ? `Expected ${Math.abs(daysUntil)} day${Math.abs(daysUntil) === 1 ? '' : 's'} ago` : `Expected in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`,
      detail: `Last start ${displayDate(lastStart, 'MMM d')} · ${cycleLength}-day cycle · ${duration}-day period`,
      nextDate: displayDate(next, 'MMM d'),
      reminder: reminderDays ? `Reminder from ${displayDate(reminderDate, 'MMM d')}` : 'Reminder on expected date',
      flow: cycleLog.flowIntensity,
      symptoms: cycleLog.cycleSymptoms || [],
    };
  } catch (e) {
    return {
      title: 'Cycle date needs review',
      detail: 'Open the latest health log and check the saved date.',
      nextDate: null,
      reminder: '',
    };
  }
};

export default function HealthDashboard({ navigation }) {
  const { logs, loading, getTodayLog } = useHealth();
  const { colors } = useTheme();
  const today = getTodayLog();

  const summary = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const monthStart = startOfMonth(now);
    const weekLogs = logs.filter((log) => {
      try {
        return isWithinInterval(parseISO(log.date), { start: weekStart, end: now });
      } catch (e) {
        return false;
      }
    });
    const monthLogs = logs.filter((log) => {
      try {
        return isWithinInterval(parseISO(log.date), { start: monthStart, end: now });
      } catch (e) {
        return false;
      }
    });
    return {
      weekLogs,
      monthLogs,
      avgWeight: average(weekLogs, 'weight'),
      avgSleep: average(weekLogs, 'sleep'),
      avgWater: average(weekLogs, 'water'),
      cycle: getCycleInfo(logs),
    };
  }, [logs]);

  const goals = {
    water: today?.waterGoal || 8,
    steps: today?.stepGoal || 10000,
    sleep: today?.sleepGoal || 8,
  };

  return (
    <Screen loading={loading}>
      <AppHeader title="Health" />

      <View style={styles.heroRow}>
        <View style={styles.heroCopy}>
          <Text style={[styles.kicker, { color: colors.textSecondary }]}>Today - {displayDate(todayKey(), 'MMM d')}</Text>
          <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>Daily health overview</Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate('HealthLogEntry', { date: todayKey() })}
          style={[styles.iconButton, { backgroundColor: colors.accentLight.health }]}
        >
          <Ionicons name="add" size={22} color={colors.health} />
        </Pressable>
      </View>

      <View style={styles.metricGrid}>
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
      <View style={styles.metricGrid}>
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

      <PrimaryButton
        title="+ Log today"
        color={colors.health}
        onPress={() => navigation.navigate('HealthLogEntry', { date: todayKey() })}
      />

      <View style={styles.bentoGrid}>
        <BentoCard style={styles.wideCard}>
          <View style={styles.cardHeader}>
            <View>
              <SectionHeader>Health goals</SectionHeader>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Today progress</Text>
            </View>
            <Ionicons name="flag-outline" size={20} color={colors.health} />
          </View>
          <ProgressLine label="Water" value={percent(today?.water, goals.water)} detail={`${today?.water || 0}/${goals.water} glasses`} color={colors.health} />
          <ProgressLine label="Steps" value={percent(today?.steps, goals.steps)} detail={`${formatSteps(today?.steps)}/${Number(goals.steps).toLocaleString()}`} color={colors.tealMid} />
          <ProgressLine label="Sleep" value={percent(today?.sleep, goals.sleep)} detail={`${today?.sleep || 0}/${goals.sleep} hrs`} color={colors.habits} />
        </BentoCard>

        <BentoCard>
          <SectionHeader>Mood</SectionHeader>
          <Text style={[styles.largeValue, { color: colors.textPrimary }]}>{today?.mood || '—'}</Text>
          <Text style={[styles.meta, { color: colors.textSecondary }]}>Energy: {today?.energy || 'Not logged'}</Text>
        </BentoCard>

        <BentoCard>
          <SectionHeader>Symptoms</SectionHeader>
          <Text style={[styles.largeValue, { color: colors.textPrimary }]}>{today?.symptoms?.length || 0}</Text>
          <Text style={[styles.meta, { color: colors.textSecondary }]} numberOfLines={2}>
            {today?.symptoms?.length ? today.symptoms.join(', ') : 'No symptoms logged'}
          </Text>
        </BentoCard>

        <BentoCard style={styles.wideCard}>
          <View style={styles.cardHeader}>
            <View>
              <SectionHeader>Weekly summary</SectionHeader>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{summary.weekLogs.length} logs this week</Text>
            </View>
            <MiniBars logs={logs} field="steps" goal={goals.steps} />
          </View>
          <View style={styles.statRow}>
            <Text style={[styles.statText, { color: colors.textSecondary }]}>Avg weight <Text style={{ color: colors.textPrimary }}>{summary.avgWeight ? `${summary.avgWeight.toFixed(1)} kg` : '—'}</Text></Text>
            <Text style={[styles.statText, { color: colors.textSecondary }]}>Avg sleep <Text style={{ color: colors.textPrimary }}>{summary.avgSleep ? `${summary.avgSleep.toFixed(1)} hrs` : '—'}</Text></Text>
            <Text style={[styles.statText, { color: colors.textSecondary }]}>Month logs <Text style={{ color: colors.textPrimary }}>{summary.monthLogs.length}</Text></Text>
          </View>
        </BentoCard>

        <BentoCard style={styles.wideCard}>
          <View style={styles.cardHeader}>
            <View style={styles.flexOne}>
              <SectionHeader>Cycle reminder</SectionHeader>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{summary.cycle.title}</Text>
              <Text style={[styles.meta, { color: colors.textSecondary }]}>{summary.cycle.detail}</Text>
            </View>
            <View style={[styles.dateBubble, { backgroundColor: colors.accentLight.health }]}>
              <Text style={[styles.dateBubbleText, { color: colors.health }]}>{summary.cycle.nextDate || 'Off'}</Text>
            </View>
          </View>
          {summary.cycle.reminder ? <Text style={[styles.meta, { color: colors.textSecondary }]}>{summary.cycle.reminder}</Text> : null}
        </BentoCard>

        <BentoCard style={styles.wideCard}>
          <SectionHeader>Medication</SectionHeader>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]} numberOfLines={2}>
            {today?.medication || 'No medication or supplement reminder logged today'}
          </Text>
        </BentoCard>
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
              subtitle={`${log.weight || '—'} kg · ${log.sleep || '—'} hrs · ${formatSteps(log.steps)} steps${log.mood ? ` · ${log.mood}` : ''}`}
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
  heroRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  heroCopy: { flex: 1, gap: 3 },
  kicker: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
  heroTitle: { fontSize: 22, fontWeight: '800' },
  iconButton: { alignItems: 'center', borderRadius: RADIUS.pill, height: 42, justifyContent: 'center', width: 42 },
  metricGrid: { flexDirection: 'row', gap: 8 },
  bentoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  bentoCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    flexBasis: '48%',
    flexGrow: 1,
    gap: 10,
    minHeight: 118,
    padding: 14,
    ...SHADOWS.subtle,
  },
  wideCard: { flexBasis: '100%' },
  cardHeader: { alignItems: 'flex-start', flexDirection: 'row', gap: 12, justifyContent: 'space-between' },
  cardTitle: { fontSize: 15, fontWeight: '800', lineHeight: 20 },
  largeValue: { fontSize: 24, fontWeight: '900' },
  meta: { fontSize: 12, lineHeight: 17 },
  progressLine: { gap: 6 },
  progressTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  progressLabel: { fontSize: 13, fontWeight: '700' },
  progressDetail: { fontSize: 12 },
  progressTrack: { borderRadius: RADIUS.pill, height: 8, overflow: 'hidden' },
  progressFill: { borderRadius: RADIUS.pill, height: 8 },
  miniBars: { alignItems: 'flex-end', flexDirection: 'row', gap: 4, height: 48 },
  miniBar: { borderRadius: 6, width: 10 },
  statRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statText: { fontSize: 12, fontWeight: '600' },
  dateBubble: { alignItems: 'center', borderRadius: RADIUS.md, justifyContent: 'center', minHeight: 46, minWidth: 64, padding: 8 },
  dateBubbleText: { fontSize: 13, fontWeight: '900' },
  flexOne: { flex: 1 },
  section: { gap: 8 },
  sectionTitleRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  historyButton: { alignItems: 'center', flexDirection: 'row', gap: 2 },
  historyText: { fontSize: 12, fontWeight: '600' },
});
