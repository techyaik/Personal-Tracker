import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  isAfter,
  isSameDay,
  isToday,
  parseISO,
  startOfMonth,
  subDays,
} from 'date-fns';

export const todayKey = () => format(new Date(), 'yyyy-MM-dd');
export const dateKey = (date) => format(date, 'yyyy-MM-dd');

export const displayDate = (value, pattern = 'MMM d, yyyy') => {
  try {
    if (!value) return 'Invalid date';
    const parsed = typeof value === 'string' ? parseISO(value) : value;
    if (isNaN(parsed.getTime())) return 'Invalid date';
    return format(parsed, pattern);
  } catch (e) {
    return 'Invalid date';
  }
};

export const lastSevenDaysEnding = (dateString) => {
  try {
    if (!dateString) return [];
    const end = parseISO(dateString);
    if (isNaN(end.getTime())) return [];
    return eachDayOfInterval({ start: subDays(end, 6), end }).map(dateKey);
  } catch (e) {
    return [];
  }
};

export const monthGridDays = (monthDate) => {
  try {
    if (!monthDate) return [];
    const monthStart = startOfMonth(monthDate);
    if (isNaN(monthStart.getTime())) return [];
    const offset = (monthStart.getDay() + 6) % 7;
    const start = addDays(monthStart, -offset);
    const days = [];
    for (let i = 0; i < 42; i += 1) days.push(addDays(start, i));
    return days;
  } catch (e) {
    return [];
  }
};

export const shouldCountForGoal = (dateString, goal) => {
  try {
    if (!dateString) return false;
    const parsed = parseISO(dateString);
    if (isNaN(parsed.getTime())) return false;
    const day = parsed.getDay();
    if (goal === 'weekdays') return day >= 1 && day <= 5;
    if (goal === 'weekends') return day === 0 || day === 6;
    return true;
  } catch (e) {
    return false;
  }
};

export const isFutureDate = (date) => {
  try {
    if (!date) return false;
    return isAfter(date, new Date()) && !isToday(date);
  } catch (e) {
    return false;
  }
};

export const sameDay = isSameDay;
