import { FlatList, View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";

import * as Tasks from "@/services/tasks";
import TaskView from "@/components/TaskView";
import { useThemeColor } from "@/hooks/useThemeColor";
import TaskCreationModal from "@/components/TaskCreationModal";
import { Dropdown } from "react-native-element-dropdown";
import ErrorMessage from "@/components/ErrorMessage";
import Globals from "@/services/globals";
import { Checkbox } from "react-native-paper";
import * as React from "react";
import TooltipIconButton from "@/components/TooltipIconButton";

/** Self-explanatory (for testing). */
const forceGetTasksCrash = false;

export default function Index() {
  const [selectedTasks, setSelectedTasks] = useState<Number[]>([]);
  const [tasks, setTasks] = useState<Tasks.Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState<string>("name");
  const [databaseError, setDatabaseError] = useState<boolean>(false);

  //Sort modes and their associated sorting functions
  const sortModes: { [key: string]: (a: Tasks.Task, b: Tasks.Task) => number } = {
    name: (a, b) => a.title.localeCompare(b.title),
    date: (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime(),
    // size: (a, b) => (a.description.length ?? 0) - (b.description?.length ?? 0),
  };

  // sort mode menu stuff
  const sortModeMenuData = Object.keys(sortModes).map((i) => {
    return { label: `Sort by ${i}`, value: i };
  });

  function clearTasks() {
    setTasks([]);
  }

  function markTaskComplete(taskId: number) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, complete: true } : task
      )
    );
    toggleTaskCompletion(taskId.toString());
  }

  function markTaskIncomplete(taskId: number) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, complete: false } : task
      )
    );
    toggleTaskCompletion(taskId.toString());
  }

  function markSelectedTasksComplete() {
    selectedTasks.forEach((taskId) => {
      markTaskComplete(taskId.valueOf());
    });
  }

  function markSelectedTasksIncomplete() {
    selectedTasks.forEach((taskId) => {
      markTaskIncomplete(taskId.valueOf());
    });
  }

  /**
   * Converts a task's database entry to a useable object
   * @param taskToParse What type is this?
   */
  function parseTask(taskToParse: any) {
    console.log(taskToParse);
    const taskToAdd = {
      title: taskToParse[1],
      id: taskToParse[0],
      description: taskToParse[2],

      dueDate: taskToParse[4],
      complete: taskToParse[5],
    };
    console.log(taskToAdd);

    return taskToAdd;
  }

  async function getTasks(_taskAuthor: string) {
    setTasks([]);
    try {
      console.log("Fetching Tasks");
      const response = await fetch(Globals.taskURL, {
        method: "GET",
        mode: "cors",
        headers: {
          taskAuthor: _taskAuthor,
        },
      });

      const json = await response.json();
      let gotTasks: Tasks.Task[] = json.map(parseTask);

      setDatabaseError(false);
      return [...gotTasks];
    } catch (err: any) {
      console.error("Error occurred:", err.message || err);
    }
  }

  async function toggleTaskCompletion(_taskID: string) {
    console.log("Patching Task Completion");
    try {
      const fetchBody = {
        taskID: _taskID,
      };
      console.log(fetchBody);
      const response = await fetch(Globals.taskURL, {
        method: "PATCH",
        mode: "cors",
        body: JSON.stringify(fetchBody),
      });

      if (response) {
        setDatabaseError(false);
      }
    } catch (err: any) {
      console.error("Error occurred:", err.message || err);
    }
  }

  async function deleteTask(_taskID: string) {
    try {
      const response = await fetch(Globals.taskURL, {
        method: "DELETE",
        mode: "cors",
        headers: {
          taskID: _taskID,
        },
      });
      if (response) {
        setDatabaseError(false);
      }
    } catch (err: any) {
      console.error("Error occurred:", err.message || err);
    }
  }

  const errorMessage = ErrorMessage({
    text: "Could not get tasks.",
    // setting this to true (the default is false) will automatically center the message on the
    // page. for this to work, put the element *outside* of the main container and wrap the entire
    // thing in a second view
    fullPage: true,
    // there's also an "icon" property but it defaults to true
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: useThemeColor("backgroundPrimary"),
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    listContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      paddingHorizontal: 10,
      // marginBottom: 10,
      zIndex: 10,
      height: 70,
      paddingTop: 10
    },
    tasksContainer: {
      width: "100%",
      marginTop: 10,
      zIndex: 0
    },
  });

  const dropdownStyles = StyleSheet.create({
    main: {
      marginHorizontal: 12,
      marginTop: 3,
      marginBottom: 15,
      height: 50,
      borderBottomColor: useThemeColor("highlight"),
      borderBottomWidth: 2,
      minWidth: 175,
    },
    icon: {
      marginRight: 5,
    },
    placeholder: {
      color: useThemeColor("textSecondary"),
      fontSize: 18,
    },
    selectedText: {
      color: useThemeColor("textPrimary"),
      fontSize: 18,
    },
    itemText: {
      color: useThemeColor("textPrimary"),
      fontSize: 18,
    },
    dropdownBox: {
      backgroundColor: useThemeColor("backgroundSecondary"),
      borderRadius: 10,
      borderColor: useThemeColor("highlight"),
      borderWidth: 2,
    },
  });

  useEffect(() => {
    (async () => {
      console.log("getting tasks...");
      const t = await getTasks(await Globals.user());
      setTasks(t!.toSorted(sortModes.name));
    })();
  }, []);

  //Return render of tasks page
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* task creation modal - this is invisible until the button is clicked */}
        <TaskCreationModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />

        {/* everything else */}
        <View style={styles.listContainer}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {/* <TooltipIconButton
              icon="download"
              size={30}
              tooltipText="Fetch Tasks"
              tooltipPosition="bottom"
              onPress={async () => {
                console.log("getting tasks...");
                const t = await getTasks(await Globals.user());
                setTasks(t!.toSorted(sortModes.name));
              }}
            />
            <TooltipIconButton
              icon="trash-can-outline"
              size={30}
              tooltipText="Clear List"
              tooltipPosition="bottom"
              onPress={clearTasks}
            /> */}
            <TooltipIconButton
              icon="reload"
              size={30}
              tooltipText="Refresh List"
              tooltipPosition="bottom"
              onPress={async () => {
                setTasks([]);
                console.log("getting tasks...");
                const t = await getTasks(await Globals.user());
                setTasks(t!.toSorted(sortModes.name));
              }}
            />
            <TooltipIconButton
              icon="plus"
              size={30}
              tooltipText="Create Task"
              tooltipPosition="bottom"
              onPress={() => setModalVisible(true)}
            />
            {/* <TooltipIconButton
              icon="checkbox-multiple-blank-outline"
              size={30}
              tooltipText="Select all"
              tooltipPosition="bottom"
              onPress={() => console.log("not implemented :(")}
            /> */}
            <TooltipIconButton
              icon="checkbox-marked-outline"
              size={30}
              tooltipText="Mark Selected Complete"
              tooltipPosition="bottom"
              onPress={markSelectedTasksComplete}
            />
            <TooltipIconButton
              icon="checkbox-blank-off-outline"
              size={30}
              tooltipText="Mark Selected Incomplete"
              tooltipPosition="bottom"
              onPress={markSelectedTasksIncomplete}
            />
            <TooltipIconButton
              icon="trash-can-outline"
              size={30}
              tooltipText="Delete Selected"
              tooltipPosition="bottom"
              onPress={() => {
                selectedTasks.forEach((taskId) => {
                  deleteTask(taskId.toString());
                });
                setSelectedTasks([]);
              }}
            />
          </View>

          {/* sorting menu */}
          <View style={{ marginLeft: "auto" }}>
            <Dropdown
              style={dropdownStyles.main}
              placeholderStyle={dropdownStyles.placeholder}
              selectedTextStyle={dropdownStyles.selectedText}
              containerStyle={dropdownStyles.dropdownBox}
              itemTextStyle={dropdownStyles.itemText}
              activeColor="transparent"
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Color Theme"
              data={sortModeMenuData}
              value={sortBy}
              onChange={(item) => {
                console.log(`sorting by ${item.value}`);
                setTasks(tasks.toSorted(sortModes[item.value]));
              }}
            />
          </View>
        </View>

        {/* main task list */}
        <FlatList
          style={styles.tasksContainer}
          data={tasks}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Checkbox
                status={
                  selectedTasks.includes(item.id) ? "checked" : "unchecked"
                }
                onPress={() => {
                  if (!selectedTasks.includes(item.id)) {
                    setSelectedTasks([...selectedTasks, item.id]);
                  } else {
                    setSelectedTasks(
                      selectedTasks.filter((taskId) => taskId !== item.id)
                    );
                  }
                }}
              />

              <TaskView
                task={item}
                onClick={() => {
                  if (!selectedTasks.includes(item.id)) {
                    setSelectedTasks([...selectedTasks, item.id]);
                  } else {
                    setSelectedTasks(
                      selectedTasks.filter((taskId) => taskId !== item.id)
                    );
                  }
                  console.log(selectedTasks);
                }}
              />
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      {databaseError && errorMessage}
    </View>
  );
}
