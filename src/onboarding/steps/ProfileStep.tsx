import { ShieldCheck, Zap } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { CURRENCIES } from '../../constants/currencies';
import { colors, radius, spacing } from '../../constants/theme';
import { ProfileDraft } from '../../types/profile';
import { DateTimeField } from '../../components/DateTimeField';
import { ChoiceChip } from '../../components/ChoiceChip';
import { Button } from '../../components/Button';
import { AppText } from '../../components/AppText';
import { TextField } from '../../components/TextField';
import { FieldErrors } from '../validation';

interface ProfileStepProps {
  draft: ProfileDraft;
  errors: FieldErrors;
  onChange: (patch: Partial<ProfileDraft>) => void;
}

export function ProfileStep({ draft, errors, onChange }: ProfileStepProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.intro}>
        <AppText variant="h1">Начнём с главного</AppText>
        <AppText variant="body" color={colors.textSecondary}>
          Эти данные нужны только для расчёта прогресса. Всё хранится на
          устройстве.
        </AppText>
      </View>

      <TextField
        label="Как вас зовут?"
        hint="Необязательно. Можно оставить пустым."
        placeholder="Имя"
        value={draft.name}
        onChangeText={(name) => onChange({ name })}
        autoCapitalize="words"
        autoCorrect={false}
        maxLength={60}
        returnKeyType="done"
        error={errors.name}
      />

      <View style={styles.section}>
        <DateTimeField
          label="Когда вы бросили или планируете бросить?"
          value={draft.quitAt}
          onChange={(quitAt) => onChange({ quitAt })}
          error={errors.quitAt}
        />
        <Button
          label="Я бросаю прямо сейчас"
          variant="secondary"
          size="md"
          icon={<Zap size={16} color={colors.accent} />}
          onPress={() => onChange({ quitAt: new Date() })}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.labelRow}>
          <AppText variant="label" color={colors.textSecondary}>
            ВАЛЮТА
          </AppText>
          <AppText variant="small" color={colors.textMuted}>
            Для расчёта экономии
          </AppText>
        </View>
        <View style={styles.chips}>
          {CURRENCIES.map((currency) => (
            <ChoiceChip
              key={currency.code}
              label={`${currency.symbol} ${currency.code}`}
              selected={draft.currency === currency.code}
              onPress={() => onChange({ currency: currency.code })}
            />
          ))}
        </View>
      </View>

      <View style={styles.note}>
        <ShieldCheck size={16} color={colors.accent} />
        <AppText variant="small" color={colors.textMuted} style={styles.noteText}>
          Без аккаунта, рекламы и передачи данных. Только ваше устройство.
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.lg,
    paddingTop: 8,
  },
  intro: {
    gap: 8,
    marginBottom: 2,
  },
  section: {
    gap: 10,
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 24,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  note: {
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 9,
    padding: 11,
  },
  noteText: {
    flex: 1,
  },
});
