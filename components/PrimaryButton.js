import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { GRADIENTS, RADIUS, SHADOWS } from '../constants/theme';

const gradientForColor = (color) => {
  if (color === COLORS.habits) return GRADIENTS.habits;
  if (color === COLORS.notes) return GRADIENTS.notes;
  if (color === COLORS.journal) return GRADIENTS.journal;
  if (color === COLORS.danger) return ['#D95D35', COLORS.danger];
  return GRADIENTS.health;
};

export function PrimaryButton({ title, onPress, color = COLORS.health, disabled = false, icon }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { opacity: pressed ? 0.88 : 1, transform: [{ scale: pressed ? 0.99 : 1 }] },
        disabled ? styles.disabled : SHADOWS.subtle,
      ]}
    >
      <LinearGradient
        colors={disabled ? [COLORS.textHint, COLORS.textHint] : gradientForColor(color)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {icon}
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: RADIUS.md,
    minHeight: 50,
  },
  gradient: {
    alignItems: 'center',
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 50,
    paddingHorizontal: 14,
  },
  disabled: { opacity: 0.7 },
  text: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
});
