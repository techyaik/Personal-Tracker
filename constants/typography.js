import { COLORS } from './colors';

export const TYPOGRAPHY = {
  title: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  section: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.08,
  },
  body: { fontSize: 14, fontWeight: '400', color: COLORS.textPrimary },
  meta: { fontSize: 11, fontWeight: '400', color: COLORS.textSecondary },
  micro: { fontSize: 10, fontWeight: '400', color: COLORS.textHint },
  metricValue: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  metricLabel: { fontSize: 11, fontWeight: '400', color: COLORS.textHint },
};
