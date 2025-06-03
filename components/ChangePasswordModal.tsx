import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { Button, Modal, Portal, Text, useTheme } from "react-native-paper";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ChangePasswordModalProps {
  visible: boolean;
  onDismiss: () => void;
}

const passwordRequirements = {
  minLength: 6, // 0 to remove the requirement
  mixedCase: true, // password must contain uppercase and lowercase characters
  containsNumber: true,
  containsSpecialCharacter: true
}

let invalidPasswordMessage = "Password must ";
if (passwordRequirements.minLength > 0) {
  invalidPasswordMessage += `be at least ${passwordRequirements.minLength} characters`
}

let buffer: string[] = [];
if (passwordRequirements.mixedCase) {
  buffer.push("uppercase and lowercase letters");
}
if (passwordRequirements.containsNumber) {
  buffer.push("a number");
}
if (passwordRequirements.containsSpecialCharacter) {
  buffer.push("a special character");
}

if (buffer.length > 0) {
  invalidPasswordMessage += " and contain ";
}
if (buffer.length === 1) {
  invalidPasswordMessage += `${buffer[0]}`;
}
else if (buffer.length === 2) {
  invalidPasswordMessage += `${buffer[0]} and ${buffer[1]}`;
}
else if (buffer.length === 3) {
  invalidPasswordMessage += `${buffer[0]}, ${buffer[1]}, and ${buffer[2]}`;
}

invalidPasswordMessage += ".";

export default function ChangePasswordModal({
  visible,
  onDismiss,
}: ChangePasswordModalProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentErrorMessage, setCurrentErrorMessage] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);

  function validatePassword(): boolean {
    if (newPassword === "") {
      setCurrentErrorMessage("");
      return false;
    }

    let passwordValid = true;
    if (newPassword.length < passwordRequirements.minLength) {
      passwordValid = false;
    }
    if (passwordValid && passwordRequirements.mixedCase) {
      passwordValid = /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword);
    }
    if (passwordValid && passwordRequirements.containsNumber) {
      passwordValid = /\d/.test(newPassword);
    }
    if (passwordValid && passwordRequirements.containsSpecialCharacter) {
      passwordValid = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(newPassword);
    }

    if (!passwordValid) {
      setCurrentErrorMessage(invalidPasswordMessage);
      return false;
    }

    if (newPassword !== confirmPassword) {
      setCurrentErrorMessage("Passwords do not match.");
      return false;
    }

    setCurrentErrorMessage("");
    return true;
  }

  useEffect(() => {
    setSubmitButtonDisabled(!validatePassword());
  }, [newPassword, confirmPassword]);

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

        <Button
          mode="contained"
          onPress={handlePasswordChange}
          disabled={submitButtonDisabled}
          style={styles.submitButton}
        >
          Submit
        </Button>

        <Text style={styles.errorText}>{currentErrorMessage}</Text>
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
  submitButton: {
    marginVertical: 10
  },
  errorText: {
    fontSize: 16,
    color: "#ff4040",
    textAlign: "center",
  }
});
