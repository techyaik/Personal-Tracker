import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { PrimaryButton } from './PrimaryButton';

export function EmptyState({ icon, message, action, actionLabel, accent }) {
  return (
    <View style={styles.empty}>
      <Ionicons name={icon} size={46} color={COLORS.textHint} />
      <Text selectable style={styles.message}>
        {message}
      </Text>
      {action ? <PrimaryButton title={actionLabel} onPress={action} color={accent} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { alignItems: 'center', gap: 12, justifyContent: 'center', paddingVertical: 42 },
  message: { color: COLORS.textSecondary, fontSize: 14, textAlign: 'center' },
});
