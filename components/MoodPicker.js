import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';
import { MOODS } from '../constants/categories';

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
              selected ? { borderColor: mood.color, backgroundColor: COLORS.surface } : null,
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
    borderColor: COLORS.border,
    borderRadius: 24,
    borderWidth: 1.5,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  emoji: { fontSize: 23 },
});
