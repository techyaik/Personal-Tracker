import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { RADIUS, SHADOWS } from '../constants/theme';
import { PrimaryButton } from './PrimaryButton';

export function EmptyState({ icon, message, action, actionLabel, accent }) {
  return (
    <View style={styles.empty}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={36} color={accent || COLORS.health} />
      </View>
      <Text selectable style={styles.message}>
        {message}
      </Text>
      {action ? <PrimaryButton title={actionLabel} onPress={action} color={accent} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: 14,
    justifyContent: 'center',
    padding: 24,
    ...SHADOWS.subtle,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.pill,
    height: 70,
    justifyContent: 'center',
    width: 70,
  },
  message: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 20, textAlign: 'center' },
});
