import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Modal,
  Portal,
  Text,
  TextInput,
  Button,
  useTheme,
  RadioButton,
} from "react-native-paper";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (
    groupName: string,
    description: string,
    visibility: string
  ) => void;
};

export default function CreateGroupModal({
  visible,
  onDismiss,
  onSubmit,
}: Props) {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [error, setError] = useState("");
  const theme = useTheme();

  const handleCreate = () => {
    if (!groupName.trim()) {
      setError("Group name is required.");
      return;
    }
    setError("");
    onSubmit(groupName.trim(), description.trim(), visibility);
    setGroupName("");
    setDescription("");
    setVisibility("private");
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          Create New Group
        </Text>

        <TextInput
          label="Group Name"
          value={groupName}
          onChangeText={setGroupName}
          mode="outlined"
          error={!!error}
        />

        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={{ marginTop: 12 }}
        />

        {error ? (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
        ) : null}

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
    padding: 28,
    marginHorizontal: 30,
    borderRadius: 20,
    elevation: 6,
    maxWidth: 460,
    minWidth: 360,
    alignSelf: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 24,
  },
  errorText: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 4,
  },
});
