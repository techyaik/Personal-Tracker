import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { COLORS } from '../constants/colors';
import { RADIUS } from '../constants/theme';

export function InputField(props) {
  return (
    <TextInput
      placeholderTextColor={COLORS.textHint}
      {...props}
      style={[styles.input, props.multiline ? styles.multiline : null, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    minHeight: 50,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  multiline: {
    minHeight: 108,
    textAlignVertical: 'top',
  },
});
