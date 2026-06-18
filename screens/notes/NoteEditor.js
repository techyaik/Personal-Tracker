import React, { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { AppHeader } from '../../components/AppHeader';
import { InputField } from '../../components/InputField';
import { Pill } from '../../components/Pill';
import { Screen } from '../../components/Screen';
import { useNotes } from '../../hooks/useNotes';
import { showToast } from '../../utils/feedback';

const wrap = (text, prefix, suffix = prefix) => (text ? `${prefix}${text}${suffix}` : '');

export default function NoteEditor({ navigation, route }) {
  const { notes, addNote, updateNote, deleteNote, getAllTags } = useNotes();
  const note = notes.find((item) => item.id === route.params?.note?.id) || route.params?.note;
  const [id] = useState(note?.id || Date.now().toString());
  const [title, setTitle] = useState(note?.title || '');
  const [body, setBody] = useState(note?.body || '');
  const [tags, setTags] = useState(note?.tags || []);
  const [pinned, setPinned] = useState(Boolean(note?.pinned));
  const [tagModal, setTagModal] = useState(false);
  const [newTag, setNewTag] = useState('');
  const createdRef = useRef(Boolean(note));
  const timerRef = useRef(null);

  const persist = async (showMessage = false) => {
    const now = new Date().toISOString();
    const payload = {
      id,
      title: title.trim() || 'Untitled',
      body,
      tags,
      pinned,
      createdAt: note?.createdAt || now,
      updatedAt: now,
    };
    if (createdRef.current) await updateNote(id, payload);
    else {
      await addNote(payload);
      createdRef.current = true;
    }
    if (showMessage) showToast('Saved ✓');
  };

  useEffect(() => {
    if (!title && !body && !tags.length && !pinned) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => persist(false), 500);
    return () => clearTimeout(timerRef.current);
  }, [title, body, tags, pinned]);

  const addTag = () => {
    const value = newTag.trim();
    if (value && !tags.includes(value)) setTags((current) => [...current, value]);
    setNewTag('');
    setTagModal(false);
  };

  const saveAndBack = async () => {
    await persist(true);
    navigation.goBack();
  };

  const confirmDelete = () =>
    Alert.alert('Delete note?', 'This note will be removed permanently.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await deleteNote(id);
        navigation.navigate('NotesList');
      } },
    ]);

  const existingTags = getAllTags();

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Screen>
        <AppHeader title={note ? 'Edit note' : 'New note'} onBack={saveAndBack} rightText="Save" accent={COLORS.notes} onRight={saveAndBack} />
        <InputField value={title} onChangeText={setTitle} placeholder="Title" style={styles.titleInput} />
        <InputField value={body} onChangeText={setBody} placeholder="Start writing..." multiline style={styles.bodyInput} />
        <View style={styles.tags}>
          {existingTags.map((tag) => (
            <Pill
              key={tag}
              label={tag}
              selected={tags.includes(tag)}
              onPress={() => setTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]))}
              palette={COLORS.pillFitness}
            />
          ))}
          <Pill label="+ Add tag" onPress={() => setTagModal(true)} palette={COLORS.pillFitness} />
        </View>
      </Screen>
      <View style={styles.toolbar}>
        <Tool label="B" onPress={() => setBody((current) => wrap(current, '**'))} />
        <Tool label="I" onPress={() => setBody((current) => wrap(current, '*'))} />
        <Tool icon="list" onPress={() => setBody((current) => `${current}\n- `)} />
        <Tool icon="link" onPress={() => setBody((current) => `${current}\n[title](https://)`)} />
        <Tool icon={pinned ? 'pin' : 'pin-outline'} active={pinned} onPress={() => setPinned((current) => !current)} />
        <Tool icon="trash-outline" danger onPress={confirmDelete} />
      </View>
      <Modal visible={tagModal} transparent animationType="fade">
        <Pressable style={styles.modalBackdrop} onPress={() => setTagModal(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add tag</Text>
            <InputField value={newTag} onChangeText={setNewTag} placeholder="Tag name" autoFocus />
            <Pressable onPress={addTag} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Add</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

function Tool({ icon, label, onPress, danger, active }) {
  return (
    <Pressable onPress={onPress} style={[styles.tool, active ? styles.toolActive : null]}>
      {icon ? (
        <Ionicons name={icon} size={20} color={danger ? COLORS.danger : active ? COLORS.notes : COLORS.textSecondary} />
      ) : (
        <Text style={[styles.toolLabel, { color: active ? COLORS.notes : COLORS.textSecondary }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.bg },
  titleInput: { backgroundColor: COLORS.bg, borderWidth: 0, fontSize: 22, fontWeight: '600' },
  bodyInput: { minHeight: 300 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  toolbar: {
    backgroundColor: COLORS.white,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 18,
    paddingTop: 8,
  },
  tool: { alignItems: 'center', borderRadius: 18, height: 36, justifyContent: 'center', width: 36 },
  toolLabel: { fontSize: 15, fontWeight: '700' },
  toolActive: { backgroundColor: COLORS.surface },
  modalBackdrop: { alignItems: 'center', backgroundColor: COLORS.overlay, flex: 1, justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: COLORS.white, borderRadius: 12, gap: 12, padding: 16, width: '100%' },
  modalTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '600' },
  modalButton: { alignItems: 'center', backgroundColor: COLORS.notes, borderRadius: 10, padding: 12 },
  modalButtonText: { color: COLORS.white, fontWeight: '600' },
});
