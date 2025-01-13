import { View, Pressable, StyleSheet } from 'react-native';
import { Href, Link } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useThemeColor } from '@/hooks/useThemeColor';

type Props = {
  onPress: () => void,
  icon: keyof typeof MaterialIcons.glyphMap,
};

export default function PillLink({ onPress, icon }: Props) {
  return (
    <View style={styles.pillButtonContainer}>
      <Pressable style={styles.pillButton} onPress={onPress}>
        <MaterialIcons name={icon} size={24} color={useThemeColor("textPrimary")} />
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