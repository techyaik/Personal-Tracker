import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View, Platform } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { CATEGORIES, GOALS } from '../../constants/categories';
import { AppHeader } from '../../components/AppHeader';
import { InputField } from '../../components/InputField';
import { Pill } from '../../components/Pill';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { SectionHeader } from '../../components/SectionHeader';
import { useHabits } from '../../hooks/useHabits';
import { RADIUS, SHADOWS } from '../../constants/theme';
import { showToast } from '../../utils/feedback';

export default function AddHabit({ navigation }) {
  const { habits, addHabit } = useHabits();
  const { colors, triggerDataRefresh } = useTheme();
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState('health');
  const [reminderTime, setReminderTime] = useState('');
  const [goal, setGoal] = useState('daily');

  const save = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Give this habit a name before saving.');
      return;
    }
    const trimmedTime = reminderTime.trim();
    if (trimmedTime) {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(trimmedTime)) {
        Alert.alert('Invalid time format', 'Please enter reminder time in HH:MM format (24-hour, e.g. 07:30 or 18:45).');
        return;
      }
    }

    try {
      const isDuplicate = habits.some((h) => h.name.toLowerCase() === name.trim().toLowerCase());
      if (isDuplicate) {
        if (Platform.OS === 'web') {
          alert('A habit with this name already exists.');
        } else {
          Alert.alert('Duplicate habit', 'A habit with this name already exists.');
        }
        return;
      }

      await addHabit({
        id: Date.now().toString(),
        name: name.trim(),
        category,
        reminderTime: trimmedTime || null,
        goal,
        createdAt: new Date().toISOString(),
      });

      triggerDataRefresh();
      showToast('Habit added successfully ✓');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to add habit:', error);
      if (Platform.OS === 'web') {
        alert('Failed to save habit: ' + error.message);
      } else {
        Alert.alert('Error', 'Failed to save habit: ' + error.message);
      }
    }
  };

  return (
    <Screen>
      <AppHeader title="Add habit" onBack={() => navigation.goBack()} />
      <View style={styles.form}>
        <InputField value={name} onChangeText={setName} placeholder="Habit name" />
        <SectionHeader>Category</SectionHeader>
        <View style={styles.wrap}>
          {CATEGORIES.map((item) => (
            <Pill
              key={item.key}
              label={item.label}
              palette={item.color}
              selected={category === item.key}
              onPress={() => setCategory(item.key)}
            />
          ))}
        </View>
        <InputField value={reminderTime} onChangeText={setReminderTime} placeholder="Reminder time, e.g. 07:00" />
        <SectionHeader>Goal</SectionHeader>
        <View style={[styles.segment, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
          {GOALS.map((item) => {
            const active = goal === item;
            return (
              <Text
                key={item}
                onPress={() => setGoal(item)}
                style={[
                  styles.segmentText,
                  { color: colors.textSecondary },
                  active && {
                    backgroundColor: colors.white,
                    borderRadius: RADIUS.sm,
                    color: colors.habits,
                    ...SHADOWS.subtle,
                  },
                ]}
              >
                {item}
              </Text>
            );
          })}
        </View>
      </View>
      <PrimaryButton title="Add habit" color={colors.habits} onPress={save} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { gap: 10 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  segment: { borderRadius: RADIUS.md, borderWidth: 1, flexDirection: 'row', padding: 4 },
  segmentText: { flex: 1, fontSize: 12, fontWeight: '600', padding: 10, textAlign: 'center', textTransform: 'capitalize' },
});
