import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Icon } from "react-native-paper";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ErrorMessageProps {
  /** Text displayed on the error message. */
  text: string,
  /** Whether to display an alert icon next to the text. */
  icon?: boolean,
  /** If true, the message will automatically appear at the center of the page. */
  fullPage?: boolean,
}

/** An onscreen error message. */
export default function ErrorMessage({ text, icon=true, fullPage=false }: ErrorMessageProps) {
  let errorMessage: React.JSX.Element;
  if (icon) {
    errorMessage = (
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <Icon source="alert-circle-outline" color={useThemeColor("highlight")} size={100} />
        </View>
        <Text style={styles.text}>{text}</Text>
      </View>
    );
  }
  else {
    errorMessage = (
      <View style={styles.container}>
        <Text style={styles.text}>{text}</Text>
      </View>
    );
  }

  return (fullPage ? <View style={styles.fullPageContainer}>{errorMessage}</View> : errorMessage);
}

const styles = StyleSheet.create({
  container: {
    alignContent: "center",
    justifyContent: "center",
    flexDirection: "row",
    display: "flex",
    flex: 1
  },
  fullPageContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignContent: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    alignSelf: "center",
    marginRight: 10,
  },
  text: {
    fontSize: 56,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
    color: useThemeColor("textPrimary")
  }
});