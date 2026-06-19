import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { COLORS } from '../constants/colors';
import { RADIUS } from '../constants/theme';

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
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    minHeight: 26,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  text: { fontSize: 11, fontWeight: '700' },
});
