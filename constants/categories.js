import { COLORS } from './colors';

export const CATEGORIES = [
  { key: 'health', label: 'Health', color: COLORS.pillHealth },
  { key: 'learning', label: 'Learning', color: COLORS.pillLearning },
  { key: 'fitness', label: 'Fitness', color: COLORS.pillFitness },
  { key: 'mindfulness', label: 'Mindful', color: COLORS.pillMindful },
  { key: 'other', label: 'Other', color: COLORS.pillOther },
];

export const MOODS = [
  { key: 'happy', emoji: '😊', label: 'Happy', color: COLORS.health },
  { key: 'neutral', emoji: '😐', label: 'Neutral', color: COLORS.textSecondary },
  { key: 'sad', emoji: '😔', label: 'Sad', color: COLORS.habits },
  { key: 'stressed', emoji: '😤', label: 'Stressed', color: COLORS.wallet },
  { key: 'excited', emoji: '🤩', label: 'Excited', color: COLORS.notes },
];

export const GOALS = ['daily', 'weekdays', 'weekends'];
