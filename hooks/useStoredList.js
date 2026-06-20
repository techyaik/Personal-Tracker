import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getData, setData } from '../storage/storage';
import { useTheme } from '../theme/ThemeContext';

const memoryCache = {};

export function clearMemoryCache() {
  console.log('[useStoredList] clearMemoryCache called');
  for (const k in memoryCache) {
    console.log('[useStoredList] deleting cache key:', k);
    delete memoryCache[k];
  }
}

export function useStoredList(key) {
  const hydratedRef = useRef(Object.prototype.hasOwnProperty.call(memoryCache, key));
  const mountedRef = useRef(true);
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
    console.log('[useStoredList] dataVersion changed:', dataVersion, 'for key:', key);
    if (dataVersion > 0) {
      console.log('[useStoredList] clearing cache and refreshing for key:', key);
      delete memoryCache[key];
      refresh({ silent: true });
    }
  }, [dataVersion, refresh, key]);

  useFocusEffect(
    useCallback(() => {
      refresh({ silent: hydratedRef.current });
    }, [refresh])
  );

  const saveAll = async (next) => {
    memoryCache[key] = next;
    hydratedRef.current = true;
    if (mountedRef.current) setItems(next);
    await setData(key, next);
  };

  return { items, loading, refresh, saveAll };
}
