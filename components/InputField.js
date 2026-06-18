import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { COLORS } from '../constants/colors';

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
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 10,
    borderWidth: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    minHeight: 46,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  multiline: {
    minHeight: 108,
    textAlignVertical: 'top',
  },
});
