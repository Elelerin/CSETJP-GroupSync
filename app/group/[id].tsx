import { useThemeColor } from "@/hooks/useThemeColor";
import { Stack, useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Card, IconButton, PaperProvider } from "react-native-paper";
import * as Tasks from '@/services/tasks';
import TaskView from "@/components/TaskView";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import TaskCreationModal from "@/components/TaskCreationModal";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import Globals from "@/services/globals";
import TooltipIconButton from "@/components/TooltipIconButton";
import AddUserModal from "@/components/AddUserModal";

// this is now a property on Globals
// const UserGroupURL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/groupUser";
export default function GroupHome() {
  const { id } = useLocalSearchParams();
  const groupID = Number(id);
  const [modalVisible, setModalVisible] = useState(false);
  const [addUserModalVisible, setAddUserModalVisible] = useState(false);
  const [users, setUsers] = useState<string[]>([]);
  const [tasks, setTasks] = useState<Tasks.Task[]>([]);

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

  async function getGroupTasks(groupID: Number) : Promise<string[]>{ 
    try {
      console.log("getting tasks");
      const response = await fetch(Globals.groupTaskURL, {
        method : 'GET',
        mode: "cors",
        headers : {
          'groupTaskGroup' : groupID.toString()
        }
      });

      if(!response.ok){
        throw new Error("Group Users Retrieval error");
      }
      const json = await response.json();
      console.log(json);
      let gotTasks: Tasks.Task[] = json.map(parseTask);

      setTasks([...gotTasks]);
      console.log(gotTasks); 
    } catch {

    }
    throw console.error();
    
  }

  async function getGroupUsers(groupID: Number) : Promise<string[]>{ 
    try {
      console.log("Tset");
      const response = await fetch(Globals.groupUserURL, {
        method : 'GET',
        headers : {
          'usergroupgroup' : groupID.toString()
        }
      });

      if(!response.ok){
        throw new Error("Group Users Retrieval error");
      }
      
      const userIds: string[] = await response.json();
      setUsers([...users, ...userIds]);
      console.log(users);
    } catch {

    }
    throw console.error();
    
  }
  
  useFocusEffect(
    useCallback(() => {
      const fetchUsers = async () => {
        console.log("TESTING");
        getGroupUsers(groupID);
        getGroupTasks(groupID);
        console.log(users);
      };

      fetchUsers();

      return () => console.log("Screen is unfocused!"); // Cleanup if needed
    }, [groupID])
  );


  // for sorting menus
  const [sortAscending, setSortAscending] = useState(true);
  const [sortMode, setSortMode] = useState<string>();
  const sortModeMenuData = [
    { label: "Name",          value: "name" },
    // { label: "Creation Date", value: "creation date" },
    { label: "Due Date",      value: "dueDate" }
  ];

  const sortFunctions: { [key: string]: (a: Tasks.Task, b: Tasks.Task) => number } = {
    name: (a, b) => a.title.localeCompare(b.title),
    dueDate: (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
  };

  // for filter menu
  const [filters, setFilters] = useState<string[]>([]);
  const filterMenuData = [
    { label: "Completed",          value: "completed" },
    { label: "Uncompleted",        value: "uncompleted" },
    { label: "Assigned to Me",     value: "assigned to me" },
    { label: "Assigned to Others", value: "assigned to others" },
    { label: "Unassigned",         value: "Unassigned" },
  ];
  
  const selectedIconColor = useThemeColor("textPrimary");

  return (
    <>
    <Stack.Screen options={{headerShown: false}} />
    <PaperProvider>
      <View style={styles.pageContainer}>
        <TaskCreationModal modalVisible={modalVisible} setModalVisible={setModalVisible} groupID={ groupID }/>
        <AddUserModal
          visible={addUserModalVisible}
          onDismiss={() => setAddUserModalVisible(false)}
          onAddUser={() => console.log(`Adding user to group....`)}
        />
        
        <View style={styles.upperColumnContainer}>
          <Card mode="contained" style={styles.titleCard}>
            <Text style={styles.textTitle}>Group {id} name</Text>
          </Card>

          <View style={styles.filtersCard}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
              {/* new task button */}
              <TooltipIconButton
                icon="note-plus"
                size={30}
                tooltipText="Add Task"
                tooltipPosition="bottom"
                onPress={() => setModalVisible(true)}
              />

              {/* sort direction toggle */}
              {/* <TooltipIconButton
                icon={sortAscending ? "sort-ascending" : "sort-descending"}
                size={30}
                tooltipText={sortAscending ? "Sort: Ascending" : "Sort: Descending"}
                tooltipPosition="bottom"
                onPress={() => setSortAscending(!sortAscending)}
              /> */}

              {/* sort mode menu */}
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
                placeholder="None"
                data={sortModeMenuData}
                value={sortMode}
                onChange={item => {
                  setSortMode(item.value);
                  setTasks(tasks.toSorted(sortFunctions[item.value]));
                }}
              />

              {/* filter menu */}
              {/* <MultiSelect
                style={multiSelectStyles.main}
                placeholderStyle={multiSelectStyles.placeholder}
                containerStyle={multiSelectStyles.container}
                itemTextStyle={multiSelectStyles.itemText}
                activeColor="transparent"
                alwaysRenderSelectedItem
                labelField="label"
                valueField="value"
                data={filterMenuData}
                value={filters}
                onChange={item => {
                  setFilters(item)
                }}
                // renderItem={renderItem}
                renderSelectedItem={(item, unSelect) => (
                  <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                    <View style={multiSelectStyles.selected}>
                      <Text style={multiSelectStyles.selectedText}>{item.label}</Text>
                      <MaterialIcons color={selectedIconColor} name="delete-outline" size={20} />
                    </View>
                  </TouchableOpacity>
                )}
              /> */}
            </View>
            <TooltipIconButton
              icon="account-plus"
              size={30}
              tooltipText="Add User"
              tooltipPosition="bottom"
              onPress={() => setAddUserModalVisible(true)}
            />
          </View>
        </View>

        <View style={styles.lowerColumnContainer}>
          {/* users */}
          <Card mode="contained" style={styles.usersCard}>
            <Card.Content>
              <Text style={styles.textSubtitle}>Users</Text>
              <FlatList
                data={users}
                keyExtractor={(item, index) => index.toString()} // Ensures each item has a unique key
                renderItem={({ item }) => <Text style={styles.textContent}>{item}</Text>}
                showsHorizontalScrollIndicator={false}/>
            </Card.Content>
          </Card>
        
          {/* task list */}
          <View style={styles.tasksContainer}>
            <FlatList
              data={tasks} 
              // onclick currently does nothing - this will need to be changed eventually
              renderItem={
                ({item}) => <TaskView task={item} style={{ width: "100%" }} onClick={()=>{}}/>
              }
              showsHorizontalScrollIndicator={false}/>
          </View>
        </View>
      </View>
    </PaperProvider>
    </>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: useThemeColor("backgroundPrimary"),
    paddingHorizontal: 30,
    paddingTop: 20
  },
  upperColumnContainer: {
    flexDirection: "row",
    backgroundColor: useThemeColor("backgroundPrimary"),
    zIndex: 5
  },
  lowerColumnContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: useThemeColor("backgroundPrimary"),
  },
  titleCard: {
    backgroundColor: useThemeColor("backgroundSecondary"),
    borderRadius: 15,
    borderColor: useThemeColor("highlight"),
    borderWidth: 3,
    marginRight: 10,
    paddingHorizontal: 20,
    paddingBottom: 10,
    width: "30%",
  },
  filtersCard: {
    backgroundColor: useThemeColor("backgroundSecondary"),
    borderRadius: 15,
    borderColor: useThemeColor("highlight"),
    borderWidth: 3,
    flexGrow: 1,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  multiSelectContainer: {
    flexDirection: "row"
  },
  usersCard: {
    backgroundColor: useThemeColor("backgroundSecondary"),
    borderRadius: 15,
    borderColor: useThemeColor("highlight"),
    borderWidth: 3,
    width: "30%",
    alignSelf: "flex-start",
    position: "sticky",
    top: 20,
    marginTop: 9
  },
  tasksContainer: {
    flex: 1,
    flexDirection: "column",
    paddingLeft: 10,
  },
  textTitle: {
    color: useThemeColor("textPrimary"),
    fontWeight: 600,
    fontSize: 48
  },
  textSubtitle: {
    color: useThemeColor("textPrimary"),
    fontWeight: 600,
    fontSize: 36,
    marginBottom: 5
  },
  textContent: {
    color: useThemeColor("textSecondary"),
    fontSize: 28,
  }
});

