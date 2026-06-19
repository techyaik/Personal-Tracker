import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { COLORS } from '../constants/colors';
import { RADIUS, SHADOWS } from '../constants/theme';
import { displayDate } from '../utils/dates';
import { Pill } from './Pill';

export function NoteCard({ note, onPress, onDelete }) {
  const renderRightActions = () => (
    <Pressable
      onPress={() => Alert.alert('Delete note?', 'This cannot be undone.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ])}
      style={styles.delete}
    >
      <Ionicons name="trash-outline" size={22} color={COLORS.white} />
    </Pressable>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <Pressable onPress={onPress} style={styles.card}>
        <View style={styles.titleRow}>
          {note.pinned ? <Ionicons name="pin" size={14} color={COLORS.notes} /> : null}
          <Text selectable style={styles.title} numberOfLines={1}>
            {note.title || 'Untitled'}
          </Text>
        </View>
        <Text selectable style={styles.preview} numberOfLines={2}>
          {note.body || 'No body text'}
        </Text>
        <View style={styles.footer}>
          {note.tags?.[0] ? <Pill label={note.tags[0]} palette={COLORS.pillFitness} /> : <View />}
          <Text selectable style={styles.date}>
            {displayDate(note.updatedAt)}
          </Text>
        </View>
      </Pressable>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    gap: 8,
    padding: 12,
    ...SHADOWS.subtle,
  },
  titleRow: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  title: { color: COLORS.textPrimary, flex: 1, fontSize: 15, fontWeight: '600' },
  preview: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 18 },
  footer: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  date: { color: COLORS.textHint, fontSize: 10 },
  delete: {
    alignItems: 'center',
    backgroundColor: COLORS.danger,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    marginLeft: 8,
    width: 70,
  },
});
