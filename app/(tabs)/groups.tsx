import { FlatList, View, StyleSheet } from "react-native";
import { useCallback, useState } from 'react';

import * as Groups from '@/services/groups'
import PillButton from '@/components/PillButton'
import GroupView from "@/components/GroupView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useFocusEffect } from "@react-navigation/native";

const User = 'doro';
const GroupTaskURL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/groupTasks"
var TaskURL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/TaskFunction"
const GroupURL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/GroupFunction"
export default function Index() {
  const [groups, setGroups] = useState<Groups.Group[]>([]);

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
        throw new Error("ERROR: STATUS: ${response.status}");
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
        throw new Error("ERROR: STATUS: ${response.status}");
      }
      const json = await response.json();
      console.log(json);
      return json;
    }catch (error) {
      console.error("Failed to get tasks for group", error);
      throw new Error("Failed to fetch tasks for group");
    }
  }
  async function getListOfGroupTasks(_groupList : Number[]) : Promise<Number[]>{
    try{
      
      
      console.log("Getting Set of Tasks...");
      const response = await fetch(TaskURL, {
          method : 'GET',
          mode : 'cors',
          headers : {
            taskID : JSON.stringify(_groupList)
          }
      });
      if(!response.ok){
        throw new Error("ERROR: STATUS: ${response.status}");
      }
      const json = await response.json();
      return json;
    }catch (error) {
      console.error("Failed to get groups", error);
      throw new Error("Failed to fetch groups");
    }
  }

  const remove = async () => {
    //DELETE ALL GROUPS (HEAVY OPS)
    setGroups([]);
  }

  //Return render of groups page
  return (
    <View style={styles.container}>
      <PillButton icon={"download"} onPress={() => getGroups(User)}/>
      <PillButton icon={"trash"} onPress={remove}/>
      <PillButton icon={"download"} onPress={() => getTasksForGroup(2)}/>
      <PillButton icon={"download"} onPress={() => getTasksForGroup(2).then((groupTasks) => getListOfGroupTasks(groupTasks))}/>
      <FlatList 
        style={styles.groupsContainer} 
        data={groups} 
        renderItem={({item}) => <GroupView group={item} id={item.id}/>}
        showsHorizontalScrollIndicator={false}/>
    </View>
  )
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
});