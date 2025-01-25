import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function GroupHome() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Details for group {id}.</Text>
    </View>
  );
}