import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ErrorMessageProps {
  text: string
}

export default function ErrorMessage({ text }: ErrorMessageProps) {
  return (
    <View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignContent: "center",
    justifyContent: "center"
  },
  text: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    color: useThemeColor("textPrimary")
  }
});