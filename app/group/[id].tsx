import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Card, IconButton } from "react-native-paper";
import * as Tasks from '@/services/tasks';
import TaskView from "@/components/TaskView";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import TaskCreationModal from "@/components/TaskCreationModal";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

// temporary, will be replaced later
interface User {
  name: string
}
const UserGroupURL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/groupUser"
/**
 * Gets list of users in database as an array of userIDs
 * Will change to be DISPLAYNAMES, but that's all backend stuff. For now, if this is loaded in
 * then you won't need to change anything when I push it. 
 */
 

export default function GroupHome() {
  const { id } = useLocalSearchParams();
  const groupID = Number(id);
  const [modalVisible, setModalVisible] = useState(false);
  const [users, setUsers] = useState<string[]>([]);

  async function getGroupUsers(groupID: Number) : Promise<string[]>{ 
    try {
      console.log("Tset");
      const response = await fetch(UserGroupURL, {
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
        console.log(users);
      };

      fetchUsers();

      return () => console.log("Screen is unfocused!"); // Cleanup if needed
    }, [groupID])
  );

  const tasks: Tasks.Task[] = [
    {
      id: 1,
      title: "Water plants",
      description: "Water the plants in the foyer. The spider plant needs two cups of water.",
      dueDate: new Date("2024-11-26"),
      complete: false,
    },
    {
      id: 2,
      title: "Buy holiday gifts",
      description: "Peter wants a novelty spoon. Maria wants a go kart. Chet wants a portrait of his dog.",
      dueDate: new Date("2024-12-17"),
      complete: false,
    },
    {
      id: 3,
      title: "Hire minions",
      description: "Consider increasing pay and giving them a health plan this time.",
      dueDate: new Date("2025-1-18"),
      complete: false,
    },
    {
      id: 4,
      title: "Find lair location",
      description: "A volcano island looks cool and even includes its own natural power source.",
      dueDate: new Date("2025-3-31"),
      complete: false,
    },
    {
      id: 5,
      title: "Pay taxes",
      description: "Not even supervillains mess with the IRS.",
      dueDate: new Date("2025-4-15"),
      complete: false,
    },
    {
      id: 6,
      title: "Water plants",
      description: "Water the plants in the foyer. The spider plant needs two cups of water.",
      dueDate: new Date("2024-11-26"),
      complete: false,
    },
    {
      id: 7,
      title: "Buy holiday gifts",
      description: "Peter wants a novelty spoon. Maria wants a go kart. Chet wants a portrait of his dog.",
      dueDate: new Date("2024-12-17"),
      complete: false,
    },
    {
      id: 8,
      title: "Hire minions",
      description: "Consider increasing pay and giving them a health plan this time.",
      dueDate: new Date("2025-1-18"),
      complete: false,
    },
    {
      id: 9,
      title: "Find lair location",
      description: "A volcano island looks cool and even includes its own natural power source.",
      dueDate: new Date("2025-3-31"),
      complete: false,
    },
    {
      id: 0,
      title: "Pay taxes",
      description: "Not even supervillains mess with the IRS.",
      dueDate: new Date("2025-4-15"),
      complete: false,
    },
  ];

  // for sorting menus
  const [sortAscending, setSortAscending] = useState(true);
  const [sortMode, setSortMode] = useState<string>();
  const sortModeMenuData = [
    { label: "Name", value: "alphabetical" },
    { label: "Creation Date", value: "creation date" },
    { label: "Due Date", value: "due date" }
  ];

  // for filter menu
  const [filters, setFilters] = useState<string[]>([]);
  const filterMenuData = [
    { label: "Completed", value: "completed" },
    { label: "Uncompleted", value: "uncompleted" },
    { label: "Assigned to Me", value: "assigned to me" },
    { label: "Assigned to Others", value: "assigned to others" },
    { label: "Unassigned", value: "Unassigned" },
  ];
  
  // required because react native is a PERFECTLY DESIGNED library with NO FLAWS WHATSOEVER
  const selectedIconColor = useThemeColor("textPrimary");

  return (
    <View style={styles.pageContainer}>
      <TaskCreationModal modalVisible={modalVisible} setModalVisible={setModalVisible} groupID={ groupID }/>
      
      <View style={styles.upperColumnContainer}>
        <Card mode="contained" style={styles.titleCard}>
          <Text style={styles.textTitle}>Group {id} name</Text>
        </Card>

        {/* sort direction toggle */}
        <View style={styles.filtersCard}>
          <IconButton
            icon={sortAscending ? "sort-ascending" : "sort-descending"}
            iconColor={useThemeColor("textSecondary")}
            size={36}
            onPress={() => setSortAscending(!sortAscending)}
          />

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
            }}
          />

          {/* filter menu */}
          <MultiSelect
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
                  <MaterialIcons color={selectedIconColor} name="delete" size={20} />
                </View>
              </TouchableOpacity>
            )}
          />

          {/* new task button */}
          <IconButton
            icon={"note-plus"}
            iconColor={useThemeColor("textSecondary")}
            size={36}
            onPress={() => { setModalVisible(true); }}
          />
        </View>
      </View>

      <View style={styles.lowerColumnContainer}>
        {/* ysers */}
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
            renderItem={({item}) => <TaskView task={item} onClick={()=>{}}/>}
            showsHorizontalScrollIndicator={false}/>
        </View>
      </View>
    </View>
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
    alignItems: "center"
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