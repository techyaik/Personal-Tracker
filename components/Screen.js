import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { GRADIENTS, SPACING } from '../constants/theme';

export function Screen({ children, scroll = true, loading = false, style, contentStyle }) {
  if (loading) {
    return (
      <SafeAreaView style={[styles.root, styles.center, style]}>
        <LinearGradient colors={GRADIENTS.page} style={StyleSheet.absoluteFill} pointerEvents="none" />
        <View style={styles.loader}>
          <ActivityIndicator color={COLORS.health} />
        </View>
      </SafeAreaView>
    );
  }

  if (!scroll) {
    return (
      <SafeAreaView style={[styles.root, style]}>
        <LinearGradient colors={GRADIENTS.page} style={StyleSheet.absoluteFill} pointerEvents="none" />
        {children}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.root, style]}>
      <LinearGradient colors={GRADIENTS.page} style={StyleSheet.absoluteFill} pointerEvents="none" />
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
  content: { padding: SPACING.screen, gap: SPACING.section },
  center: { alignItems: 'center', justifyContent: 'center' },
  loader: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 18,
    borderWidth: 1,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
});
