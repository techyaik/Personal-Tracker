import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View, Switch, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { AppHeader } from '../../components/AppHeader';
import { InputField } from '../../components/InputField';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { useHealth } from '../../hooks/useHealth';
import { showToast } from '../../utils/feedback';
import { todayKey, displayDate } from '../../utils/dates';

export default function HealthLogEntry({ navigation, route }) {
  const { logs, addLog, updateLog, deleteLog } = useHealth();
  const { colors } = useTheme();
  
  const editing = logs.find((log) => log.id === route.params?.entryId) || route.params?.entry;
  const [form, setForm] = useState({
    date: route.params?.date || todayKey(),
    weight: '',
    sleep: '',
    steps: '',
    water: '',
    notes: '',
    period: false,
  });

  useEffect(() => {
    if (editing) {
      setForm({
        date: editing.date,
        weight: editing.weight ? String(editing.weight) : '',
        sleep: editing.sleep ? String(editing.sleep) : '',
        steps: editing.steps ? String(editing.steps) : '',
        water: editing.water ? String(editing.water) : '',
        notes: editing.notes || '',
        period: editing.period || false,
      });
    }
  }, [editing?.id]);

  const setValue = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const save = async () => {
    const trimmedDate = form.date.trim();
    if (!trimmedDate) {
      Alert.alert('Date required', 'Please enter a valid date in YYYY-MM-DD format.');
      return;
    }
    if (displayDate(trimmedDate) === 'Invalid date') {
      Alert.alert('Invalid date', 'Please enter a valid date in YYYY-MM-DD format.');
      return;
    }

    const hasMetric = ['weight', 'sleep', 'steps', 'water', 'notes'].some((key) => String(form[key]).trim()) || form.period;
    if (!hasMetric) {
      Alert.alert('Add at least one metric', 'Fill one field before saving this health log.');
      return;
    }

    // Input Validation
    if (form.weight && (isNaN(Number(form.weight)) || Number(form.weight) < 0)) {
      Alert.alert('Invalid weight', 'Please enter a valid positive number for weight.');
      return;
    }
    if (form.sleep && (isNaN(Number(form.sleep)) || Number(form.sleep) < 0 || Number(form.sleep) > 24)) {
      Alert.alert('Invalid sleep hours', 'Please enter a valid number of sleep hours (between 0 and 24).');
      return;
    }
    if (form.steps && (isNaN(Number.parseInt(form.steps, 10)) || Number.parseInt(form.steps, 10) < 0)) {
      Alert.alert('Invalid steps', 'Please enter a valid positive integer for steps.');
      return;
    }
    if (form.water && (isNaN(Number.parseInt(form.water, 10)) || Number.parseInt(form.water, 10) < 0)) {
      Alert.alert('Invalid water count', 'Please enter a valid positive integer for water glasses.');
      return;
    }

    const payload = {
      date: trimmedDate,
      weight: form.weight ? Number(form.weight) : null,
      sleep: form.sleep ? Number(form.sleep) : null,
      steps: form.steps ? Number.parseInt(form.steps, 10) : null,
      water: form.water ? Number.parseInt(form.water, 10) : null,
      notes: form.notes.trim(),
      period: form.period || false,
    };
    if (editing) {
      await updateLog(editing.id, payload);
    } else {
      await addLog({ id: Date.now().toString(), ...payload, createdAt: new Date().toISOString() });
    }
    showToast('Health logged ✓');
    navigation.goBack();
  };

  const confirmDelete = () => {
    if (!editing) return;
    Alert.alert('Delete log?', 'This health log will be removed permanently.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteLog(editing.id);
          navigation.navigate('HealthDashboard');
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView style={[styles.flex, { backgroundColor: colors.bg }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.flex}>
        <Screen>
          <AppHeader title="Log health" onBack={() => navigation.goBack()} />
          <View style={styles.form}>
            <InputField value={form.date} onChangeText={(v) => setValue('date', v)} placeholder="YYYY-MM-DD" />
            <InputField value={form.weight} onChangeText={(v) => setValue('weight', v)} placeholder="Weight (kg)" keyboardType="decimal-pad" />
            <InputField value={form.sleep} onChangeText={(v) => setValue('sleep', v)} placeholder="Sleep (hours)" keyboardType="decimal-pad" />
            <InputField value={form.steps} onChangeText={(v) => setValue('steps', v)} placeholder="Steps" keyboardType="number-pad" />
            <InputField value={form.water} onChangeText={(v) => setValue('water', v)} placeholder="Water (glasses)" keyboardType="number-pad" />
            <InputField value={form.notes} onChangeText={(v) => setValue('notes', v)} placeholder="Notes" multiline />
            <View style={styles.switchRow}>
              <Text style={[styles.switchLabel, { color: colors.textPrimary }]}>Period started today</Text>
              <Switch
                value={form.period}
                onValueChange={(v) => setValue('period', v)}
                trackColor={{ false: colors.border, true: colors.health }}
                thumbColor={colors.white}
              />
            </View>
          </View>
          <PrimaryButton title="Save log" color={colors.health} onPress={save} />
          {editing ? <PrimaryButton title="Delete log" color={colors.danger} onPress={confirmDelete} style={{ marginTop: 8 }} /> : null}
        </Screen>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  form: { gap: 8 },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginTop: 4,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});
