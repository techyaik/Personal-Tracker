import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { MOODS } from '../../constants/categories';
import { AppHeader } from '../../components/AppHeader';
import { InputField } from '../../components/InputField';
import { MoodPicker } from '../../components/MoodPicker';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { useJournal } from '../../hooks/useJournal';
import { displayDate, todayKey } from '../../utils/dates';
import { showToast } from '../../utils/feedback';
import { RADIUS, SHADOWS } from '../../constants/theme';

export default function JournalNewEntry({ navigation, route }) {
  const { entries, addEntry, updateEntry } = useJournal();
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
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Screen>
        <AppHeader title={entry ? 'Edit entry' : 'New entry'} onBack={() => navigation.goBack()} rightText="Save" accent={COLORS.journal} onRight={save} />
        <MoodPicker value={mood} onChange={setMood} />
        <InputField value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />
        <Text selectable style={styles.dateText}>{displayDate(date)}</Text>
        <InputField value={title} onChangeText={setTitle} placeholder="Give this entry a title" style={styles.titleInput} />
        <InputField value={body} onChangeText={setBody} placeholder="Write anything..." multiline style={styles.bodyInput} />
      </Screen>
      <View style={styles.toolbar}>
        <Tool label="B" onPress={() => setBody((current) => current ? `**${current}**` : current)} />
        <Tool label="I" onPress={() => setBody((current) => current ? `*${current}*` : current)} />
        <Tool label="•" onPress={() => setBody((current) => `${current}\n- `)} />
      </View>
    </KeyboardAvoidingView>
  );
}

function Tool({ label, onPress }) {
  return (
    <Text onPress={onPress} style={styles.tool}>{label}</Text>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.bg },
  dateText: { color: COLORS.textSecondary, fontSize: 11 },
  titleInput: { backgroundColor: COLORS.bg, borderWidth: 0, fontSize: 19, fontWeight: '700' },
  bodyInput: { minHeight: 320 },
  toolbar: {
    backgroundColor: COLORS.white,
    borderTopColor: COLORS.borderLight,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 16,
    paddingBottom: 18,
    paddingHorizontal: 18,
    paddingTop: 8,
    ...SHADOWS.soft,
  },
  tool: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontWeight: '700',
    height: 36,
    lineHeight: 36,
    borderRadius: RADIUS.pill,
    textAlign: 'center',
    width: 36,
  },
});
