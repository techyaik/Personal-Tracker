import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { MOODS } from '../../constants/categories';
import { AppHeader } from '../../components/AppHeader';
import { InputField } from '../../components/InputField';
import { MoodPicker } from '../../components/MoodPicker';
import { Screen } from '../../components/Screen';
import { useJournal } from '../../hooks/useJournal';
import { displayDate, todayKey } from '../../utils/dates';
import { showToast } from '../../utils/feedback';
import { RADIUS, SHADOWS } from '../../constants/theme';

export default function JournalNewEntry({ navigation, route }) {
  const { entries, addEntry, updateEntry } = useJournal();
  const { colors } = useTheme();

  const entry = entries.find((item) => item.id === route.params?.entry?.id) || route.params?.entry;
  const [mood, setMood] = useState(entry?.mood || MOODS[0].key);
  const [date, setDate] = useState(entry?.date || todayKey());
  const [title, setTitle] = useState(entry?.title || '');
  const [body, setBody] = useState(entry?.body || '');

  const save = async () => {
    if (!body.trim()) {
      Alert.alert('Body required', 'Write something before saving this journal entry.');
      return;
    }
    const now = new Date().toISOString();
    const payload = {
      title: title.trim() || displayDate(date),
      body,
      mood,
      date,
      updatedAt: now,
    };
    if (entry) await updateEntry(entry.id, payload);
    else await addEntry({ id: Date.now().toString(), ...payload, createdAt: now });
    showToast('Saved ✓');
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={[styles.flex, { backgroundColor: colors.bg }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Screen>
        <AppHeader title={entry ? 'Edit entry' : 'New entry'} onBack={() => navigation.goBack()} rightText="Save" accent={colors.journal} onRight={save} />
        <MoodPicker value={mood} onChange={setMood} />
        <InputField value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />
        <Text selectable style={[styles.dateText, { color: colors.textSecondary }]}>{displayDate(date)}</Text>
        <InputField value={title} onChangeText={setTitle} placeholder="Give this entry a title" style={[styles.titleInput, { backgroundColor: colors.bg, color: colors.textPrimary }]} />
        <InputField value={body} onChangeText={setBody} placeholder="Write anything..." multiline style={styles.bodyInput} />
      </Screen>
      <View style={[styles.toolbar, { backgroundColor: colors.white, borderTopColor: colors.borderLight }]}>
        <Tool label="B" onPress={() => setBody((current) => current ? `**${current}**` : current)} colors={colors} />
        <Tool label="I" onPress={() => setBody((current) => current ? `*${current}*` : current)} colors={colors} />
        <Tool label="•" onPress={() => setBody((current) => `${current}\n- `)} colors={colors} />
      </View>
    </KeyboardAvoidingView>
  );
}

function Tool({ label, onPress, colors }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.tool, pressed ? { backgroundColor: colors.borderLight } : null]}>
      <Text style={[styles.toolText, { color: colors.textSecondary }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  dateText: { fontSize: 11 },
  titleInput: { borderWidth: 0, fontSize: 19, fontWeight: '700' },
  bodyInput: { minHeight: 320 },
  toolbar: {
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 16,
    paddingBottom: 18,
    paddingHorizontal: 18,
    paddingTop: 8,
    ...SHADOWS.soft,
  },
  tool: {
    alignItems: 'center',
    borderRadius: RADIUS.pill,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  toolText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
