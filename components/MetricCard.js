import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/typography';

export function MetricCard({ value, label, accent }) {
  return (
    <View style={[styles.card, accent ? { borderTopColor: accent } : null]}>
      <Text selectable style={TYPOGRAPHY.metricValue} numberOfLines={1}>
        {value ?? '—'}
      </Text>
      <Text selectable style={TYPOGRAPHY.metricLabel} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 74,
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 8,
    borderTopWidth: 3,
    borderWidth: 1,
    gap: 4,
    justifyContent: 'center',
    padding: 12,
  },
});
