import React, { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { Button, Modal, Portal, Text, useTheme } from "react-native-paper";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ChangePasswordModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function ChangePasswordModal({
  visible,
  onDismiss,
}: ChangePasswordModalProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const theme = useTheme();
  const backgroundColor = useThemeColor("backgroundSecondary");
  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      console.log("Passwords do not match!");
      return;
    }
    console.log("Password changed successfully!");
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[styles.modalContainer, { backgroundColor }]}
      >
        <Text style={styles.title}>Change Password</Text>

        <TextInput
          placeholder="Old Password"
          secureTextEntry
          style={styles.input}
          value={oldPassword}
          onChangeText={setOldPassword}
        />
        <TextInput
          placeholder="New Password"
          secureTextEntry
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          placeholder="Confirm New Password"
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Button mode="contained" onPress={handlePasswordChange}>
          Submit
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
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: "white", // ✅ Ensures the input field has a white background
    color: "black", // ✅ Ensures text inside input is black for readability
  },
});
