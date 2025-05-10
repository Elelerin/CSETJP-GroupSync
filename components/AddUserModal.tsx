import React, { useState } from "react";
import { Modal, View, StyleSheet } from "react-native";
import { TextInput, Button, RadioButton, Text } from "react-native-paper";
import { useThemeColor } from "@/hooks/useThemeColor";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onAddUser: (userData: { email: string; name: string; role: string }) => void;
};

export default function AddUserModal({ visible, onDismiss, onAddUser }: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("member");
  const backgroundColor = useThemeColor("backgroundSecondary");
  const borderColor = useThemeColor("highlight");
  const textColor = useThemeColor("textPrimary");

  const handleSubmit = () => {
    if (email.trim()) {
      onAddUser({ name, email, role });
      setName("");
      setRole("member");
      onDismiss();
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor, borderColor }]}>
          <Text style={[styles.title, { color: textColor }]}>Add User</Text>
          <TextInput
            label="User Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="User Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
          />

          <Text style={[styles.label, { color: textColor }]}>Role</Text>
          <RadioButton.Group onValueChange={setRole} value={role}>
            <View style={styles.radioRow}>
              <RadioButton value="member" />
              <Text style={[styles.radioLabel, { color: textColor }]}>
                Member
              </Text>
              <RadioButton value="admin" />
              <Text style={[styles.radioLabel, { color: textColor }]}>
                Admin
              </Text>
            </View>
          </RadioButton.Group>

          <View style={styles.buttonRow}>
            <Button onPress={onDismiss}>Cancel</Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.addButton}
            >
              Add
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: 360,
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    maxWidth: "90%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  radioLabel: {
    marginRight: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  addButton: {
    paddingHorizontal: 16,
  },
});
