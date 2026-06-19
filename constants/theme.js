import { COLORS } from './colors';

export const RADIUS = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 26,
  pill: 999,
};

export const SPACING = {
  screen: 18,
  card: 14,
  gap: 10,
  section: 18,
};

export const SHADOWS = {
  soft: {
    boxShadow: '0 10px 24px rgba(26, 26, 26, 0.08)',
  },
  subtle: {
    boxShadow: '0 4px 14px rgba(26, 26, 26, 0.06)',
  },
  glow: {
    boxShadow: '0 12px 30px rgba(24, 95, 165, 0.18)',
  },
};

export const GRADIENTS = {
  page: [COLORS.bgWarm, COLORS.bg],
  health: ['#2E7BBE', COLORS.health],
  habits: ['#7B72DA', COLORS.habits],
  notes: ['#D9902E', COLORS.notes],
  journal: ['#B24B2B', COLORS.journal],
};
