import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { Modal, View, StyleSheet, Text } from "react-native";
import { IconButton, TextInput } from "react-native-paper";

interface Props {
  modalVisible: boolean,
  setModalVisible: (visible: boolean) => void
}

export default function TaskCreationModal({ modalVisible, setModalVisible }: Props) {
  const containerStyle = {backgroundColor: 'white', padding: 20};

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}>
      <View style={styles.centeredView}>
        <View style={styles.container}>
          <Text style={styles.textTitle}>Create Task</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              label="Name"
              style={styles.textInput}
              textColor={useThemeColor("textPrimary")}
            />
          </View>
          <View style={styles.textInputContainer}>
            <TextInput
              label="Description"
              style={styles.textInput}
              textColor={useThemeColor("textPrimary")}
              textAlignVertical={"top"}
            />
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <IconButton
              icon={"close-thick"}
              iconColor={useThemeColor("backgroundSecondary")}
              style={styles.iconButton}
              size={36}
              onPress={() => setModalVisible(false)}
            />
            <IconButton
              icon={"check-bold"}
              iconColor={useThemeColor("backgroundSecondary")}
              style={styles.iconButton}
              size={36}
              onPress={() => {
                console.log("Adding task...");
                setModalVisible(false);
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    margin: 20,
    backgroundColor: useThemeColor("backgroundSecondary"),
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    flexDirection: "column",
    minWidth: 500
  },
  textTitle: {
    color: useThemeColor("textPrimary"),
    fontWeight: 600,
    fontSize: 36,
    marginBottom: 0
  },
  textInputContainer: {
    backgroundColor: useThemeColor("backgroundSecondary"),
    marginVertical: 2,
    width: "100%",
    minHeight: 50,
    textAlignVertical: "top"
  },
  textInput: {
    paddingHorizontal: 0,
    backgroundColor: "transparent"
  },
  iconButton: {
    backgroundColor: useThemeColor("highlight"),
  }
});
