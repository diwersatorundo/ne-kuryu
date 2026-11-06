import { ReactNode, useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { colors, radius, typography } from '../constants/theme';
import { AppText } from './AppText';

interface TextFieldProps extends TextInputProps {
  label?: string;
  hint?: string;
  error?: string;
  suffix?: string;
  labelAccessory?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export function TextField({
  label,
  hint,
  error,
  suffix,
  labelAccessory,
  containerStyle,
  style,
  multiline,
  onFocus,
  onBlur,
  ...props
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {(label || labelAccessory) && (
        <View style={styles.labelRow}>
          {label ? (
            <AppText
              variant="label"
              color={colors.textSecondary}
              style={styles.labelText}
            >
              {label}
            </AppText>
          ) : (
            <View />
          )}
          {labelAccessory}
        </View>
      )}
      <View
        style={[
          styles.inputWrap,
          multiline && styles.multilineWrap,
          focused && styles.inputWrapFocused,
          Boolean(error) && styles.inputWrapError,
        ]}
      >
        <TextInput
          {...props}
          multiline={multiline}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.accent}
          keyboardAppearance="dark"
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          style={[
            styles.input,
            multiline && styles.multilineInput,
            typography.body,
            style,
          ]}
        />
        {suffix ? (
          <AppText variant="small" color={colors.textMuted} style={styles.suffix}>
            {suffix}
          </AppText>
        ) : null}
      </View>
      {error ? (
        <AppText variant="small" color={colors.danger} style={styles.message}>
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="small" color={colors.textMuted} style={styles.message}>
          {hint}
        </AppText>
      ) : null}
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
  labelText: {
    flexShrink: 1,
  },
  inputWrap: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    flexDirection: 'row',
    minHeight: 52,
    paddingHorizontal: 14,
  },
  inputWrapFocused: {
    backgroundColor: colors.surfaceRaised,
    elevation: 6,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
  },
  inputWrapError: {
    backgroundColor: colors.dangerSoft,
  },
  multilineWrap: {
    alignItems: 'flex-start',
    minHeight: 100,
    paddingVertical: 12,
  },
  input: {
    color: colors.text,
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  multilineInput: {
    minHeight: 74,
    textAlignVertical: 'top',
  },
  suffix: {
    fontWeight: '600',
    marginLeft: 8,
  },
  message: {
    marginTop: -2,
  },
});
