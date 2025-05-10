import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Modal,
  Portal,
  Text,
  TextInput,
  Button,
  useTheme,
} from "react-native-paper";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (groupName: string) => void;
};

export default function CreateGroupModal({
  visible,
  onDismiss,
  onSubmit,
}: Props) {
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");
  const theme = useTheme();

  const handleCreate = () => {
    if (!groupName.trim()) {
      setError("Group name is required.");
      return;
    }
    setError("");
    onSubmit(groupName.trim());
    setGroupName("");
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <Text style={styles.title}>Create New Group</Text>
        <TextInput
          label="Group Name"
          value={groupName}
          onChangeText={setGroupName}
          mode="outlined"
          error={!!error}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={styles.actions}>
          <Button onPress={onDismiss} mode="text">
            Cancel
          </Button>
          <Button
            onPress={handleCreate}
            mode="contained"
            style={{ marginLeft: 10 }}
          >
            Create
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  errorText: {
    color: "red",
    marginTop: 4,
    marginBottom: 8,
  },
});
