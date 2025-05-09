import { FlatList, View, StyleSheet } from "react-native";
import { useState } from "react";

import * as Tasks from "@/services/tasks";
import PillButton from "@/components/PillButton";
import TaskView from "@/components/TaskView";
import { useThemeColor } from "@/hooks/useThemeColor";
import TaskCreationModal from "@/components/TaskCreationModal";
import { Dropdown } from "react-native-element-dropdown";
import ErrorMessage from "@/components/ErrorMessage";
import Globals from "@/services/globals";
import { Checkbox } from "react-native-paper";
import * as React from "react";
/** Self-explanatory (for testing). */
const forceGetTasksCrash = false;

export default function Index() {
  const [selectedTasks, setSelectedTasks] = useState<Number[]>([]);
  const [tasks, setTasks] = useState<Tasks.Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState<string>("name");
  const [databaseError, setDatabaseError] = useState<boolean>(false);

  //Sort modes and their associated sorting functions
  const sortModes: { [key: string]: (a: Tasks.Task, b: Tasks.Task) => number } =
    {
      name: (a, b) => a.title.localeCompare(b.title),
      date: (a, b) =>
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
      size: (a, b) =>
        (a.description.length ?? 0) - (b.description?.length ?? 0),
    };
  // moved to a function so it can be re-called whenever the sort mode changes
  function sortTasks() {
    // this fallback *should* be impossible
    return [...tasks].sort(sortModes[sortBy] ?? ((a, b) => 0));
  }

  // sort mode menu stuff
  const sortModeMenuData = Object.keys(sortModes).map((i) => {
    return { label: `Sort by ${i}`, value: i };
  });

  const sortedTasks = sortTasks();

  const onLoad = async () => {
    getTasks(Globals.user());
    setTasks(await Tasks.getTasks()); // typescript says this doesn't exist??
  };

  function clearTasks() {
    setTasks([]);
  }

  function markTaskComplete(taskId: number) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, complete: !task.complete } : task
      )
    );
    toggleTaskCompletion(taskId.toString());
  }
  function markAllTasksComplete() {
    //->copilot recommended this one so needs testing
    setTasks((prev) =>
      prev.map((task) => ({ ...task, complete: !task.complete }))
    );
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

      setTasks([...gotTasks]);
      setDatabaseError(false);
    } catch (err: any) {
      console.error("Error occurred:", err.message || err);
    }
  }

  async function toggleTaskCompletion(_taskID: string) {
    console.log("Patching Task Completion");
    try {
      const fetchBody = {
        taskID: _taskID
      };
      console.log(fetchBody);
      const response = await fetch(Globals.taskURL, {
        method: "PATCH",
        mode: "cors",
        body: JSON.stringify(fetchBody)
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
      marginBottom: 10,
    },
    tasksContainer: {
      width: "100%",
      marginTop: 10,
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

  function addToSelectedList(item: Tasks.Task): Tasks.Task {
    throw new Error("Function not implemented.");
  }

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
            <PillButton
              icon={"download"}
              onPress={() => {
                console.log("getting tasks...");
                getTasks(Globals.user());
              }}
            />
            <PillButton icon={"trash"} onPress={clearTasks} />
            <PillButton
              icon={"plus"}
              onPress={() => {
                setModalVisible(true);
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
                setSortBy(item.value);
                console.log(`Sort tasks by ${item.value}`);
              }}
            />
          </View>
        </View>

        {/* main task list */}
        <FlatList
          style={styles.tasksContainer}
          data={sortedTasks}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Checkbox
                status={item.complete ? "checked" : "unchecked"}
                onPress={() => markTaskComplete(item.id)}
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
