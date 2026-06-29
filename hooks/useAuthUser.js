import { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import AsyncStorage from '../storage/safeAsyncStorage';
import { getFirebaseAuth } from '../services/firebaseAuth';

const getInitials = (value) => {
  const source = String(value || 'User').trim();
  const parts = source.includes('@') ? [source[0]] : source.split(/\s+/);
  return parts
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U';
};

export function useAuthUser() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [localName, setLocalName] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('lifio_profile_name').then((val) => {
      if (val) setLocalName(val);
    });
  }, []);

  useEffect(() => {
    let unsubscribe = null;
    try {
      const auth = getFirebaseAuth();
      setUser(auth.currentUser || null);
      unsubscribe = onAuthStateChanged(auth, (nextUser) => {
        setUser(nextUser || null);
        setReady(true);
        if (nextUser?.displayName) {
          setLocalName(nextUser.displayName);
        } else if (nextUser?.email) {
          // If no display name but email exists, keep local name or email
          AsyncStorage.getItem('lifio_profile_name').then((val) => {
            if (!val) setLocalName(nextUser.email);
          });
        }
      });
    } catch (error) {
      setReady(true);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const updateProfileName = async (newName) => {
    const trimmed = String(newName || '').trim();
    setLocalName(trimmed);
    await AsyncStorage.setItem('lifio_profile_name', trimmed);
    try {
      const auth = getFirebaseAuth();
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: trimmed });
      }
    } catch (err) {
      console.error('Error updating Firebase display name:', err);
    }
  };

  return useMemo(() => {
    const name = localName || user?.displayName || user?.email || 'User';
    const email = user?.email || '';
    return {
      user,
      ready,
      name,
      email,
      initials: getInitials(name),
      updateProfileName,
    };
  }, [ready, user, localName]);
}
