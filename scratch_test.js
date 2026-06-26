const { format, addDays, subDays } = require('date-fns');

const DUMMY_PREFIX = 'lifio_dummy_';
const keyFor = (offset = 0) => format(addDays(new Date(), offset), 'yyyy-MM-dd');
const isoFor = (offset = 0) => addDays(new Date(), offset).toISOString();

const removeDummyItems = (items) => {
  if (!Array.isArray(items)) return [];
  return items.filter((item) => item && !String(item.id || '').startsWith(DUMMY_PREFIX));
};

async function fillDummyData() {
  const today = keyFor(0);
  const yesterday = keyFor(-1);
  const twoDaysAgo = keyFor(-2);

  const healthLogs = [
    {
      id: `${DUMMY_PREFIX}health_today`,
      date: today,
      weight: 70.2,
      sleep: 7.5,
      steps: 8320,
      water: 6,
      notes: 'Felt steady today. Short walk after lunch helped energy.',
      createdAt: isoFor(0),
    },
    {
      id: `${DUMMY_PREFIX}health_yesterday`,
      date: yesterday,
      weight: 70.4,
      sleep: 6.5,
      steps: 7200,
      water: 5,
      notes: 'Skipped the gym, walked home from work instead.',
      createdAt: isoFor(-1),
    },
    {
      id: `${DUMMY_PREFIX}health_two_days`,
      date: twoDaysAgo,
      weight: 70.1,
      sleep: 8,
      steps: 9800,
      water: 7,
      notes: '',
      createdAt: isoFor(-2),
    },
  ];

  const habits = [
    {
      id: `${DUMMY_PREFIX}habit_walk`,
      name: 'Morning walk',
      category: 'fitness',
      reminderTime: '07:00',
      goal: 'daily',
      createdAt: subDays(new Date(), 14).toISOString(),
    },
    {
      id: `${DUMMY_PREFIX}habit_read`,
      name: 'Read 20 mins',
      category: 'learning',
      reminderTime: '21:00',
      goal: 'daily',
      createdAt: subDays(new Date(), 10).toISOString(),
    },
    {
      id: `${DUMMY_PREFIX}habit_water`,
      name: 'Drink 8 glasses',
      category: 'health',
      reminderTime: null,
      goal: 'weekdays',
      createdAt: subDays(new Date(), 7).toISOString(),
    },
  ];

  const completions = [];
  habits.forEach((habit, habitIndex) => {
    for (let offset = -6; offset <= 0; offset += 1) {
      if (habitIndex === 2 && offset < -3) continue;
      completions.push({ habitId: habit.id, date: keyFor(offset), done: !(habitIndex === 1 && offset === -2) });
    }
  });

  const notes = [
    {
      id: `${DUMMY_PREFIX}note_ideas`,
      title: 'App ideas for 2026',
      body: 'Add AI insights, mood-based suggestions, weekly summaries, and export options.',
      tags: ['Ideas'],
      pinned: true,
      createdAt: isoFor(-3),
      updatedAt: isoFor(-1),
    },
    {
      id: `${DUMMY_PREFIX}note_grocery`,
      title: 'Grocery list',
      body: 'Milk, eggs, spinach, oats, almonds, olive oil, lemons.',
      tags: ['Personal'],
      pinned: false,
      createdAt: isoFor(-2),
      updatedAt: isoFor(-2),
    },
    {
      id: `${DUMMY_PREFIX}note_work`,
      title: 'Meeting notes — Q2 review',
      body: 'Discussed targets, health launch timeline, and weekly KPI reporting.',
      tags: ['Work'],
      pinned: false,
      createdAt: isoFor(-5),
      updatedAt: isoFor(-4),
    },
  ];

  const walletAccounts = [
    {
      id: `${DUMMY_PREFIX}ac_main`,
      name: 'Main Account',
      initialBalance: 1000.00,
      color: '#185FA5',
      icon: 'wallet-outline',
      createdAt: isoFor(-5),
    },
    {
      id: `${DUMMY_PREFIX}ac_savings`,
      name: 'Savings',
      initialBalance: 500.00,
      color: '#534AB7',
      icon: 'briefcase-outline',
      createdAt: isoFor(-5),
    },
    {
      id: `${DUMMY_PREFIX}ac_card`,
      name: 'Credit Card',
      initialBalance: 0.00,
      color: '#993C1D',
      icon: 'card-outline',
      createdAt: isoFor(-5),
    },
  ];

  const walletEntries = [
    {
      id: `${DUMMY_PREFIX}wallet_1`,
      label: 'Monthly Salary',
      cat: 'Salary',
      amount: 4500.00,
      type: 'in',
      walletId: `${DUMMY_PREFIX}ac_main`,
      date: keyFor(-3),
      paymentMethod: 'Bank Transfer',
      notes: 'Direct deposit from work.',
      createdAt: isoFor(-3),
    },
    {
      id: `${DUMMY_PREFIX}wallet_2`,
      label: 'Organic Grocery Store',
      cat: 'Food',
      amount: 142.50,
      type: 'out',
      walletId: `${DUMMY_PREFIX}ac_main`,
      date: keyFor(-2),
      paymentMethod: 'Debit Card',
      notes: '',
      createdAt: isoFor(-2),
    },
    {
      id: `${DUMMY_PREFIX}wallet_3`,
      label: 'Gas Station Fuel',
      cat: 'Transport',
      amount: 45.00,
      type: 'out',
      walletId: `${DUMMY_PREFIX}ac_card`,
      date: keyFor(-1),
      paymentMethod: 'Credit Card',
      notes: '',
      createdAt: isoFor(-1),
    },
    {
      id: `${DUMMY_PREFIX}wallet_4`,
      label: 'Savings Transfer',
      cat: 'Transfer',
      amount: 300.00,
      type: 'transfer',
      fromWalletId: `${DUMMY_PREFIX}ac_main`,
      toWalletId: `${DUMMY_PREFIX}ac_savings`,
      date: keyFor(-1),
      paymentMethod: 'Bank Transfer',
      notes: 'Auto savings transfer.',
      createdAt: isoFor(-1),
    },
    {
      id: `${DUMMY_PREFIX}wallet_5`,
      label: 'Movie Tickets & Dinner',
      cat: 'Fun',
      amount: 65.00,
      type: 'out',
      walletId: `${DUMMY_PREFIX}ac_card`,
      date: keyFor(0),
      paymentMethod: 'Credit Card',
      notes: 'Weekend night out.',
      createdAt: isoFor(0),
    },
  ];

  console.log('healthLogs:', healthLogs.length);
  console.log('habits:', habits.length);
  console.log('completions:', completions.length);
  console.log('notes:', notes.length);
  console.log('walletAccounts:', walletAccounts.length);
  console.log('walletEntries:', walletEntries.length);
}

fillDummyData();
