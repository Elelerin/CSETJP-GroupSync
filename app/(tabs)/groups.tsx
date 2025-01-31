import { FlatList, View, StyleSheet } from "react-native";
import { useCallback, useState } from 'react';

import * as Groups from '@/services/groups'
import PillButton from '@/components/PillButton'
import GroupView from "@/components/GroupView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useFocusEffect } from "@react-navigation/native";

export default function Index() {
  const [groups, setGroups] = useState<Groups.Group[]>([]);

  

  const onLoad = async () => {
    const fillerGroups: Groups.Group[] = [
      {
        id: 0,
        title: "Interesting Group Name",
        numTasks: 69,
        hasNextTask: true,
        // eventually these will get pulled for the backend, but until that happens i'm just
        // hard-coding them for the demo
        nextTaskTitle: "Water plants",
        nextTaskDueDate: new Date("2024-11-26")
      },
      // {
      //   id: 1,
      //   title: "Interesting Group Name 2: Electric Boogaloo",
      //   numTasks: 420,
      //   hasNextTask: false
      // }
    ];

    //Add filler groups to AsyncStorage
    for (let i = 0; i < fillerGroups.length; ++i) {
      await Groups.addGroup(fillerGroups[i]);
    }

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
      <PillButton icon={"download"} onPress={onLoad}/>
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