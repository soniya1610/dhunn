
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

type Props = {
  loading?: boolean;
  text?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function StateMessage({
  loading,
  text,
  actionLabel,
  onAction,
}: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.box}>
      {loading ? <ActivityIndicator color={colors.accent} /> : null}

      {text ? (
        <Text style={[styles.text, { color: colors.muted }]}>
          {text}
        </Text>
      ) : null}

      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          style={[styles.btn, { backgroundColor: colors.accent }]}
          accessibilityRole="button"
        >
          <Text style={styles.btnText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    gap: 12,
  },
  text: {
    fontSize: 15,
    textAlign: 'center',
  },
  btn: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 20,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
  },
});
