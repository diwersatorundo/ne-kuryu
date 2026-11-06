import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AccessibilityInfo } from 'react-native';

export type VisualMode = 'beautiful' | 'performance';

const PREFERENCES_STORAGE_KEY = 'nekuryu.preferences.v1';

interface StoredPreferences {
  schemaVersion: 1;
  visualMode: VisualMode;
}

interface PreferencesValue {
  mode: VisualMode;
  setMode: (mode: VisualMode) => void;
  reducedMotion: boolean;
  motionEnabled: boolean;
  ready: boolean;
}

const PreferencesContext = createContext<PreferencesValue | null>(null);

function isVisualMode(value: unknown): value is VisualMode {
  return value === 'beautiful' || value === 'performance';
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<VisualMode>('beautiful');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    AsyncStorage.getItem(PREFERENCES_STORAGE_KEY)
      .then((serialized) => {
        if (!active || !serialized) {
          return;
        }
        const parsed = JSON.parse(serialized) as Partial<StoredPreferences>;
        if (isVisualMode(parsed.visualMode)) {
          setModeState(parsed.visualMode);
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) {
          setReady(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (active) {
          setReducedMotion(enabled);
        }
      })
      .catch(() => undefined);

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReducedMotion,
    );

    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  const setMode = useCallback((next: VisualMode) => {
    setModeState(next);
    const payload: StoredPreferences = {
      schemaVersion: 1,
      visualMode: next,
    };
    void AsyncStorage.setItem(
      PREFERENCES_STORAGE_KEY,
      JSON.stringify(payload),
    ).catch(() => undefined);
  }, []);

  const value = useMemo<PreferencesValue>(
    () => ({
      mode,
      setMode,
      reducedMotion,
      motionEnabled: mode === 'beautiful' && !reducedMotion,
      ready,
    }),
    [mode, setMode, reducedMotion, ready],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesValue {
  const value = useContext(PreferencesContext);
  if (!value) {
    throw new Error('usePreferences must be used inside PreferencesProvider');
  }
  return value;
}
