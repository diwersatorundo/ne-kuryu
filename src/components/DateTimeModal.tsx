import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';
import {
  addMonths,
  daysInMonth,
  formatDate,
  getMonthMatrix,
  isSameDay,
  monthTitle,
  pad2,
  WEEKDAYS_SHORT,
} from '../utils/date';
import { AppModal } from './AppModal';
import { AppText } from './AppText';
import { Button } from './Button';

interface DateTimeModalProps {
  visible: boolean;
  value: Date;
  onClose: () => void;
  onApply: (date: Date) => void;
}

export function DateTimeModal({
  visible,
  value,
  onClose,
  onApply,
}: DateTimeModalProps) {
  const [draft, setDraft] = useState(value);
  const [viewYear, setViewYear] = useState(value.getFullYear());
  const [viewMonth, setViewMonth] = useState(value.getMonth());
  const [hourText, setHourText] = useState(pad2(value.getHours()));
  const [minuteText, setMinuteText] = useState(pad2(value.getMinutes()));
  const [yearPickerOpen, setYearPickerOpen] = useState(false);
  const [yearRangeStart, setYearRangeStart] = useState(value.getFullYear() - 5);
  const [error, setError] = useState<string | null>(null);

  const resetFromValue = () => {
    const next = new Date(value);
    setDraft(next);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
    setHourText(pad2(next.getHours()));
    setMinuteText(pad2(next.getMinutes()));
    setYearPickerOpen(false);
    setYearRangeStart(next.getFullYear() - 5);
    setError(null);
  };

  const matrix = useMemo(
    () => getMonthMatrix(viewYear, viewMonth),
    [viewYear, viewMonth],
  );
  const today = new Date();

  const changeMonth = (delta: number) => {
    const target = addMonths(viewYear, viewMonth, delta);
    const day = Math.min(
      draft.getDate(),
      daysInMonth(target.year, target.month),
    );
    const next = new Date(draft);
    next.setFullYear(target.year, target.month, day);
    setDraft(next);
    setViewYear(target.year);
    setViewMonth(target.month);
  };

  const changeYear = (year: number) => {
    const day = Math.min(draft.getDate(), daysInMonth(year, viewMonth));
    const next = new Date(draft);
    next.setFullYear(year, viewMonth, day);
    setDraft(next);
    setViewYear(year);
    setYearPickerOpen(false);
  };

  const pickDay = (day: number) => {
    const next = new Date(draft);
    next.setFullYear(viewYear, viewMonth, day);
    setDraft(next);
  };

  const setNow = () => {
    const now = new Date();
    setDraft(now);
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setHourText(pad2(now.getHours()));
    setMinuteText(pad2(now.getMinutes()));
    setError(null);
  };

  const apply = () => {
    const hours = Number(hourText);
    const minutes = Number(minuteText);
    if (
      hourText.trim() === '' ||
      minuteText.trim() === '' ||
      !Number.isInteger(hours) ||
      !Number.isInteger(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      setError('Время должно быть в формате ЧЧ:ММ');
      return;
    }
    const result = new Date(draft);
    result.setHours(hours, minutes, 0, 0);
    onApply(result);
  };

  const yearCells = Array.from({ length: 12 }, (_, index) => yearRangeStart + index);

  return (
    <AppModal
      visible={visible}
      onShow={resetFromValue}
      onClose={onClose}
      title="Дата и время отказа"
      subtitle="Можно выбрать прошлую или будущую дату"
      footer={
        <View style={styles.footerRow}>
          <Button
            label="Отмена"
            variant="secondary"
            onPress={onClose}
            style={styles.footerButton}
          />
          <Button
            label="Готово"
            onPress={apply}
            style={styles.footerButton}
          />
        </View>
      }
    >
      <View style={styles.preview}>
        <Calendar size={16} color={colors.accent} />
        <AppText variant="bodyMedium" style={styles.previewText}>
          {formatDate(draft)},{' '}
          {hourText ? pad2(Number(hourText)) : '--'}:{minuteText ? pad2(Number(minuteText)) : '--'}
        </AppText>
        <Pressable
          accessibilityRole="button"
          onPress={setNow}
          style={({ pressed }) => [
            styles.nowButton,
            pressed && styles.pressed,
          ]}
        >
          <AppText variant="caption" color={colors.accent}>
            Сейчас
          </AppText>
        </Pressable>
      </View>

      <View style={styles.calendarHeader}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Предыдущий месяц"
          onPress={() => changeMonth(-1)}
          style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}
        >
          <ChevronLeft size={18} color={colors.textSecondary} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setYearRangeStart(viewYear - 5);
            setYearPickerOpen((open) => !open);
          }}
          style={({ pressed }) => [styles.monthTitle, pressed && styles.pressed]}
        >
          <AppText variant="h3">{monthTitle(viewYear, viewMonth)}</AppText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Следующий месяц"
          onPress={() => changeMonth(1)}
          style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}
        >
          <ChevronRight size={18} color={colors.textSecondary} />
        </Pressable>
      </View>

      {yearPickerOpen ? (
        <View style={styles.yearPicker}>
          <View style={styles.yearRangeHeader}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setYearRangeStart((start) => start - 12)}
              style={({ pressed }) => [
                styles.navButton,
                pressed && styles.pressed,
              ]}
            >
              <ChevronLeft size={18} color={colors.textSecondary} />
            </Pressable>
            <AppText variant="small" color={colors.textMuted}>
              {yearCells[0]}–{yearCells[yearCells.length - 1]}
            </AppText>
            <Pressable
              accessibilityRole="button"
              onPress={() => setYearRangeStart((start) => start + 12)}
              style={({ pressed }) => [
                styles.navButton,
                pressed && styles.pressed,
              ]}
            >
              <ChevronRight size={18} color={colors.textSecondary} />
            </Pressable>
          </View>
          {[0, 1, 2].map((row) => (
            <View key={row} style={styles.yearRow}>
              {yearCells.slice(row * 4, row * 4 + 4).map((year) => (
                <Pressable
                  key={year}
                  accessibilityRole="button"
                  onPress={() => changeYear(year)}
                  style={({ pressed }) => [
                    styles.yearCell,
                    year === viewYear && styles.yearCellSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  <AppText
                    variant="bodyMedium"
                    color={year === viewYear ? colors.accent : colors.textSecondary}
                  >
                    {year}
                  </AppText>
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      ) : (
        <>
          <View style={styles.weekRow}>
            {WEEKDAYS_SHORT.map((day) => (
              <View key={day} style={styles.weekCell}>
                <AppText variant="caption" color={colors.textMuted}>
                  {day}
                </AppText>
              </View>
            ))}
          </View>
          <View style={styles.daysWrap}>
            {matrix.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.dayRow}>
                {row.map((day, columnIndex) => {
                  if (!day) {
                    return <View key={`empty-${columnIndex}`} style={styles.dayCell} />;
                  }
                  const selected = isSameDay(day, draft);
                  const isToday = isSameDay(day, today);
                  return (
                    <Pressable
                      key={day.getTime()}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      onPress={() => pickDay(day.getDate())}
                      style={({ pressed }) => [
                        styles.dayCell,
                        isToday && styles.dayCellToday,
                        selected && styles.dayCellSelected,
                        pressed && styles.pressed,
                      ]}
                    >
                      <AppText
                        variant="small"
                        color={
                          selected
                            ? colors.accentInk
                            : isToday
                              ? colors.accent
                              : colors.textSecondary
                        }
                        style={selected ? styles.selectedDayText : undefined}
                      >
                        {day.getDate()}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>
        </>
      )}

      <View style={styles.timeBlock}>
        <View style={styles.timeLabelRow}>
          <Clock size={15} color={colors.textMuted} />
          <AppText variant="label" color={colors.textSecondary}>
            ВРЕМЯ
          </AppText>
        </View>
        <View style={styles.timeRow}>
          <TextInput
            value={hourText}
            onChangeText={(text) => {
              setHourText(text.replace(/\D/g, '').slice(0, 2));
              setError(null);
            }}
            keyboardType="number-pad"
            maxLength={2}
            placeholder="ЧЧ"
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.accent}
            style={[styles.timeInput, typography.h3]}
          />
          <AppText variant="h3" color={colors.textMuted}>
            :
          </AppText>
          <TextInput
            value={minuteText}
            onChangeText={(text) => {
              setMinuteText(text.replace(/\D/g, '').slice(0, 2));
              setError(null);
            }}
            keyboardType="number-pad"
            maxLength={2}
            placeholder="ММ"
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.accent}
            style={[styles.timeInput, typography.h3]}
          />
          <AppText variant="small" color={colors.textMuted} style={styles.timeHint}>
            Местное время
          </AppText>
        </View>
        {error ? (
          <AppText variant="small" color={colors.danger}>
            {error}
          </AppText>
        ) : null}
      </View>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  preview: {
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: 10,
    marginBottom: spacing.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  previewText: {
    flex: 1,
  },
  nowButton: {
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pressed: {
    opacity: 0.65,
  },
  calendarHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  monthTitle: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: 12,
  },
  navButton: {
    alignItems: 'center',
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  weekRow: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 4,
  },
  weekCell: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 4,
  },
  daysWrap: {
    gap: 2,
  },
  dayRow: {
    flexDirection: 'row',
    gap: 2,
  },
  dayCell: {
    alignItems: 'center',
    aspectRatio: 1,
    borderRadius: radius.sm,
    flex: 1,
    justifyContent: 'center',
  },
  dayCellToday: {
    backgroundColor: colors.accentSoft,
  },
  dayCellSelected: {
    backgroundColor: colors.accent,
  },
  selectedDayText: {
    fontWeight: '700',
  },
  yearPicker: {
    gap: 6,
    paddingVertical: 4,
  },
  yearRangeHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  yearRow: {
    flexDirection: 'row',
    gap: 6,
  },
  yearCell: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    flex: 1,
    justifyContent: 'center',
    minHeight: 42,
  },
  yearCellSelected: {
    backgroundColor: colors.accentSoft,
  },
  timeBlock: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    gap: 8,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  timeLabelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  timeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  timeInput: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.md,
    color: colors.text,
    height: 46,
    minWidth: 64,
    paddingHorizontal: 12,
    textAlign: 'center',
  },
  timeHint: {
    flex: 1,
    textAlign: 'right',
  },
  footerRow: {
    flexDirection: 'row',
    gap: 8,
  },
  footerButton: {
    flex: 1,
  },
});
