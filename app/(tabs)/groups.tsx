import { FlatList, View, StyleSheet } from "react-native";
import { useCallback, useState } from 'react';

import * as Groups from '@/services/groups'
import * as Tasks from "@/services/tasks";
import PillButton from '@/components/PillButton'
import GroupView from "@/components/GroupView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useFocusEffect } from "@react-navigation/native";
import { Button, Menu, Modal, PaperProvider, Portal } from "react-native-paper";

const User = 'doro';
const GroupTaskURL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/groupTasks"
var TaskURL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/TaskFunction"
const GroupURL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/GroupFunction"
export default function Index() {
  const [groups, setGroups] = useState<Groups.Group[]>([]);
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("name");
  const [menuVisible, setMenuVisible] = useState(false);

  function parseGroup (groupToParse: any) {
    console.log(groupToParse);
    var groupToAdd = {
      id: groupToParse[0],
      title:groupToParse[1],
      description: groupToParse[2],

      numTasks: 0,
      hasNextTask: false,
      /**
       * Title and due date for the next due task in the group. This will need to be changed once the
       * backend is actually implemented, but for now I'm just hard-coding things for the demo.
       */
      nextTaskTitle: "NULL",
    }

    return groupToAdd;
  }

  //TODO: ABSTRACT THIS FUNCTION TO A WRAPPER (OR JUST ABSTRACT IT SO IT TAKES IN A FEW PARAMS THAT SWAP OUT AND REMOVE THE RETURN TYPE!)
  async function getGroups(_groupOwner: string) : Promise<Groups.Group[]>{
    try{
      console.log("Getting Groups...");

      const response = await fetch(GroupURL, {
          method : 'GET',
          mode : 'cors',
          headers : {
            groupOwner : _groupOwner
          }
      });

      if(!response.ok){
        throw new Error(`ERROR: STATUS: ${response.status}`);
      }

      const json = await response.json();

      let gotGroups: Groups.Group[] = json.map(parseGroup);

      setGroups([...groups, ...gotGroups])
      return groups;
    }catch (error) {
      console.error("Failed to get groups", error);
      throw new Error("Failed to fetch groups");
    }
  }

  function parseTask(taskToParse: any){
    console.log(taskToParse);
    var taskToAdd : Tasks.Task = {
      title: taskToParse[1],
      id: taskToParse[0],
      description: taskToParse[2],
      
      dueDate: taskToParse[4],
      complete: taskToParse[5]
    }
    return taskToAdd;
  }

  //TODO: REFACTOR THIS TO USE A BACKEND LOOP OF STUFF. THIS WHOLE SECTION BELOW WILL BE TOSSED.
  async function getTasksForGroup(_groupID : Number) : Promise<Number[]>{
    try{
      console.log("Getting GroupTasks...");
      const response = await fetch(GroupTaskURL, {
          method : 'GET',
          mode : 'cors',
          headers : {
            grouptaskgroup : _groupID.toString()
          }
      });
      if(!response.ok){
        throw new Error(`ERROR: STATUS: ${response.status}`);
      }
      const json = await response.json();

      let taskList = [];
      for(const o of json){
        taskList.push(parseTask(o));
      }
      console.log(taskList);


      return json;
    }catch (error) {
      console.error("Failed to get tasks for group", error);
      throw new Error("Failed to fetch tasks for group");
    }
  }

  const remove = async () => {
    //DELETE ALL GROUPS (HEAVY OPS)
    setGroups([]);
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: useThemeColor("backgroundPrimary"),
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    groupsContainer: {
      width: '100%',
      marginTop: 10,
    }
  })
  
  //Return render of groups page
  return (
    <View style={styles.container}>
  
      {/* 🔹 Button Row - Centered with Sort By on the Right */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%", paddingHorizontal: 10, marginBottom: 10 }}>
  
        {/* Smaller Action Buttons - Centered */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          <PillButton icon={"download"} onPress={() => getGroups(User)}  />
          <PillButton icon={"trash"} onPress={remove}  />
        </View>
  
        {/* Sort By Button - Aligned Right */}
        <View style={{ marginLeft: "auto" }}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button mode="contained" onPress={() => setMenuVisible(true)}>
                Sort By
              </Button>
            }
          >
            <Menu.Item onPress={() => setSortBy("name")} title="Name" />
            <Menu.Item onPress={() => setSortBy("date")} title="Date" />
            <Menu.Item onPress={() => setSortBy("size")} title="Size" />
          </Menu>
          {/* 🔹 Group List */}
      <FlatList 
        style={styles.groupsContainer} 
        data={groups}  
        renderItem={({ item }) => <GroupView group={item} id={item.id} />}
        showsHorizontalScrollIndicator={false}
      />
      </View>
      </View>
    </View>
  );
}

