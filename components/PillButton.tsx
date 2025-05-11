import { View, Pressable, StyleSheet, Text } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { useThemeColor } from "@/hooks/useThemeColor";

type Props = {
  onPress?: () => any;
  icon?: keyof typeof FontAwesome.glyphMap;
  text?: string;
};

export default function PillButton({ onPress, icon, text }: Props) {
  const textColor = useThemeColor("textPrimary");

  return (
    <View style={styles.pillButtonContainer}>
      <Pressable style={styles.pillButton} onPress={onPress}>
        {icon && <FontAwesome name={icon} size={20} color={textColor} />}
        {text && (
          <Text style={[styles.text, { color: textColor }]}>{text}</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pillButtonContainer: {
    // height: 42,
    // width: "100%",
    marginVertical: 10,
  },
  pillButton: {
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    borderRadius: 5,
  },

  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
