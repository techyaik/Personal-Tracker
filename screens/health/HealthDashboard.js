import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { AppHeader } from '../../components/AppHeader';
import { EmptyState } from '../../components/EmptyState';
import { ListRow } from '../../components/Rows';
import { MetricCard } from '../../components/MetricCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { SectionHeader } from '../../components/SectionHeader';
import { useHealth } from '../../hooks/useHealth';
import { displayDate, todayKey } from '../../utils/dates';

const formatSteps = (steps) => (steps || steps === 0 ? Number(steps).toLocaleString() : '—');

export default function HealthDashboard({ navigation }) {
  const { logs, loading, getTodayLog } = useHealth();
  const today = getTodayLog();

  return (
    <Screen loading={loading}>
      <AppHeader title="Health" rightIcon="add" accent={COLORS.health} onRight={() => navigation.navigate('HealthLogEntry')} />

      <View style={styles.section}>
        <SectionHeader>Today — {displayDate(todayKey())}</SectionHeader>
        <View style={styles.grid}>
          <MetricCard value={today?.weight ? `${today.weight}` : '—'} label="Weight kg" accent={COLORS.health} />
          <MetricCard value={today?.sleep ? `${today.sleep}` : '—'} label="Sleep hrs" accent={COLORS.health} />
        </View>
        <View style={styles.grid}>
          <MetricCard value={formatSteps(today?.steps)} label="Steps" accent={COLORS.health} />
          <MetricCard value={today?.water ? `${today.water}` : '—'} label="Water glasses" accent={COLORS.health} />
        </View>
      </View>

      <PrimaryButton
        title="+ Log today"
        color={COLORS.health}
        onPress={() => navigation.navigate('HealthLogEntry', { date: todayKey() })}
      />

      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <SectionHeader>Recent</SectionHeader>
          {logs.length ? (
            <Pressable onPress={() => navigation.navigate('HealthHistory')} style={styles.historyButton}>
              <Text style={styles.historyText}>History</Text>
              <Ionicons name="chevron-forward" size={14} color={COLORS.health} />
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
            accent={COLORS.health}
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
  historyText: { color: COLORS.health, fontSize: 12, fontWeight: '600' },
});
