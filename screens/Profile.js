import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { AppHeader } from '../components/AppHeader';
import { FeatureWalkthrough } from '../components/FeatureWalkthrough';
import { Screen } from '../components/Screen';
import { MetricCard } from '../components/MetricCard';
import { useHabits } from '../hooks/useHabits';
import { useHealth } from '../hooks/useHealth';
import { useWallet } from '../hooks/useWallet';
import { useNotes } from '../hooks/useNotes';
import { RADIUS, SHADOWS } from '../constants/theme';
import { WALKTHROUGH_STEPS } from '../constants/walkthroughs';

export default function Profile({ navigation }) {
  const { colors } = useTheme();
  
  const { habits, completions } = useHabits();
  const { logs } = useHealth();
  const { transactions } = useWallet();
  const { notes } = useNotes();

  const totalCompletions = completions.filter((c) => c.done).length;
  const activeHabitsCount = habits.length;
  const healthLogsCount = logs.length;
  const walletTransactionsCount = transactions.length;
  const notesCount = notes.length;

  return (
    <Screen>
      <AppHeader title="Profile" onBack={() => navigation.navigate('Main')} />

      {/* User Information Card */}
      <View style={[styles.profileCard, { backgroundColor: colors.white, borderColor: colors.borderLight }]}>
        <View style={[styles.avatar, { backgroundColor: colors.health }]}>
          <Text style={[styles.avatarText, { color: colors.white }]}>AI</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.name, { color: colors.textPrimary }]}>Asif Imran Khan</Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>asif.imran@example.com</Text>
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
            value={walletTransactionsCount}
            label="Wallet Transactions"
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
      <FeatureWalkthrough screenKey="profile" steps={WALKTHROUGH_STEPS.profile} />
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
});
