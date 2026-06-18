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
export const displayDate = (value, pattern = 'MMM d, yyyy') =>
  format(typeof value === 'string' ? parseISO(value) : value, pattern);

export const lastSevenDaysEnding = (dateString) => {
  const end = parseISO(dateString);
  return eachDayOfInterval({ start: subDays(end, 6), end }).map(dateKey);
};

export const monthGridDays = (monthDate) => {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const offset = (monthStart.getDay() + 6) % 7;
  const start = addDays(monthStart, -offset);
  const days = [];
  for (let i = 0; i < 42; i += 1) days.push(addDays(start, i));
  return days;
};

export const isFutureDate = (date) => isAfter(date, new Date()) && !isToday(date);
export const sameDay = isSameDay;
