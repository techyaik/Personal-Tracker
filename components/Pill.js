import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { COLORS } from '../constants/colors';

export function Pill({ label, palette, selected, onPress }) {
  const color = palette || COLORS.pillOther;
  const Container = onPress ? Pressable : Pressable;
  return (
    <Container
      onPress={onPress}
      style={[
        styles.pill,
        { backgroundColor: selected ? color.text : color.bg, borderColor: color.text },
      ]}
    >
      <Text style={[styles.text, { color: selected ? COLORS.white : color.text }]} numberOfLines={1}>
        {label}
      </Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    minHeight: 28,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  text: { fontSize: 11, fontWeight: '600' },
});
