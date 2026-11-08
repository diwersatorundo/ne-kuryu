import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { colors, radius } from '../constants/theme';
import { parseNumberInput } from '../utils/format';
import { AppText } from './AppText';
import { TextField } from './TextField';

interface NumberFieldProps {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  unit?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
}

function formatInputValue(value: number): string {
  return String(value).replace('.', ',');
}

function normalizeInput(raw: string): string {
  const replaced = raw.replace(/[^\d.,]/g, '').replace(/\./g, ',');
  const parts = replaced.split(',');
  const integer = parts[0].slice(0, 9);
  const fraction = parts.slice(1).join('').slice(0, 3);
  return parts.length > 1 ? `${integer},${fraction}` : integer;
}

export function NumberField({
  label,
  value,
  onChange,
  unit,
  placeholder,
  hint,
  error,
  optional = false,
}: NumberFieldProps) {
  const [text, setText] = useState(
    value === undefined ? '' : formatInputValue(value),
  );
  const lastValue = useRef<number | undefined>(value);

  useEffect(() => {
    if (value !== lastValue.current) {
      lastValue.current = value;
      setText(value === undefined ? '' : formatInputValue(value));
    }
  }, [value]);

  const handleChange = (raw: string) => {
    const normalized = normalizeInput(raw);
    setText(normalized);
    const parsed = parseNumberInput(normalized);
    lastValue.current = parsed;
    onChange(parsed);
  };

  const clear = () => {
    setText('');
    lastValue.current = undefined;
    onChange(undefined);
  };

  const unknown = optional && value === undefined;

  return (
    <TextField
      label={label}
      value={text}
      onChangeText={handleChange}
      placeholder={placeholder}
      keyboardType="decimal-pad"
      inputMode="decimal"
      maxLength={14}
      suffix={unit}
      hint={hint}
      error={error}
      labelAccessory={
        optional ? (
          <Pressable
            accessibilityRole="button"
            onPress={clear}
            style={({ pressed }) => [
              styles.unknownChip,
              unknown && styles.unknownChipActive,
              pressed && styles.unknownChipPressed,
            ]}
          >
            <AppText
              variant="caption"
              color={unknown ? colors.accent : colors.textMuted}
            >
              Не знаю
            </AppText>
          </Pressable>
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  unknownChip: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
  },
  unknownChipActive: {
    backgroundColor: colors.accentSoft,
  },
  unknownChipPressed: {
    opacity: 0.7,
  },
});
