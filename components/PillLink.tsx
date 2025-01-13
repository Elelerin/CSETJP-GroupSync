import { View, Pressable, StyleSheet } from 'react-native';
import { Href, Link } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useThemeColor } from '@/hooks/useThemeColor';

type Props = {
  href: Href,
  icon: keyof typeof MaterialIcons.glyphMap,
};

export default function PillLink({ href, icon }: Props) {
  return (
    <View style={styles.pillLinkContainer}>
      <Link href={ href } asChild>
        <Pressable style={styles.pillLink}>
          <MaterialIcons name={icon} size={24} color={useThemeColor("textPrimary")} />
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  pillLinkContainer: {
    height: 42,
    width: '100%',
    marginVertical: 10,
  },
  pillLink: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: useThemeColor("highlight"),
  },
});