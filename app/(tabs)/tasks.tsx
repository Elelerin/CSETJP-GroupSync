import { FlatList, View, StyleSheet } from "react-native";
import { useCallback, useState } from "react";

import * as Tasks from "@/services/tasks";
import PillButton from "@/components/PillButton";
import TaskView from "@/components/TaskView";
import { useThemeColor } from "@/hooks/useThemeColor";
import TaskCreationModal from "@/components/TaskCreationModal";
import { Dropdown } from "react-native-element-dropdown";
import ErrorMessage from "@/components/ErrorMessage";
import { Menu, Button } from "react-native-paper";
/** Self-explanatory (for testing). */
const forceGetTasksCrash = false;

export default function Index() {
  const [selectedTasks, setSelectedTasks] = useState<Number[]>([]);
  const [tasks, setTasks] = useState<Tasks.Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState<string>("name");
  const [databaseError, setDatabaseError] = useState<boolean>(false);
  const User = "doro";
  const TaskURL =
    "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/TaskFunction";

  // sort modes and their associated sorting functions
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
    getTasks(User);
    setTasks(await Tasks.getTasks()); // typescript says this doesn't exist??
  };

  function clearTasks() {
    setTasks([]);
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

  function getTasks(_taskAuthor: string) {
    if (forceGetTasksCrash) {
      console.error("ERROR: You know what you did.");
      setDatabaseError(true);
      return;
    }

    const toReturn = "ERROR";
    return async () => {
      try {
        console.log("Trying");

        // why is all of this unused?
        const response = await fetch(TaskURL, {
          method: "GET",
          mode: "cors",
          headers: {
            taskAuthor: _taskAuthor,
          },
        })
          .then((response) => {
            if (!response.body) {
              throw new Error("Response body is null");
            }
            const reader = response.body.getReader();
            return new ReadableStream({
              start(controller) {
                return pump();
                function pump(): Promise<void> {
                  return reader.read().then(({ done, value }) => {
                    if (done) {
                      controller.close();
                      return;
                    }
                    controller.enqueue(value);
                    return pump();
                  });
                }
              },
            });
          })
          .then((stream) => new Response(stream))
          .then((response) => response.json())
          .then((json) => {
            let toPushBack: Tasks.Task[] = [];
            for (var i = 0; i < json.length; i++) {
              toPushBack.push(parseTask(json[i]));
            }

            setTasks(tasks.concat(toPushBack));
          });
        console.log(tasks);
        return toReturn;
      } catch (err: any) {
        console.error("Error occurred:", err.message || err);
      }
    };
  }

  const errorMessage = ErrorMessage({
    text: "Could not get tasks.",
    // setting this to true (the default is false) will automatically center the message on the
    // page. for this to work, put the element *outside* of the main container and wrap the entire
    // thing in a second view
    fullPage: true,
    // there's also an "icon" property but it defaults to true
  });

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
                getTasks(User);
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
              containerStyle={dropdownStyles.container}
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
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      {/* this must be outside of the main container! */}
      {databaseError && errorMessage}
    </View>
  );
}

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
  container: {
    backgroundColor: useThemeColor("backgroundSecondary"),
    borderRadius: 10,
    borderColor: useThemeColor("highlight"),
    borderWidth: 2,
  },
});

function addToSelectedList(item: Tasks.Task): Tasks.Task {
  throw new Error("Function not implemented.");
}
