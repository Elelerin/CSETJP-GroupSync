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

  function parseGroup(groupToParse: any){
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
    console.log(groupToAdd);
  
    return groupToAdd;
  }

  function getGroups(_groupOwner: string){
    var toReturn = "ERROR";
    return async () => {
      try{
        console.log("Trying");
        
        const response = await fetch(GroupURL, {
          method : 'GET',
          headers : {
            groupOwner : _groupOwner
          }
        }).then((response) => {
          const reader = response.body.getReader();
          return new ReadableStream({
            start(controller){
              return pump();
              function pump(){
                return reader.read().then(({done, value}) =>{
                  if(done){
                    controller.close();
                    return;
                  }
                  controller.enqueue(value);
                  return pump();
                })
              }
            }
          })
        })
        .then((stream) => new Response(stream))
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          for(var i = 0; i < json.length; i++){
            Groups.addGroup(parseGroup(json[i]));
          }
        });
        setGroups(await Groups.getGroups());
        
        return toReturn;
      }catch{
          throw "Darn, response retrieval error";
      }
    }
  }


  const onLoad = async () => {
    getGroups(User);
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
      <PillButton icon={"download"} onPress={getGroups(User)}/>
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