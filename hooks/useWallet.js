import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '../storage/safeAsyncStorage';
import { parseISO } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';
import { useStoredList } from './useStoredList';
import { useTheme } from '../theme/ThemeContext';

const TX_KEY = 'wallet_entries';
const AC_KEY = 'wallet_accounts';
const CURRENCY_KEY = 'wallet_currency';

export const WALLET_CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD' },
  { code: 'INR', symbol: '₹', label: 'INR' },
  { code: 'EUR', symbol: '€', label: 'EUR' },
  { code: 'GBP', symbol: '£', label: 'GBP' },
  { code: 'AED', symbol: 'د.إ', label: 'AED' },
  { code: 'JPY', symbol: '¥', label: 'JPY' },
  { code: 'CAD', symbol: 'C$', label: 'CAD' },
  { code: 'AUD', symbol: 'A$', label: 'AUD' },
  { code: 'CNY', symbol: '元', label: 'CNY' },
  { code: 'SGD', symbol: 'S$', label: 'SGD' },
  { code: 'CHF', symbol: 'CHF', label: 'CHF' },
  { code: 'NZD', symbol: 'NZ$', label: 'NZD' },
  { code: 'ZAR', symbol: 'R', label: 'ZAR' },
  { code: 'BRL', symbol: 'R$', label: 'BRL' },
];

export function useWallet() {
  const { items: txItems, loading: txLoading, saveAll: saveTransactions, refresh: refreshTransactions } = useStoredList(TX_KEY);
  const { items: acItems, loading: acLoading, saveAll: saveAccounts, refresh: refreshAccounts } = useStoredList(AC_KEY);
  const [currencyCode, setCurrencyCode] = useState(WALLET_CURRENCIES[0].code);
  const { dataVersion } = useTheme();

  const loadCurrency = useCallback(async () => {
    try {
      const storedCode = await AsyncStorage.getItem(CURRENCY_KEY);
      if (storedCode && WALLET_CURRENCIES.some((item) => item.code === storedCode)) {
        setCurrencyCode(storedCode);
      } else {
        setCurrencyCode(WALLET_CURRENCIES[0].code);
      }
    } catch (error) {
      console.error('Error reading wallet currency:', error);
    }
  }, []);

  useEffect(() => {
    loadCurrency();
  }, [loadCurrency, dataVersion]);

  useFocusEffect(
    useCallback(() => {
      loadCurrency();
    }, [loadCurrency])
  );

  const currency = useMemo(
    () => WALLET_CURRENCIES.find((item) => item.code === currencyCode) || WALLET_CURRENCIES[0],
    [currencyCode]
  );

  const setCurrency = useCallback(async (nextCode) => {
    const nextCurrency = WALLET_CURRENCIES.find((item) => item.code === nextCode);
    if (!nextCurrency) return;
    setCurrencyCode(nextCurrency.code);
    try {
      await AsyncStorage.setItem(CURRENCY_KEY, nextCurrency.code);
    } catch (error) {
      console.error('Error saving wallet currency:', error);
    }
  }, []);

  const formatMoney = useCallback(
    (amount) => {
      const formatted = Number(amount || 0).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return `${currency.symbol}${formatted}`;
    },
    [currency.symbol]
  );

  // Default account configuration
  const defaultAccount = useMemo(() => ({
    id: 'default',
    name: 'Main Account',
    icon: 'wallet-outline',
    color: '#185FA5', // health color
    initialBalance: 0,
    createdAt: new Date().toISOString(),
  }), []);

  // Accounts list (ensure at least default exists)
  const accounts = useMemo(() => {
    if (!acItems || acItems.length === 0) {
      return [defaultAccount];
    }
    return acItems;
  }, [acItems, defaultAccount]);

  // Sort transactions by date (descending) and then by ID (descending)
  const transactions = useMemo(() => {
    if (!txItems) return [];
    return [...txItems].sort((a, b) => {
      try {
        const timeB = b.date ? parseISO(b.date).getTime() : 0;
        const timeA = a.date ? parseISO(a.date).getTime() : 0;
        return timeB - timeA || b.id.localeCompare(a.id);
      } catch (e) {
        return b.id.localeCompare(a.id);
      }
    });
  }, [txItems]);

  // Dynamic balance calculations for all wallets
  const wallets = useMemo(() => {
    return accounts.map(w => {
      let balance = Number(w.initialBalance) || 0;
      transactions.forEach(tx => {
        const amt = Number(tx.amount) || 0;
        if (tx.type === 'in' && tx.walletId === w.id) {
          balance += amt;
        } else if (tx.type === 'out' && tx.walletId === w.id) {
          balance -= amt;
        } else if (tx.type === 'transfer') {
          if (tx.fromWalletId === w.id) balance -= amt;
          if (tx.toWalletId === w.id) balance += amt;
        }
      });
      return { ...w, balance };
    });
  }, [accounts, transactions]);

  // Account CRUD operations
  const addWallet = async (wallet) => {
    await saveAccounts((current) => {
      const baseAccounts = current.length === 0 ? [defaultAccount] : current;
      return [...baseAccounts, wallet];
    });
  };

  const editWallet = async (id, updated) => {
    await saveAccounts((current) => {
      const baseAccounts = current.length === 0 ? [defaultAccount] : current;
      return baseAccounts.map(w => w.id === id ? { ...w, ...updated } : w);
    });
  };

  const deleteWallet = async (id) => {
    await saveAccounts((current) => {
      const baseAccounts = current.length === 0 ? [defaultAccount] : current;
      return baseAccounts.filter(w => w.id !== id);
    });
    await saveTransactions((current) =>
      current.filter(tx => tx.walletId !== id && tx.fromWalletId !== id && tx.toWalletId !== id)
    );
  };

  // Transaction CRUD operations
  const addTransaction = async (tx) => {
    await saveTransactions((current) => [tx, ...current]);
  };

  const editTransaction = async (id, updated) => {
    await saveTransactions((current) => current.map(tx => tx.id === id ? { ...tx, ...updated } : tx));
  };

  const deleteTransaction = async (id) => {
    if (!id) {
      throw new Error('Missing transaction id');
    }
    await saveTransactions((current) => {
      const exists = current.some(tx => tx.id === id);
      if (!exists) {
        throw new Error('Transaction not found');
      }
      return current.filter(tx => tx.id !== id);
    });
  };

  const refresh = async () => {
    await Promise.all([refreshTransactions(), refreshAccounts()]);
  };

  const loading = txLoading || acLoading;

  return {
    wallets,
    transactions,
    loading,
    refresh,
    addWallet,
    editWallet,
    deleteWallet,
    addTransaction,
    editTransaction,
    deleteTransaction,
    currency,
    currencies: WALLET_CURRENCIES,
    setCurrency,
    formatMoney,
  };
}
