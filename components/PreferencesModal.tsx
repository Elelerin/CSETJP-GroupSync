import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Modal, Portal, Text, useTheme, Switch } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
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

  // add any new languages here
  const languages = ["English", "Spanish", "French"];

  // States for preferences
  // TODO: initialize these with whatever they're actually set to
  const [selectedTheme, setSelectedTheme] = useState<"light"|"dark">("dark");
  const [selectedLanguage, setSelectedLanguage] = useState<typeof languages[number]>("English");
  const [notifications, setNotifications] = useState(true);

  // dropdown stuff
  // we don't need a variable for whether the menu is visible (the dropdown will handle it on its
  // own), but we do need one with the different options
  const themeMenuData = [
    // the label is what will be displayed on the dropdown
    { label: "Light Theme", value: "light" },
    { label: "Dark Theme",  value: "dark" }
  ];
  const languageMenuData = languages.map(i => { return { label: `Language: ${i}`, value: i }; });

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
        <Dropdown
          style={dropdownStyles.main}
          placeholderStyle={dropdownStyles.placeholder}
          selectedTextStyle={dropdownStyles.selectedText}
          containerStyle={dropdownStyles.container}
          itemTextStyle={dropdownStyles.itemText}
          activeColor="transparent"
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Color Theme"
          data={themeMenuData}
          value={selectedTheme}
          onChange={item => {
            setSelectedTheme(item.value);
          }}
        />

        {/* Language Selection */}
        <Dropdown
          style={dropdownStyles.main}
          placeholderStyle={dropdownStyles.placeholder}
          selectedTextStyle={dropdownStyles.selectedText}
          containerStyle={dropdownStyles.container}
          itemTextStyle={dropdownStyles.itemText}
          activeColor="transparent"
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Language"
          data={languageMenuData}
          value={selectedLanguage}
          onChange={item => {
            setSelectedLanguage(item.value);
          }}
        />

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

const dropdownStyles = StyleSheet.create({
  main: {
    marginHorizontal: 12,
    marginTop: 14,
    marginBottom: 18,
    height: 50,
    borderBottomColor: useThemeColor("highlight"),
    borderBottomWidth: 2,
    minWidth: 175
  },
  icon: {
    marginRight: 5,
  },
  placeholder: {
    color: useThemeColor("textSecondary"),
    fontSize: 20,
  },
  selectedText: {
    color: useThemeColor("textPrimary"),
    fontSize: 20,
  },
  itemText: {
    color: useThemeColor("textPrimary"),
    fontSize: 18,
  },
  container: {
    backgroundColor: useThemeColor("backgroundSecondary"),
    borderRadius: 10,
    borderColor: useThemeColor("highlight"),
    borderWidth: 2,
  },
});

