import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
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

export default function HabitEdit({ navigation, route }) {
  const { habits, updateHabit, deleteHabit } = useHabits();
  const { colors } = useTheme();

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
      <PrimaryButton title="Save changes" color={colors.habits} onPress={save} />
      <PrimaryButton title="Delete habit" color={colors.danger} onPress={confirmDelete} style={{ marginTop: 8 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { gap: 10 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  segment: { borderRadius: RADIUS.md, borderWidth: 1, flexDirection: 'row', padding: 4 },
  segmentText: { flex: 1, fontSize: 12, fontWeight: '600', padding: 10, textAlign: 'center', textTransform: 'capitalize' },
});
