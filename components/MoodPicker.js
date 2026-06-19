import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';
import { MOODS } from '../constants/categories';
import { RADIUS, SHADOWS } from '../constants/theme';

export function MoodPicker({ value, onChange }) {
  return (
    <View style={styles.wrap}>
      {MOODS.map((mood) => {
        const selected = value === mood.key;
        return (
          <Pressable
            key={mood.key}
            onPress={() => onChange(mood.key)}
            style={[
              styles.circle,
              selected ? [SHADOWS.subtle, { borderColor: mood.color, backgroundColor: COLORS.white }] : null,
            ]}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: 10 },
  circle: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.pill,
    borderWidth: 1.5,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  emoji: { fontSize: 23 },
});
