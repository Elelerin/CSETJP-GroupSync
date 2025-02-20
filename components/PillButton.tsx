import { View, Pressable, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useThemeColor } from '@/hooks/useThemeColor';

type Props = {
  onPress: () => any,
  icon: keyof typeof FontAwesome.glyphMap,
};

export default function PillButton({ onPress, icon }: Props) {
  return (
    <View style={styles.pillButtonContainer}>
      <Pressable style={styles.pillButton} onPress={onPress}>
        <FontAwesome name={icon} size={24} color={useThemeColor("textPrimary")} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pillButtonContainer: {
    height: 42,
    width: '100%',
    marginVertical: 10,
  },
  pillButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: useThemeColor("highlight"),
  },
});