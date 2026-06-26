import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { isAfter, parseISO, subMonths, subWeeks } from 'date-fns';
import { useTheme } from '../../theme/ThemeContext';
import { AppHeader } from '../../components/AppHeader';
import { EmptyState } from '../../components/EmptyState';
import { ListRow } from '../../components/Rows';
import { Pill } from '../../components/Pill';
import { Screen } from '../../components/Screen';
import { useHealth } from '../../hooks/useHealth';
import { displayDate } from '../../utils/dates';

const formatSteps = (steps) => (steps || steps === 0 ? Number(steps).toLocaleString() : '—');
const historySummary = (log) => {
  const parts = [`${log.weight || '—'} kg`, `${log.sleep || '—'} hrs`, `${formatSteps(log.steps)} steps`];
  if (log.mood) parts.push(log.mood);
  if (log.symptoms?.length) parts.push(`${log.symptoms.length} symptom${log.symptoms.length === 1 ? '' : 's'}`);
  if (log.period) parts.push('Period');
  return parts.join(' · ');
};

export default function HealthHistory({ navigation }) {
  const { logs, loading } = useHealth();
  const { colors } = useTheme();
  
  const [filter, setFilter] = useState('All');
  
  const filtered = useMemo(() => {
    const now = new Date();
    if (filter === 'Week') return logs.filter((log) => isAfter(parseISO(log.date), subWeeks(now, 1)));
    if (filter === 'Month') return logs.filter((log) => isAfter(parseISO(log.date), subMonths(now, 1)));
    return logs;
  }, [logs, filter]);

  return (
    <Screen loading={loading}>
      <AppHeader title="History" onBack={() => navigation.goBack()} />
      <View style={styles.filters}>
        {['Week', 'Month', 'All'].map((item) => (
          <Pill key={item} label={item} selected={filter === item} onPress={() => setFilter(item)} palette={colors.pillLearning} />
        ))}
      </View>
      {filtered.length ? (
        filtered.map((log) => (
          <ListRow
            key={log.id}
            title={displayDate(log.date)}
            subtitle={historySummary(log)}
            onPress={() => navigation.navigate('HealthDayDetail', { entryId: log.id })}
          />
        ))
      ) : (
        <EmptyState icon="calendar-outline" message="No health logs in this range." />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', gap: 8 },
});
