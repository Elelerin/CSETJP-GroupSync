import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Card, Text } from "react-native-paper";

export default function Settings() {
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text variant="headlineLarge" style={styles.title}>
        Settings
      </Text>

      {/* Buttons */}
      <Card mode="outlined" style={styles.card}>
        <Button
          mode="contained"
          buttonColor="#8B5CF6" // Purple color
          textColor="white"
          onPress={() => console.log("Change Password")}
        >
          Change Password
        </Button>
      </Card>

      <Card mode="outlined" style={styles.card}>
        <Button
          mode="contained"
          buttonColor="#8B5CF6"
          textColor="white"
          onPress={() => console.log("Preferences")}
        >
          Preferences
        </Button>
      </Card>

      <Card mode="outlined" style={styles.card}>
        <Button
          mode="contained"
          buttonColor="#8B5CF6"
          textColor="white"
          onPress={() => console.log("Logout")}
        >
          Logout
        </Button>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black", // Match dark theme
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    color: "white",
    marginBottom: 20,
  },
  card: {
    width: "80%",
    marginBottom: 10,
    backgroundColor: "black",
    borderColor: "#8B5CF6", // Purple border
    borderWidth: 1,
  },
});
