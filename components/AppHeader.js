import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/typography';
import { RADIUS, SHADOWS } from '../constants/theme';

const tintForAccent = (accent) => {
  if (accent === COLORS.habits) return COLORS.accentLight.habits;
  if (accent === COLORS.notes) return COLORS.accentLight.notes;
  if (accent === COLORS.journal) return COLORS.accentLight.journal;
  return COLORS.accentLight.health;
};

export function AppHeader({ title, onBack, rightIcon, onRight, rightText, accent = COLORS.health }) {
  return (
    <View style={styles.header}>
      <View style={[styles.side, !onBack ? styles.noBackSide : null]}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.iconButton} hitSlop={10}>
            <Ionicons name="chevron-back" size={22} color={COLORS.textPrimary} />
          </Pressable>
        ) : null}
      </View>
      <Text selectable style={[TYPOGRAPHY.title, styles.title, !onBack ? styles.leftTitle : null]} numberOfLines={1}>
        {title}
      </Text>
      <View style={[styles.side, styles.right]}>
        {rightIcon ? (
          <Pressable
            onPress={onRight}
            style={[styles.iconButton, SHADOWS.subtle, { backgroundColor: tintForAccent(accent), borderColor: accent }]}
            hitSlop={10}
          >
            <Ionicons name={rightIcon} size={20} color={accent} />
          </Pressable>
        ) : null}
        {rightText ? (
          <Pressable onPress={onRight} hitSlop={10}>
            <Text style={[styles.rightText, { color: accent }]}>{rightText}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', flexDirection: 'row', minHeight: 40 },
  side: { width: 64, flexDirection: 'row' },
  noBackSide: { width: 0 },
  right: { justifyContent: 'flex-end' },
  title: { flex: 1, textAlign: 'center' },
  leftTitle: { textAlign: 'left' },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.pill,
    borderWidth: 1,
  },
  rightText: { fontSize: 14, fontWeight: '600' },
});
