import { FlatList, View, StyleSheet } from "react-native";
import { useCallback, useState } from 'react';

import * as Tasks from "@/services/tasks";
import PillButton from '@/components/PillButton'
import TaskView from "@/components/TaskView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useFocusEffect } from "@react-navigation/native";

export default function Index() {
  var selectedTasks = [];
  const [tasks, setTasks] = useState<Tasks.Task[]>([]);
  const fillerTasks = [
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
      description: "No even supervillains mess with the IRS.",
      dueDate: new Date("2025-4-15"),
      complete: false,
    }
  ];

  function onLoad () {
      setTasks(tasks.concat(fillerTasks));
    
  }

  function remove() {
    clearTasks();
  }


  function clearTasks() {
    setTasks([]);
  }

//Return render of tasks page
  return (
    <View style={styles.container}>
      <PillButton icon={"download"} onPress={onLoad}/>
      <PillButton icon={"trash"} onPress={clearTasks}/>
      <FlatList 
        style={styles.tasksContainer} 
        data={tasks} 
        renderItem={({item}) => <TaskView task={item}/>}
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
  tasksContainer: {
    width: '100%',
    marginTop: 10,
  }
});