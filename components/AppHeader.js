import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/typography';
import { RADIUS, SHADOWS } from '../constants/theme';

const tintForAccent = (accent) => {
  if (accent === COLORS.habits) return COLORS.accentLight.habits;
  if (accent === COLORS.notes) return COLORS.accentLight.notes;
  if (accent === COLORS.journal) return COLORS.accentLight.journal;
  return COLORS.accentLight.health;
};

export function AppHeader({
  title,
  onBack,
  rightIcon,
  onRight,
  rightText,
  accent = COLORS.health,
  showMenu,
  showSettings,
}) {
  const navigation = useNavigation();
  const canShowMenu = showMenu ?? !onBack;
  const canShowSettings = showSettings ?? !onBack;
  const openDrawer = () => {
    try {
      navigation.dispatch(DrawerActions.openDrawer());
    } catch (e) {
      navigation.getParent('RootDrawer')?.openDrawer?.();
    }
  };
  const openSettings = () => {
    try {
      navigation.getParent('RootDrawer')?.navigate('Settings');
    } catch (e) {
      navigation.navigate('Settings');
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.side}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.iconButton} hitSlop={10}>
            <Ionicons name="chevron-back" size={22} color={COLORS.textPrimary} />
          </Pressable>
        ) : canShowMenu ? (
          <Pressable onPress={openDrawer} style={[styles.iconButton, styles.neutralButton]} hitSlop={10}>
            <Ionicons name="menu" size={22} color={COLORS.textPrimary} />
          </Pressable>
        ) : null}
      </View>
      <Text selectable style={[TYPOGRAPHY.title, styles.title]} numberOfLines={1}>
        {title}
      </Text>
      <View style={[styles.side, styles.right]}>
        {canShowSettings ? (
          <Pressable onPress={openSettings} style={[styles.iconButton, styles.neutralButton]} hitSlop={10}>
            <Ionicons name="settings-outline" size={19} color={COLORS.textPrimary} />
          </Pressable>
        ) : null}
        {rightIcon ? (
          <Pressable
            onPress={onRight}
            style={[styles.iconButton, SHADOWS.subtle, { backgroundColor: tintForAccent(accent), borderColor: accent }]}
            hitSlop={10}
          >
            <Ionicons name={rightIcon} size={20} color={accent} />
          </Pressable>
        ) : null}
        {rightText ? (
          <Pressable onPress={onRight} hitSlop={10}>
            <Text style={[styles.rightText, { color: accent }]}>{rightText}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', flexDirection: 'row', minHeight: 40 },
  side: { width: 88, flexDirection: 'row' },
  right: { gap: 8, justifyContent: 'flex-end' },
  title: { flex: 1, textAlign: 'center' },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.pill,
    borderWidth: 1,
  },
  neutralButton: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.borderLight,
    ...SHADOWS.subtle,
  },
  rightText: { fontSize: 14, fontWeight: '600' },
});
