import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';
import { RADIUS, SHADOWS } from '../constants/theme';

export function MetricCard({ value, label, accent, icon, style }) {
  let bgTint = COLORS.white;
  let borderCol = COLORS.borderLight;
  
  if (accent === COLORS.health) {
    bgTint = COLORS.accentLight.health;
  } else if (accent === COLORS.habits) {
    bgTint = COLORS.accentLight.habits;
  } else if (accent === COLORS.notes) {
    bgTint = COLORS.accentLight.notes;
  } else if (accent === COLORS.journal) {
    bgTint = COLORS.accentLight.journal;
  }

  return (
    <View style={[styles.card, { backgroundColor: bgTint, borderColor: borderCol }, style]}>
      <View style={styles.header}>
        <Text selectable style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        {icon}
      </View>
      <Text selectable style={[styles.value, accent ? { color: accent } : null]} numberOfLines={1}>
        {value ?? '—'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 82,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: 'space-between',
    ...SHADOWS.subtle,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
});
