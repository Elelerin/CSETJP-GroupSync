import { FlatList, View, StyleSheet } from "react-native";
import { useCallback, useState } from 'react';

import * as Groups from '@/services/groups'
import PillButton from '@/components/PillButton'
import GroupView from "@/components/GroupView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useFocusEffect } from "@react-navigation/native";

const User = 'doro';
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

      let groups: Groups.Group[] = json.map(parseGroup);

      setGroups([...groups, ...groups]);
    } catch (error) {
      console.error("Darn, response retrieval error", error);
      throw new Error("Failed to fetch groups");
    }

  }


  const onLoad = async () => {
    await getGroups(User);
    //Refetch groups list and update state
    setGroups(await Groups.getGroups());
  }

  const remove = async () => {
    //Delete all groups
    await Groups.clearGroups();
    
    //Refetch groups list and update state
    setGroups(await Groups.getGroups());
  }

  //Return render of groups page
  return (
    <View style={styles.container}>
      <PillButton icon={"download"} onPress={() => getGroups(User)}/>
      <PillButton icon={"trash"} onPress={remove}/>
      <FlatList 
        style={styles.groupsContainer} 
        data={groups} 
        renderItem={({item}) => <GroupView group={item}/>}
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