import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Button,
  Modal,
  Portal,
  Text,
  useTheme,
  Switch,
  Menu,
} from "react-native-paper";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ChangePreferencesProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function ChangePreferencesModal({
  visible, // ✅ Fixed prop casing
  onDismiss,
}: ChangePreferencesProps) {
  const theme = useTheme(); // ✅ Get current theme
  const backgroundColor = useThemeColor("backgroundSecondary");

  // States for preferences
  const [selectedTheme, setSelectedTheme] = useState("dark");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [notifications, setNotifications] = useState(true);

  // Dropdown menu state
  const [themeMenuVisible, setThemeMenuVisible] = useState(false);
  const [languageMenuVisible, setLanguageMenuVisible] = useState(false);

  const handlePreferencesChange = () => {
    console.log("Preferences changed successfully!");
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible} // ✅ Fixed incorrect casing
        onDismiss={onDismiss}
        contentContainerStyle={[styles.modalContainer, { backgroundColor }]}
      >
        <Text style={styles.title}>Change Preferences</Text>

        {/* Theme Selection */}
        <Menu
          visible={themeMenuVisible}
          onDismiss={() => setThemeMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setThemeMenuVisible(true)}
              style={styles.dropdownButton}
            >
              Theme: {selectedTheme}
            </Button>
          }
        >
          <Menu.Item onPress={() => setSelectedTheme("light")} title="Light" />
          <Menu.Item onPress={() => setSelectedTheme("dark")} title="Dark" />
        </Menu>

        {/* Language Selection */}
        <Menu
          visible={languageMenuVisible}
          onDismiss={() => setLanguageMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setLanguageMenuVisible(true)}
              style={styles.dropdownButton}
            >
              Language: {selectedLanguage}
            </Button>
          }
        >
          <Menu.Item
            onPress={() => setSelectedLanguage("English")}
            title="English"
          />
          <Menu.Item
            onPress={() => setSelectedLanguage("Spanish")}
            title="Spanish"
          />
          <Menu.Item
            onPress={() => setSelectedLanguage("French")}
            title="French"
          />
        </Menu>

        {/* Notifications Toggle */}
        <View style={styles.switchContainer}>
          <Text>Enable Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            color={theme.colors.primary}
          />
        </View>

        {/* Save Button */}
        <Button mode="contained" onPress={handlePreferencesChange}>
          Save
        </Button>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  dropdownButton: {
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
});
