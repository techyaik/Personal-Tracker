import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { SPACING } from '../constants/theme';

export function Screen({ children, scroll = true, loading = false, style, contentStyle }) {
  const { colors, gradients } = useTheme();

  if (loading) {
    return (
      <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }, styles.center, style]}>
        <LinearGradient colors={gradients.page} style={StyleSheet.absoluteFill} pointerEvents="none" />
        <View style={[styles.loader, { backgroundColor: colors.white, borderColor: colors.border }]}>
          <ActivityIndicator color={colors.health} />
        </View>
      </SafeAreaView>
    );
  }

  if (!scroll) {
    return (
      <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }, style]}>
        <LinearGradient colors={gradients.page} style={StyleSheet.absoluteFill} pointerEvents="none" />
        {children}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }, style]}>
      <LinearGradient colors={gradients.page} style={StyleSheet.absoluteFill} pointerEvents="none" />
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
  root: { flex: 1 },
  content: { padding: SPACING.screen, gap: SPACING.section },
  center: { alignItems: 'center', justifyContent: 'center' },
  loader: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
});
