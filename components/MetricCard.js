import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/typography';
import { RADIUS, SHADOWS } from '../constants/theme';

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
    backgroundColor: COLORS.surfaceElevated,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    gap: 4,
    justifyContent: 'center',
    padding: 12,
    ...SHADOWS.subtle,
  },
});
