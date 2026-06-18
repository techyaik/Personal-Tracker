import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getData, setData } from '../storage/storage';

const memoryCache = {};

export function useStoredList(key) {
  const hydratedRef = useRef(Object.prototype.hasOwnProperty.call(memoryCache, key));
  const mountedRef = useRef(true);
  const [items, setItems] = useState(() => memoryCache[key] || []);
  const [loading, setLoading] = useState(!hydratedRef.current);

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
