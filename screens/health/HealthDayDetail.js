import React from 'react';
import { Alert, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { AppHeader } from '../../components/AppHeader';
import { MetricCard } from '../../components/MetricCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { SectionHeader } from '../../components/SectionHeader';
import { useHealth } from '../../hooks/useHealth';
import { displayDate, lastSevenDaysEnding } from '../../utils/dates';
import { RADIUS, SHADOWS } from '../../constants/theme';

export default function HealthDayDetail({ navigation, route }) {
  const { logs, loading, deleteLog } = useHealth();
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  
  const entry = logs.find((log) => log.id === route.params?.entryId) || route.params?.entry;

  if (!entry) {
    return (
      <Screen loading={loading}>
        <AppHeader title="Detail" onBack={() => navigation.goBack()} />
        <Text style={{ color: colors.textPrimary, padding: 16 }}>Log not found.</Text>
      </Screen>
    );
  }

  const days = lastSevenDaysEnding(entry.date);
  const weights = days.map((day) => logs.find((log) => log.date === day)?.weight || 0);

  const confirmDelete = () =>
    Alert.alert('Delete log?', 'This health log will be removed permanently.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await deleteLog(entry.id);
        navigation.navigate('HealthDashboard');
      } },
    ]);

  return (
    <Screen loading={loading}>
      <AppHeader
        title={`${displayDate(entry.date, 'MMM d')} detail`}
        onBack={() => navigation.goBack()}
        rightIcon="pencil"
        accent={colors.health}
        onRight={() => navigation.navigate('HealthLogEntry', { entryId: entry.id, entry })}
      />
      <View style={styles.grid}>
        <MetricCard
          value={entry.weight ?? '—'}
          label="Weight kg"
          accent={colors.health}
          icon={<Ionicons name="scale-outline" size={16} color={colors.health} />}
        />
        <MetricCard
          value={entry.sleep ?? '—'}
          label="Sleep hrs"
          accent={colors.health}
          icon={<Ionicons name="bed-outline" size={16} color={colors.health} />}
        />
      </View>
      <View style={styles.grid}>
        <MetricCard
          value={entry.steps?.toLocaleString?.() ?? '—'}
          label="Steps"
          accent={colors.health}
          icon={<Ionicons name="walk-outline" size={16} color={colors.health} />}
        />
        <MetricCard
          value={entry.water ?? '—'}
          label="Water glasses"
          accent={colors.health}
          icon={<Ionicons name="water-outline" size={16} color={colors.health} />}
        />
      </View>
      <View style={styles.section}>
        <SectionHeader>Weekly weight</SectionHeader>
        <BarChart
          data={{ labels: days.map((day) => displayDate(day, 'd')), datasets: [{ data: weights }] }}
          width={Math.min(width - 36, 520)}
          height={210}
          fromZero
          showValuesOnTopOfBars
          chartConfig={{
            backgroundGradientFrom: colors.white,
            backgroundGradientTo: colors.white,
            color: () => colors.tealMid,
            labelColor: () => colors.textSecondary,
            decimalPlaces: 0,
            propsForBackgroundLines: { stroke: colors.borderLight },
          }}
          style={[styles.chart, { backgroundColor: colors.white }]}
        />
      </View>
      {entry.notes ? (
        <View style={styles.section}>
          <SectionHeader>Notes</SectionHeader>
          <Text selectable style={[styles.notes, { backgroundColor: colors.white, borderColor: colors.borderLight, color: colors.textPrimary }]}>
            {entry.notes}
          </Text>
        </View>
      ) : null}
      <PrimaryButton title="Delete log" color={colors.danger} onPress={confirmDelete} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', gap: 8 },
  section: { gap: 8 },
  chart: { borderRadius: RADIUS.lg, ...SHADOWS.subtle },
  notes: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    fontSize: 14,
    lineHeight: 20,
    padding: 14,
    ...SHADOWS.subtle,
  },
});
