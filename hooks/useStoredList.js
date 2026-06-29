import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getData, setData } from '../storage/storage';
import { useTheme } from '../theme/ThemeContext';

const memoryCache = {};

export function clearMemoryCache() {
  for (const k in memoryCache) {
    delete memoryCache[k];
  }
}

export function useStoredList(key) {
  const hydratedRef = useRef(Object.prototype.hasOwnProperty.call(memoryCache, key));
  const mountedRef = useRef(true);
  const savingRef = useRef(false);
  const [items, setItems] = useState(() => memoryCache[key] || []);
  const [loading, setLoading] = useState(!hydratedRef.current);
  
  const themeContext = useTheme();
  const dataVersion = themeContext?.dataVersion ?? 0;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const refresh = useCallback(async (options = {}) => {
    // Don't refresh while a save is in progress — prevents stale-read race condition
    if (savingRef.current) return;

    if (options.useCache && memoryCache[key] !== undefined) {
      const data = memoryCache[key];
      hydratedRef.current = true;
      if (mountedRef.current) setItems(data);
      return data;
    }

    const silent = options.silent ?? hydratedRef.current;
    if (!silent) setLoading(true);
    const data = await getData(key);
    memoryCache[key] = data;
    hydratedRef.current = true;
    if (!mountedRef.current) return data;
    setItems(data);
    setLoading(false);
    return data;
  }, [key]);

  useEffect(() => {
    if (dataVersion > 0) {
      refresh({ silent: true, useCache: true });
    }
  }, [dataVersion, refresh]);

  useFocusEffect(
    useCallback(() => {
      if (hydratedRef.current && memoryCache[key] !== undefined) {
        setItems(memoryCache[key]);
        return;
      }
      refresh({ silent: hydratedRef.current });
    }, [refresh, key])
  );

  const saveAll = useCallback(async (updater) => {
    savingRef.current = true;
    try {
      let current = memoryCache[key];
      if (current === undefined) {
        current = await getData(key);
      }
      
      let next;
      if (typeof updater === 'function') {
        next = updater(current);
      } else {
        next = updater;
      }
      
      memoryCache[key] = next;
      hydratedRef.current = true;
      if (mountedRef.current) setItems(next);
      await setData(key, next);
    } finally {
      savingRef.current = false;
    }
  }, [key]);

  return { items, loading, refresh, saveAll };
}
