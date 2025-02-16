import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { Modal, View, StyleSheet, Text } from "react-native";
import { IconButton, TextInput, Button, Icon } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";

interface Props {
  modalVisible: boolean,
  setModalVisible: (visible: boolean) => void
}

export default function TaskCreationModal({ modalVisible, setModalVisible }: Props) {
  const [dueDate, setDueDate] = React.useState<Date>();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}>
      <View style={styles.centeredView}>
        <View style={styles.container}>
          <Text style={styles.textTitle}>Create Task</Text>
          {/* task name */}
          <View style={styles.textInputContainer}>
            <TextInput
              label="Name"
              style={styles.textInput}
              textColor={useThemeColor("textPrimary")}
            />
          </View>
          {/* description */}
          <View style={styles.textInputContainer}>
            <TextInput
              label="Description"
              style={styles.textInput}
              textColor={useThemeColor("textPrimary")}
              textAlignVertical={"top"}
            />
          </View>
          {/* date */}
          <DatePickerInput            
            style={styles.datePicker}
            locale="en"
            label="Due Date"
            value={dueDate}
            onChange={(d) => setDueDate(d)}
            inputMode="start"
          />
          {/* submit/close buttons */}
          <View style={{ flexDirection: "row" }}>
            <IconButton
              icon={"close"}
              iconColor={useThemeColor("highlight")}
              style={styles.submitButton}
              size={36}
              onPress={() => setModalVisible(false)}
            />
            <IconButton
              icon={"check"}
              iconColor={useThemeColor("highlight")}
              style={styles.submitButton}
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
    marginBottom: -10
  },
  textInputContainer: {
    backgroundColor: useThemeColor("backgroundSecondary"),
    marginVertical: 10,
    width: "100%",
    minHeight: 50,
    textAlignVertical: "top"
  },
  textInput: {
    paddingHorizontal: 0,
    backgroundColor: "transparent",
    fontSize: 16,
    fontWeight: 400,
  },
  // also used for the close button
  submitButton: {
    backgroundColor: useThemeColor("backgroundSecondary"),
  },
  datePicker: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: "transparent",
    paddingHorizontal: 0
  },
});
