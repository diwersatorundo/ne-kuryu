import { Calendar, Clock, Pencil } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius } from '../constants/theme';
import { useNow } from '../hooks/useNow';
import { formatDateTime } from '../utils/date';
import { AppText } from './AppText';
import { Badge } from './Badge';
import { DateTimeModal } from './DateTimeModal';

interface DateTimeFieldProps {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  error?: string;
}

export function DateTimeField({
  label,
  value,
  onChange,
  error,
}: DateTimeFieldProps) {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const now = useNow(60_000);
  const isFuture = value.getTime() > now.getTime();

  return (
    <View style={styles.wrapper}>
      {label ? (
        <View style={styles.labelRow}>
          <AppText
            variant="label"
            color={colors.textSecondary}
            style={styles.label}
          >
            {label}
          </AppText>
          {isFuture ? <Badge label="Будущая дата" tone="warning" /> : null}
        </View>
      ) : null}
      <Pressable
        accessibilityRole="button"
        onPress={() => setVisible(true)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={({ pressed }) => [
          styles.field,
          focused && styles.fieldFocused,
          Boolean(error) && styles.fieldError,
          pressed && styles.fieldPressed,
        ]}
      >
        <View style={styles.iconGroup}>
          <Calendar size={16} color={colors.textMuted} />
          <Clock size={16} color={colors.textMuted} />
        </View>
        <View style={styles.textBlock}>
          <AppText variant="bodyMedium">{formatDateTime(value)}</AppText>
          <AppText variant="small" color={colors.textMuted}>
            Нажмите, чтобы изменить дату и время
          </AppText>
        </View>
        <Pencil size={15} color={colors.textMuted} />
      </Pressable>
      {error ? (
        <AppText variant="small" color={colors.danger}>
          {error}
        </AppText>
      ) : null}
      <DateTimeModal
        visible={visible}
        value={value}
        onClose={() => setVisible(false)}
        onApply={(date) => {
          onChange(date);
          setVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 7,
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    minHeight: 24,
  },
  label: {
    flexShrink: 1,
  },
  field: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: 10,
    minHeight: 66,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  fieldPressed: {
    backgroundColor: colors.surfaceRaised,
  },
  fieldFocused: {
    backgroundColor: colors.surfaceRaised,
    elevation: 6,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
  },
  fieldError: {
    backgroundColor: colors.dangerSoft,
  },
  iconGroup: {
    flexDirection: 'row',
    gap: 5,
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
});
