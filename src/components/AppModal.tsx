import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';
import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, shadows } from '../constants/theme';
import { AppText } from './AppText';

interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  closeOnBackdrop?: boolean;
  onShow?: () => void;
}

export function AppModal({
  visible,
  onClose,
  title,
  subtitle,
  children,
  footer,
  closeOnBackdrop = true,
  onShow,
}: AppModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onShow={onShow}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.root}
      >
        <Pressable
          style={styles.backdrop}
          onPress={closeOnBackdrop ? onClose : undefined}
        />
        <View
          style={[
            styles.sheet,
            shadows.modal,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0.075)',
              'rgba(255, 255, 255, 0.015)',
            ]}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <View style={styles.handle} />
          {title ? (
            <View style={styles.header}>
              <View style={styles.headerText}>
                <AppText variant="h2">{title}</AppText>
                {subtitle ? (
                  <AppText variant="small" color={colors.textMuted}>
                    {subtitle}
                  </AppText>
                ) : null}
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Закрыть"
                onPress={onClose}
                hitSlop={10}
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && styles.closePressed,
                ]}
              >
                <X size={18} color={colors.textSecondary} />
              </Pressable>
            </View>
          ) : null}
          <ScrollView
            style={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            {children}
          </ScrollView>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    backgroundColor: colors.overlay,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  sheet: {
    alignSelf: 'center',
    backgroundColor: colors.surfaceSolid,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    maxHeight: '92%',
    maxWidth: 560,
    overflow: 'hidden',
    paddingTop: 8,
    width: '100%',
  },
  handle: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: radius.full,
    height: 4,
    marginBottom: 12,
    width: 38,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    paddingBottom: 14,
    paddingHorizontal: 22,
  },
  headerText: {
    flex: 1,
    gap: 3,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  closePressed: {
    backgroundColor: colors.surfaceRaised,
  },
  scroll: {
    flexShrink: 1,
  },
  content: {
    paddingBottom: 8,
    paddingHorizontal: 22,
  },
  footer: {
    gap: 8,
    marginTop: 10,
    paddingHorizontal: 22,
    paddingTop: 14,
  },
});
