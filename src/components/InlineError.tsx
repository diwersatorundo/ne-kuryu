import { CircleAlert } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { colors, radius } from '../constants/theme';
import { AppText } from './AppText';

interface InlineErrorProps {
  message: string;
}

export function InlineError({ message }: InlineErrorProps) {
  return (
    <View style={styles.box}>
      <CircleAlert size={15} color={colors.danger} />
      <AppText variant="small" color={colors.danger} style={styles.text}>
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'flex-start',
    backgroundColor: colors.dangerSoft,
    borderColor: colors.dangerBorder,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    padding: 10,
  },
  text: {
    flex: 1,
  },
});
