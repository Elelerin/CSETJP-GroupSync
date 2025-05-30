import { FlatList, View, StyleSheet } from "react-native";
import { useState } from "react";

import * as Groups from "@/services/groups";
import * as Tasks from "@/services/tasks";
import PillButton from "@/components/PillButton";
import GroupView from "@/components/GroupView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Dropdown } from "react-native-element-dropdown";
import ErrorMessage from "@/components/ErrorMessage";
import Globals from "@/services/globals";
import CreateGroupModal from "@/components/CreateGroupModal";
import TooltipIconButton from "@/components/TooltipIconButton";

/** Self-explanatory (for testing). */
const forceGetGroupsCrash = false;

const User = "doro";
// these are now properties on Globals
// const GroupTaskURL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/groupTasks"
// const TaskURL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/TaskFunction"
// const GroupURL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/GroupFunction"
export default function Index() {
  const [createGroupVisible, setCreateGroupVisible] = useState(false);
  const [groups, setGroups] = useState<Groups.Group[]>([]);
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("name");
  const [databaseError, setDatabaseError] = useState<boolean>(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: useThemeColor("backgroundPrimary"),
      paddingHorizontal: 20,
      paddingTop: 10,
      zIndex: 0
    },
    groupsContainer: {
      width: "100%",
      // marginTop: 10,
    },
    buttonRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      paddingHorizontal: 10,
      zIndex: 10,
      height: 80
      // marginBottom: 10
    },
  });
  const dropdownStyles = StyleSheet.create({
    main: {
      marginHorizontal: 12,
      marginTop: 10,
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

  // sort modes and their associated sorting functions
  const sortModes: { [key: string]: (a: Groups.Group, b: Groups.Group) => number } = {
    name: (a, b) => a.title.localeCompare(b.title),
    // date: (a, b) => 0, // TODO: replace this with an actual sorting function
    size: (a, b) => (a.description.length ?? 0) - (b.description?.length ?? 0),
  };
  // moved to a function so it can be re-called whenever the sort mode changes
  function sortGroups() {
    // this fallback *should* be impossible
    return [...groups].sort(sortModes[sortBy] ?? ((a, b) => 0));
  }

  // sort mode menu stuff
  const sortModeMenuData = Object.keys(sortModes).map((i) => {
    return { label: `Sort by ${i}`, value: i };
  });

  const sortedGroups = sortGroups();

  function parseGroup(groupToParse: any) {
    console.log(groupToParse);
    const groupToAdd = {
      id: groupToParse[0],
      title: groupToParse[1],
      description: groupToParse[2],

      numTasks: 0,
      hasNextTask: false,
      /**
       * Title and due date for the next due task in the group. This will need to be changed once
       * the backend is actually implemented, but for now I'm just hard-coding things for the demo.
       */
      nextTaskTitle: "NULL",
    };

    return groupToAdd;
  }

  /**
   * Attempts to get all groups that a user is part of. If `ForceGetGroupsCrash` is enabled, it
   * just crashes instead.
   */
  async function getGroups(_groupOwner: string) {
    if (forceGetGroupsCrash) {
      console.error("ERROR: You know what you did.");
      setDatabaseError(true);
      return;
    }

    try {
      console.log("Getting Groups...");

      const response = await fetch(Globals.groupURL, {
        method: "GET",
        mode: "cors",
        headers: {
          groupOwner: _groupOwner,
        },
      });

      if (!response.ok) {
        throw new Error(`ERROR: STATUS: ${response.status}`);
      }

      const json = await response.json();

      let gotGroups: Groups.Group[] = json.map(parseGroup);
      setGroups([...gotGroups]);
      setDatabaseError(false);
    } catch (error) {
      console.error("Failed to get groups", error);
      setDatabaseError(true);
    }
  }

  function parseTask(taskToParse: any) {
    console.log(taskToParse);
    const taskToAdd: Tasks.Task = {
      title: taskToParse[1],
      id: taskToParse[0],
      description: taskToParse[2],

      dueDate: taskToParse[4],
      complete: taskToParse[5],
    };
    return taskToAdd;
  }

  /**
   * Deletes ***ALL*** groups.
   */
  const remove = async () => {
    // DELETE ALL GROUPS (HEAVY OPS)
    setGroups([]);
  };

  const errorMessage = ErrorMessage({
    text: "Could not get groups.",
    // setting this to true (the default is false) will automatically center the message on the
    // page. for this to work, put the element *outside* of the main container and wrap the entire
    // thing in a second view
    fullPage: true,
    // there's also an "icon" property but it defaults to true
  });

  console.log("page: groups");

  // Return render of groups page
  return (
    // functions can only return one element, so this has to wrap around both the main page and the
    // error message. setting flex to 1 is also required to prevent the background from being
    // completely white, because css is COMPLETELY PERFECT and has NO FLAWS WHATSOEVER.
    <View style={{ flex: 1 }}>
      {/* main page container */}
      <View style={styles.container}>
        {/* 🔹 Button Row - Centered with Sort By on the Right */}
        <View style={styles.buttonRow}>
          {/* Smaller Action Buttons - Centered */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TooltipIconButton
              icon="download"
              size={30}
              tooltipText="Fetch Groups"
              tooltipPosition="bottom"
              onPress={() => getGroups(Globals.user())}
            />
            <TooltipIconButton
              icon="trash-can-outline"
              size={30}
              tooltipText="Clear List"
              tooltipPosition="bottom"
              onPress={remove}
            />
            <TooltipIconButton
              icon="plus"
              size={30}
              tooltipText="Create Group"
              tooltipPosition="bottom"
              onPress={() => setCreateGroupVisible(true)}
            />
          </View>

          {/* Sort By Button - Aligned Right */}
          <View style={{ marginLeft: "auto" }}>
            {/* <Dropdown
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
                console.log(`Sort groups by ${item.value}`);
              }}
            /> */}
          </View>
        </View>
        <FlatList
          style={styles.groupsContainer}
          data={groups}
          renderItem={({ item }) => <GroupView group={item} id={item.id} />}
          showsHorizontalScrollIndicator={false}
        />
        {/* Create Group Modal */}
        <CreateGroupModal
          visible={createGroupVisible}
          onDismiss={() => setCreateGroupVisible(false)}
          onSubmit={(name) => {
            console.log("Creating group:", name);
            setCreateGroupVisible(false);
          }}
        />
      </View>
      {/* this must be outside of the main container! */}
      {databaseError && errorMessage}
    </View>
  );
}
