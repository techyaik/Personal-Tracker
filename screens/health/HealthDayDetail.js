import React from 'react';
import { Alert, Dimensions, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { AppHeader } from '../../components/AppHeader';
import { MetricCard } from '../../components/MetricCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { SectionHeader } from '../../components/SectionHeader';
import { useHealth } from '../../hooks/useHealth';
import { displayDate, lastSevenDaysEnding } from '../../utils/dates';

export default function HealthDayDetail({ navigation, route }) {
  const { logs, loading, deleteLog } = useHealth();
  const entry = logs.find((log) => log.id === route.params?.entryId) || route.params?.entry;

  if (!entry) {
    return (
      <Screen loading={loading}>
        <AppHeader title="Detail" onBack={() => navigation.goBack()} />
        <Text style={TYPOGRAPHY.body}>Log not found.</Text>
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
        accent={COLORS.health}
        onRight={() => navigation.navigate('HealthLogEntry', { entryId: entry.id, entry })}
      />
      <View style={styles.grid}>
        <MetricCard value={entry.weight ?? '—'} label="Weight kg" accent={COLORS.health} />
        <MetricCard value={entry.sleep ?? '—'} label="Sleep hrs" accent={COLORS.health} />
      </View>
      <View style={styles.grid}>
        <MetricCard value={entry.steps?.toLocaleString?.() ?? '—'} label="Steps" accent={COLORS.health} />
        <MetricCard value={entry.water ?? '—'} label="Water glasses" accent={COLORS.health} />
      </View>
      <View style={styles.section}>
        <SectionHeader>Weekly weight</SectionHeader>
        <BarChart
          data={{ labels: days.map((day) => displayDate(day, 'd')), datasets: [{ data: weights }] }}
          width={Dimensions.get('window').width - 32}
          height={210}
          fromZero
          showValuesOnTopOfBars
          chartConfig={{
            backgroundGradientFrom: COLORS.white,
            backgroundGradientTo: COLORS.white,
            color: () => COLORS.tealMid,
            labelColor: () => COLORS.textSecondary,
            decimalPlaces: 0,
            propsForBackgroundLines: { stroke: COLORS.borderLight },
          }}
          style={styles.chart}
        />
      </View>
      {entry.notes ? (
        <View style={styles.section}>
          <SectionHeader>Notes</SectionHeader>
          <Text selectable style={styles.notes}>{entry.notes}</Text>
        </View>
      ) : null}
      <PrimaryButton title="Delete log" color={COLORS.danger} onPress={confirmDelete} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', gap: 8 },
  section: { gap: 8 },
  chart: { borderRadius: 8 },
  notes: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    lineHeight: 20,
    padding: 12,
  },
});
