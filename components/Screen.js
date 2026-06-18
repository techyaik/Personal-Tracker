import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';

export function Screen({ children, scroll = true, loading = false, style, contentStyle }) {
  if (loading) {
    return (
      <SafeAreaView style={[styles.root, styles.center, style]}>
        <ActivityIndicator color={COLORS.health} />
      </SafeAreaView>
    );
  }

  if (!scroll) {
    return <SafeAreaView style={[styles.root, style]}>{children}</SafeAreaView>;
  }

  return (
    <SafeAreaView style={[styles.root, style]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[styles.content, contentStyle]}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 16, gap: 16 },
  center: { alignItems: 'center', justifyContent: 'center' },
});