const dropdownStyles = StyleSheet.create({
  main: {
    marginHorizontal: 12,
    marginTop: 14,
    marginBottom: 18,
    height: 50,
    borderBottomColor: useThemeColor("highlight"),
    borderBottomWidth: 2,
    minWidth: 175
  },
  icon: {
    marginRight: 5,
  },
  placeholder: {
    color: useThemeColor("textSecondary"),
    fontSize: 24,
  },
  selectedText: {
    color: useThemeColor("textPrimary"),
    fontSize: 24,
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

const multiSelectStyles = StyleSheet.create({
  main: {
    marginHorizontal: 12,
    marginTop: 14,
    marginBottom: 18,
    height: 50,
    borderBottomColor: useThemeColor("highlight"),
    borderBottomWidth: 2,
    minWidth: 175
  },
  placeholder: {
    color: useThemeColor("textSecondary"),
    fontSize: 24,
  },
  selectedText: {
    color: useThemeColor("textPrimary"),
    fontSize: 16,
    marginRight: 5
  },
  icon: {
    width: 20,
    height: 20,
  },
  selected: {
    borderRadius: 12,
    borderColor: useThemeColor("highlight"),
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  container: {
    backgroundColor: useThemeColor("backgroundSecondary"),
    borderRadius: 10,
    borderColor: useThemeColor("highlight"),
    borderWidth: 2,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    color: useThemeColor("textPrimary"),
    fontSize: 18,
  },
});