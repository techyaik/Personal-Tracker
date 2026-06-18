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

export default function HabitEdit({ navigation, route }) {
  const { habits, updateHabit, deleteHabit } = useHabits();
  const habit = habits.find((item) => item.id === route.params?.habit?.id) || route.params?.habit;
  const [name, setName] = useState(habit?.name || '');
  const [category, setCategory] = useState(habit?.category || 'health');
  const [reminderTime, setReminderTime] = useState(habit?.reminderTime || '');
  const [goal, setGoal] = useState(habit?.goal || 'daily');

  const save = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Give this habit a name before saving.');
      return;
    }
    await updateHabit(habit.id, { name: name.trim(), category, reminderTime: reminderTime.trim() || null, goal });
    navigation.navigate('HabitsToday');
  };

  const confirmDelete = () =>
    Alert.alert('Delete habit?', 'This removes the habit and all completion history.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await deleteHabit(habit.id);
        navigation.navigate('HabitsToday');
      } },
    ]);

  if (!habit) return null;

  return (
    <Screen>
      <AppHeader title="Edit habit" onBack={() => navigation.goBack()} />
      <View style={styles.form}>
        <InputField value={name} onChangeText={setName} placeholder="Habit name" />
        <SectionHeader>Category</SectionHeader>
        <View style={styles.wrap}>
          {CATEGORIES.map((item) => (
            <Pill key={item.key} label={item.label} palette={item.color} selected={category === item.key} onPress={() => setCategory(item.key)} />
          ))}
        </View>
        <InputField value={reminderTime} onChangeText={setReminderTime} placeholder="Reminder time, e.g. 07:00" />
        <SectionHeader>Goal</SectionHeader>
        <View style={styles.segment}>
          {GOALS.map((item) => (
            <Text key={item} onPress={() => setGoal(item)} style={[styles.segmentText, goal === item ? styles.segmentSelected : null]}>
              {item}
            </Text>
          ))}
        </View>
      </View>
      <PrimaryButton title="Save changes" color={COLORS.habits} onPress={save} />
      <PrimaryButton title="Delete habit" color={COLORS.danger} onPress={confirmDelete} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { gap: 10 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  segment: { backgroundColor: COLORS.surface, borderColor: COLORS.border, borderRadius: 10, borderWidth: 1, flexDirection: 'row', padding: 4 },
  segmentText: { color: COLORS.textSecondary, flex: 1, fontSize: 12, fontWeight: '600', padding: 10, textAlign: 'center', textTransform: 'capitalize' },
  segmentSelected: { backgroundColor: COLORS.white, borderRadius: 8, color: COLORS.habits },
});
