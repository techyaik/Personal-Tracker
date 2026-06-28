import { useMemo, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { parseISO } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';
import { useStoredList } from './useStoredList';
import { todayKey } from '../utils/dates';
import { fetchGoogleFitData } from '../utils/googleFit';
import { useTheme } from '../theme/ThemeContext';

const KEY = 'health_logs';
const WATCH_CONFIG_KEY = 'wearable_config';

export function useHealth() {
  const { items, loading, saveAll, refresh } = useStoredList(KEY);
  const [watchConfig, setWatchConfig] = useState(null);
  const { dataVersion, triggerDataRefresh } = useTheme();

  const loadWatchConfig = useCallback(async () => {
    try {
      const val = await AsyncStorage.getItem(WATCH_CONFIG_KEY);
      if (val) {
        const parsed = JSON.parse(val);
        setWatchConfig(parsed);

        // Bluetooth auto-reconnection recovery
        if (parsed.connected && parsed.provider === 'bluetooth') {
          const { attemptAutoReconnect } = require('../utils/bluetoothWearable');
          const result = await attemptAutoReconnect();
          const updatedConfig = { ...parsed, status: result ? 'Connected' : 'Disconnected' };
          setWatchConfig(updatedConfig);
          await AsyncStorage.setItem(WATCH_CONFIG_KEY, JSON.stringify(updatedConfig));
        }
      } else {
        setWatchConfig(null);
      }
    } catch (e) {
      console.error('Error loading watch config:', e);
    }
  }, []);

  useEffect(() => {
    loadWatchConfig();
  }, [loadWatchConfig, dataVersion]);

  useFocusEffect(
    useCallback(() => {
      loadWatchConfig();
    }, [loadWatchConfig])
  );

  const logs = useMemo(
    () => [...items].sort((a, b) => parseISO(b.date) - parseISO(a.date) || b.createdAt.localeCompare(a.createdAt)),
    [items]
  );

  const addLog = async (log) => {
    await saveAll((current) => [...current, log]);
    triggerDataRefresh();
  };
  const updateLog = async (id, updates) => {
    await saveAll((current) => current.map((log) => (log.id === id ? { ...log, ...updates } : log)));
    triggerDataRefresh();
  };
  const deleteLog = async (id) => {
    await saveAll((current) => current.filter((log) => log.id !== id));
    triggerDataRefresh();
  };
  const getTodayLog = () => logs.find((log) => log.date === todayKey());
  const getLogsByDate = (date) => logs.filter((log) => log.date === date);

  const connectWatch = async (permissions, provider = 'default', accessToken = null, clientId = null, deviceName = null, deviceId = null, status = null) => {
    const config = {
      connected: true,
      lastSynced: null,
      permissions,
      provider,
      accessToken,
      clientId,
      deviceName,
      deviceId,
      status,
    };
    setWatchConfig(config);
    await AsyncStorage.setItem(WATCH_CONFIG_KEY, JSON.stringify(config));
  };

  const updateWatchConfig = async (updates) => {
    if (!watchConfig) return;
    const config = { ...watchConfig, ...updates };
    setWatchConfig(config);
    await AsyncStorage.setItem(WATCH_CONFIG_KEY, JSON.stringify(config));
  };

  const disconnectWatch = async () => {
    try {
      const { disconnectActiveGattDevice } = require('../utils/bluetoothWearable');
      disconnectActiveGattDevice();
    } catch (e) {
      console.warn('Error disconnecting GATT device:', e);
    }
    setWatchConfig(null);
    await AsyncStorage.removeItem(WATCH_CONFIG_KEY);
  };

  const syncWatch = async (devMode = false) => {
    if (!watchConfig || !watchConfig.connected) return;

    let syncedMetrics = null;

    if (watchConfig.provider === 'google_fit' && watchConfig.accessToken) {
      try {
        syncedMetrics = await fetchGoogleFitData(watchConfig.accessToken, watchConfig.permissions);
      } catch (err) {
        console.warn('Error fetching Google Fit data, falling back:', err);
      }
    } else if (watchConfig.provider === 'bluetooth') {
      try {
        const { fetchBluetoothDeviceData } = require('../utils/bluetoothWearable');
        syncedMetrics = fetchBluetoothDeviceData(watchConfig.deviceName || 'Smartwatch', watchConfig.permissions, devMode);
      } catch (err) {
        throw err;
      }
    }

    if (!syncedMetrics) {
      if (!devMode) {
        throw new Error('Wearable integration sync failed: No active health indicators were readable.');
      }

      // Simulated/Mock Fallback data (strictly for developer testing)
      syncedMetrics = {
        steps: watchConfig.permissions.steps ? 8430 : null,
        distance: watchConfig.permissions.distance ? 5.8 : null,
        activeMinutes: watchConfig.permissions.activeMinutes ? 38 : null,
        calories: watchConfig.permissions.calories ? 290 : null,
        heartRate: watchConfig.permissions.heartRate ? 72 : null,
        sleep: watchConfig.permissions.sleep ? 7.4 : null,
        bloodOxygen: watchConfig.permissions.bloodOxygen ? 98 : null,
        workout: watchConfig.permissions.workout ? 'Morning Walk' : null,
      };
    }

    const todayDate = todayKey();
    const existingToday = items.find((log) => log.date === todayDate);

    let updatedLogs;
    if (existingToday) {
      updatedLogs = items.map((log) =>
        log.date === todayDate
          ? { ...log, watchData: syncedMetrics }
          : log
      );
    } else {
      updatedLogs = [
        ...items,
        {
          id: Date.now().toString(),
          date: todayDate,
          createdAt: new Date().toISOString(),
          watchData: syncedMetrics,
        },
      ];
    }

    await saveAll(updatedLogs);

    const updatedConfig = {
      ...watchConfig,
      lastSynced: new Date().toISOString(),
    };
    setWatchConfig(updatedConfig);
    await AsyncStorage.setItem(WATCH_CONFIG_KEY, JSON.stringify(updatedConfig));
  };

  return {
    logs,
    loading,
    refresh,
    addLog,
    updateLog,
    deleteLog,
    getTodayLog,
    getLogsByDate,
    watchConfig,
    connectWatch,
    updateWatchConfig,
    disconnectWatch,
    syncWatch,
  };
}
