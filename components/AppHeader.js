import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/typography';

export function AppHeader({ title, onBack, rightIcon, onRight, rightText, accent = COLORS.health }) {
  return (
    <View style={styles.header}>
      <View style={styles.side}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.iconButton} hitSlop={10}>
            <Ionicons name="chevron-back" size={22} color={COLORS.textPrimary} />
          </Pressable>
        ) : null}
      </View>
      <Text selectable style={[TYPOGRAPHY.title, styles.title]} numberOfLines={1}>
        {title}
      </Text>
      <View style={[styles.side, styles.right]}>
        {rightIcon ? (
          <Pressable onPress={onRight} style={[styles.iconButton, { backgroundColor: accent }]} hitSlop={10}>
            <Ionicons name={rightIcon} size={20} color={COLORS.white} />
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
  right: { justifyContent: 'flex-end' },
  title: { flex: 1, textAlign: 'center' },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  rightText: { fontSize: 14, fontWeight: '600' },
});
