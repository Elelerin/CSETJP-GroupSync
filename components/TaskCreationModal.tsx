import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import * as Tasks from "@/services/tasks";
import { Modal, View, StyleSheet, Text } from "react-native";
import { IconButton, TextInput, Button, MD3DarkTheme, Icon, PaperProvider } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";

interface Props {
  modalVisible: boolean,
  setModalVisible: (visible: boolean) => void,
  //If this is defined, we're in a group, so we should add tasks to the group, instead
  groupID?: Number
}

var User = 'doro';
const TaskURL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/TaskFunction"

export default function TaskCreationModal({ modalVisible, setModalVisible, groupID }: Props) {
  const [taskName, setTaskName] = React.useState<string>('');
  const [taskDesc, setTaskDesc] = React.useState<string>('');
  const [dueDate, setDueDate] = React.useState<Date>();
  const [dateSelectorOpen, setDateSelectorOpen] = React.useState(false);

  const onDateSelectorDismiss = React.useCallback(() => {
    setDateSelectorOpen(false);
  }, [setDateSelectorOpen]);

  const onDateSelectorConfirm = React.useCallback(
    (params: { date: CalendarDate }) => {
      setDateSelectorOpen(false);
      setDueDate(params.date);
    },
    [setDateSelectorOpen, setDueDate]
  );

  // for limiting the date selector
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1)

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
                onChangeText = {setTaskName}
                textColor={useThemeColor("textPrimary")}
                theme={paperTheme}
              />
            </View>

            {/* description */}
            <View style={styles.textInputContainer}>
              <TextInput
                label="Description"
                style={styles.textInput}
                onChangeText = {setTaskDesc}
                textColor={useThemeColor("textPrimary")}
                textAlignVertical={"top"}
                theme={paperTheme}
              />
            </View>

            {/* date selection button */}
            <View style={styles.dateButtonContainer}>
              <Button
                onPress={() => setDateSelectorOpen(true)}
                theme={paperTheme}
              >
                <View style={{ paddingVertical: 2, alignItems: "center", flexDirection: "row" }}>
                  <Icon source={"calendar-clock"} size={24} color={useThemeColor("textPrimary")} />
                  <Text style={styles.dateButtonText}>
                    {dueDate ? dueDate.toLocaleDateString() : "No Due Date"}
                  </Text>
                </View>
              </Button>
              <IconButton
                icon={"close"}
                style={{ marginLeft: 5 }}
                iconColor={useThemeColor("textSecondary")}
                theme={paperTheme}
                size={24}
                onPress={() => setDueDate(undefined)}
              />
            </View>

            {/* date selection modal */}
            <PaperProvider theme={paperTheme}>
              <DatePickerModal
                locale="en"
                mode="single"
                label="Select Due Date"
                visible={dateSelectorOpen}
                date={dueDate}
                validRange={{ startDate: yesterday }}
                onDismiss={onDateSelectorDismiss}
                onConfirm={onDateSelectorConfirm}
              />
            </PaperProvider>

            {/* submit/close buttons */}
            <View style={{ flexDirection: "row" }}>
              <IconButton
                icon={"close"}
                iconColor={useThemeColor("highlight")}
                theme={paperTheme}
                size={36}
                onPress={() => setModalVisible(false)}
              />
              <IconButton
                icon={"check"}
                iconColor={useThemeColor("highlight")}
                theme={paperTheme}
                size={36}
                onPress={() => {
                  const taskToAdd: Tasks.Task = {
                    title: taskName,
                    id: 0,
                    description: taskDesc,
                    
                    // typescript gets mad here because it thinks dueDate might be undefined; are we
                    // sure that it won't be by now?
                    dueDate: dueDate,
                    complete: false
                  }
                  if (groupID !== undefined) {
                    // REGISTER NORMAL TASK TO GROUP


                  } else { 
                    // REGISTER NORMAL TASK TO USER
                    registerTask(taskToAdd, User)
                  }
                  
                  setModalVisible(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
  );
}

/**
 * Attempts to add a task to the database.
 * @param userID Should this be a number?
 */
async function registerTask(inputTask: Tasks.Task, userID: string){ 
    try {
      const dateToParse = inputTask.dueDate;
      const pad = (num: Number) => num.toString().padStart(2, '0');
      const toSend = `${pad(dateToParse.getFullYear())}-${pad(dateToParse.getMonth() + 1)}-${pad(dateToParse.getDate())} ${pad(dateToParse.getHours())}:${pad(dateToParse.getMinutes())}:${pad(dateToParse.getSeconds())}`;
      console.log(toSend);

      const fetchBody = {
        taskName : inputTask.title,
        taskDesc : inputTask.description,
        taskAuthor : userID,
        ...(inputTask.dueDate && {dueDate : dateToParse})
      }
      console.log(fetchBody);

      const response = await fetch(TaskURL, {
        method : 'POST',
        body: JSON.stringify(fetchBody)
      });

      if (!response.ok) {
        throw new Error("Error registering task.");
      }

      const json = response;
      console.log(response);
      return json;
    } catch {

    }
  
}

/**
 * Required to make react native paper work. TL;DR, paper uses themes for most of its colors, and
 * there's no good way to make it use stylesheets instead. Themes seem like they could be better
 * for colors than stylesheets, so we may want to refactor in the future.
 */
const paperTheme = {
    ...MD3DarkTheme, // use the default theme for anything we don't override
    colors: {
      primary: '#a548e2',
      secondary: '#ffffff',
      onSecondary: '#ffffff',
      surfaceVariant: '#c3c3c3',
      surface: '#202020',
      onSurface: '#c3c3c3'
    }
};

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
  datePicker: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: "transparent",
    paddingHorizontal: 0
  },
  dateButtonContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 10,
    width: "100%",
    alignContent: "flex-start",
    justifyContent: "space-between"
  },
  dateButtonText: {
    fontSize: 16,
    fontWeight: 400,
    marginLeft: 10,
    color: useThemeColor("textPrimary")
  }
});
