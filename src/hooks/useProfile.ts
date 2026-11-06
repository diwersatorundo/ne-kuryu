import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Profile } from '../types/profile';
import {
  clearProfile,
  loadProfile,
  saveProfile,
} from '../storage/profileStorage';

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    loadProfile()
      .then((stored) => {
        if (active) {
          setProfile(stored);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const persist = useCallback(async (next: Profile) => {
    setProfile(next);
    try {
      await saveProfile(next);
    } catch {
      Alert.alert(
        'Не удалось сохранить',
        'Данные останутся в приложении до перезапуска. Попробуйте изменить профиль ещё раз.',
      );
    }
  }, []);

  const reset = useCallback(async () => {
    await clearProfile();
    setProfile(null);
  }, []);

  return { profile, loading, persist, reset };
}
