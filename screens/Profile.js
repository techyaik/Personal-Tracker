import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { AppHeader } from '../components/AppHeader';
import { Screen } from '../components/Screen';
import { MetricCard } from '../components/MetricCard';
import { useAuthUser } from '../hooks/useAuthUser';
import { useHabits } from '../hooks/useHabits';
import { useHealth } from '../hooks/useHealth';
import { useNotes } from '../hooks/useNotes';
import { RADIUS, SHADOWS } from '../constants/theme';

export default function Profile({ navigation }) {
  const { colors } = useTheme();
  const authUser = useAuthUser();
  
  const { habits, completions } = useHabits();
  const { logs } = useHealth();
  const { notes } = useNotes();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(authUser.name);

  useEffect(() => {
    setEditName(authUser.name);
  }, [authUser.name]);

  const totalCompletions = completions.filter((c) => c.done).length;
  const activeHabitsCount = habits.length;
  const healthLogsCount = logs.length;
  const notesCount = notes.length;

  return (
    <Screen>
      <AppHeader title="Profile" onBack={() => navigation.navigate('Main')} />

      {/* User Information Card */}
      <View style={[styles.profileCard, { backgroundColor: colors.white, borderColor: colors.borderLight }]}>
        <View style={[styles.avatar, { backgroundColor: colors.health }]}>
          <Text style={[styles.avatarText, { color: colors.white }]}>{authUser.initials}</Text>
        </View>
        <View style={styles.userInfo}>
          {isEditing ? (
            <View style={styles.editNameRow}>
              <TextInput
                value={editName}
                onChangeText={setEditName}
                style={[styles.nameInput, { color: colors.textPrimary, borderBottomColor: colors.border }]}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={async () => {
                  if (editName.trim()) {
                    await authUser.updateProfileName(editName);
                  }
                  setIsEditing(false);
                }}
              />
              <Pressable
                onPress={async () => {
                  if (editName.trim()) {
                    await authUser.updateProfileName(editName);
                  }
                  setIsEditing(false);
                }}
                style={{ marginLeft: 8 }}
              >
                <Ionicons name="checkmark-outline" size={18} color={colors.health} />
              </Pressable>
            </View>
          ) : (
            <View style={styles.nameRow}>
              <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>{authUser.name}</Text>
              <Pressable onPress={() => setIsEditing(true)} style={{ marginLeft: 6 }}>
                <Ionicons name="create-outline" size={16} color={colors.textSecondary} />
              </Pressable>
            </View>
          )}
          <Text style={[styles.email, { color: colors.textSecondary }]} numberOfLines={1}>
            {authUser.email || 'Local Lifio profile'}
          </Text>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: colors.accentLight.health }]}>
              <Ionicons name="ribbon-outline" size={14} color={colors.health} />
              <Text style={[styles.badgeText, { color: colors.health }]}>Mindful Achiever</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bento Grid Stats */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>App Statistics</Text>
        
        <View style={styles.grid}>
          <MetricCard
            value={activeHabitsCount}
            label="Active Habits"
            accent={colors.habits}
            icon={<Ionicons name="checkmark-circle-outline" size={16} color={colors.habits} />}
          />
          <MetricCard
            value={totalCompletions}
            label="Total Check-ins"
            accent={colors.habits}
            icon={<Ionicons name="flame-outline" size={16} color={colors.habits} />}
          />
        </View>

        <View style={styles.grid}>
          <MetricCard
            value={healthLogsCount}
            label="Health Logs"
            accent={colors.health}
            icon={<Ionicons name="heart-outline" size={16} color={colors.health} />}
          />
          <MetricCard
            value="Locked"
            label="Wallet"
            accent={colors.wallet}
            icon={<Ionicons name="wallet-outline" size={16} color={colors.wallet} />}
          />
        </View>

        <View style={styles.grid}>
          <MetricCard
            value={notesCount}
            label="Notes Saved"
            accent={colors.notes}
            icon={<Ionicons name="document-text-outline" size={16} color={colors.notes} />}
            style={{ flex: 0.5 }}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: 16,
    ...SHADOWS.subtle,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.subtle,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
  },
  email: {
    fontSize: 13,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 4,
  },
  grid: {
    flexDirection: 'row',
    gap: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '90%',
  },
  nameInput: {
    fontSize: 18,
    fontWeight: '700',
    borderBottomWidth: 1,
    paddingVertical: 2,
    flex: 1,
  },
});
