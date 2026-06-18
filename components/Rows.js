import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/typography';
import { Pill } from './Pill';

export function ListRow({ title, subtitle, right, onPress, onLongPress }) {
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} style={styles.row}>
      <View style={styles.rowText}>
        <Text selectable style={styles.rowTitle} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text selectable style={TYPOGRAPHY.meta} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right || <Ionicons name="chevron-forward" size={18} color={COLORS.textHint} />}
    </Pressable>
  );
}

export function HabitRow({ habit, done, streak, category, onToggle, onPress, onLongPress }) {
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} style={styles.row}>
      <Pressable
        onPress={onToggle}
        style={[styles.check, done ? { backgroundColor: COLORS.tealDark, borderColor: COLORS.tealDark } : null]}
      >
        {done ? <Ionicons name="checkmark" size={17} color={COLORS.white} /> : null}
      </Pressable>
      <View style={styles.rowText}>
        <Text selectable style={styles.rowTitle} numberOfLines={1}>
          {habit.name}
        </Text>
        <Pill label={category.label} palette={category.color} />
      </View>
      <Text style={TYPOGRAPHY.meta}>🔥 {streak}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 64,
    padding: 12,
  },
  rowText: { flex: 1, gap: 5 },
  rowTitle: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '600' },
  check: {
    alignItems: 'center',
    borderColor: COLORS.tealDark,
    borderRadius: 13,
    borderWidth: 1.5,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
});
