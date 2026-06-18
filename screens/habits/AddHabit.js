import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { CATEGORIES, GOALS } from '../../constants/categories';
import { AppHeader } from '../../components/AppHeader';
import { InputField } from '../../components/InputField';
import { Pill } from '../../components/Pill';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { SectionHeader } from '../../components/SectionHeader';
import { useHabits } from '../../hooks/useHabits';

export default function AddHabit({ navigation }) {
  const { addHabit } = useHabits();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('health');
  const [reminderTime, setReminderTime] = useState('');
  const [goal, setGoal] = useState('daily');

  const save = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Give this habit a name before saving.');
      return;
    }
    await addHabit({
      id: Date.now().toString(),
      name: name.trim(),
      category,
      reminderTime: reminderTime.trim() || null,
      goal,
      createdAt: new Date().toISOString(),
    });
    navigation.goBack();
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
        <View style={styles.segment}>
          {GOALS.map((item) => (
            <Text
              key={item}
              onPress={() => setGoal(item)}
              style={[styles.segmentText, goal === item ? styles.segmentSelected : null]}
            >
              {item}
            </Text>
          ))}
        </View>
      </View>
      <PrimaryButton title="Add habit" color={COLORS.habits} onPress={save} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { gap: 10 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  segment: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 4,
  },
  segmentText: {
    color: COLORS.textSecondary,
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    padding: 10,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  segmentSelected: { backgroundColor: COLORS.white, borderRadius: 8, color: COLORS.habits },
});
