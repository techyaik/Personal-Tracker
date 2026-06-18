import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

export function FAB({ onPress, color = COLORS.health, icon = 'add' }) {
  return (
    <Pressable onPress={onPress} style={[styles.fab, { backgroundColor: color }]} hitSlop={10}>
      <Ionicons name={icon} size={22} color={COLORS.white} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 18 },
});
