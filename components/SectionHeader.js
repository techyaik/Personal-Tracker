import React from 'react';
import { Text } from 'react-native';
import { TYPOGRAPHY } from '../constants/typography';

export function SectionHeader({ children }) {
  return <Text style={TYPOGRAPHY.section}>{children}</Text>;
}
