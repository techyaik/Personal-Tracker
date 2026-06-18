import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback, Keyboard, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { AppHeader } from '../../components/AppHeader';
import { InputField } from '../../components/InputField';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { useHealth } from '../../hooks/useHealth';
import { showToast } from '../../utils/feedback';
import { todayKey } from '../../utils/dates';

export default function HealthLogEntry({ navigation, route }) {
  const { logs, addLog, updateLog, deleteLog } = useHealth();
  const editing = logs.find((log) => log.id === route.params?.entryId) || route.params?.entry;
  const [form, setForm] = useState({
    date: route.params?.date || todayKey(),
    weight: '',
    sleep: '',
    steps: '',
    water: '',
    notes: '',
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
      });
    }
  }, [editing?.id]);

  const setValue = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const save = async () => {
    const hasMetric = ['weight', 'sleep', 'steps', 'water', 'notes'].some((key) => String(form[key]).trim());
    if (!hasMetric) {
      Alert.alert('Add at least one metric', 'Fill one field before saving this health log.');
      return;
    }
    const payload = {
      date: form.date,
      weight: form.weight ? Number(form.weight) : null,
      sleep: form.sleep ? Number(form.sleep) : null,
      steps: form.steps ? Number.parseInt(form.steps, 10) : null,
      water: form.water ? Number.parseInt(form.water, 10) : null,
      notes: form.notes.trim(),
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
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
            </View>
            <PrimaryButton title="Save log" color={COLORS.health} onPress={save} />
            {editing ? <PrimaryButton title="Delete log" color={COLORS.danger} onPress={confirmDelete} /> : null}
          </Screen>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  form: { gap: 8 },
});
