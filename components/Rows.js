import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { TYPOGRAPHY } from '../constants/typography';
import { RADIUS, SHADOWS } from '../constants/theme';
import { Pill } from './Pill';

export function ListRow({ title, subtitle, right, onPress, onLongPress }) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        styles.row,
        { backgroundColor: colors.white, borderColor: colors.borderLight }
      ]}
    >
      <View style={styles.rowText}>
        <Text selectable style={[styles.rowTitle, { color: colors.textPrimary }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text selectable style={[TYPOGRAPHY.meta, { color: colors.textSecondary }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right || <Ionicons name="chevron-forward" size={18} color={colors.textHint} />}
    </Pressable>
  );
}

export function HabitRow({ habit, done, streak, category, onToggle, onPress, onLongPress }) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        styles.row,
        { backgroundColor: colors.white, borderColor: colors.borderLight }
      ]}
    >
      <Pressable
        onPress={onToggle}
        style={[
          styles.check,
          { borderColor: colors.habits },
          done ? { backgroundColor: colors.habits, borderColor: colors.habits } : null
        ]}
      >
        {done ? <Ionicons name="checkmark" size={17} color={colors.white} /> : null}
      </Pressable>
      <View style={styles.rowText}>
        <Text selectable style={[styles.rowTitle, { color: colors.textPrimary }]} numberOfLines={1}>
          {habit.name}
        </Text>
        <Pill label={category.label} palette={category.color} />
      </View>
      <Text style={[TYPOGRAPHY.meta, { color: colors.textSecondary }]}>🔥 {streak}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 56,
    padding: 12,
    ...SHADOWS.subtle,
  },
  rowText: { flex: 1, gap: 5 },
  rowTitle: { fontSize: 14, fontWeight: '600' },
  check: {
    alignItems: 'center',
    borderRadius: 13,
    borderWidth: 1.5,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
});
