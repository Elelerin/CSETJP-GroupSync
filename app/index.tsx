import { FlatList, View, StyleSheet } from "react-native";
import { useState, useEffect } from 'react';

import * as Tasks from '@/services/tasks'
import PillLink from '@/components/PillLink'
import PillButton from '@/components/PillButton'
import TaskView from "@/components/TaskView";
import Colors from '@/constants/Colors'

export default function Index() {
  const [tasks, setTasks] = useState<Tasks.Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await Tasks.getTasks()
        setTasks(tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }

    fetchTasks();
  }, []);

  const onLoad = async () => {
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
        title: "Hire Minions",
        description: "Consider increating pay and giving them a health plan this time.",
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
      },
    ];

    //Add filler tasks to AsyncStorage
    for (let i = 0; i < fillerTasks.length; ++i) {
      await Tasks.addTask(fillerTasks[i]);
    }

    //Refetch tasks list and update state
    setTasks(await Tasks.getTasks());
  }

  const remove = async () => {
    //Delete all tasks
    await Tasks.clearTasks();
    
    //Refetch tasks list and update state
    setTasks(await Tasks.getTasks());
  }

//Return render of tasks page
  return (
    <View style={styles.container}>
      <PillButton icon={"download"} onPress={onLoad}/>
      <PillButton icon={"delete"} onPress={remove}/>
      <PillLink href={"/newtask"} icon={"add"} />
      <FlatList style={styles.tasksContainer} data={tasks} renderItem={({item}) => <TaskView task={item}/>}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.backgroundPrimary,
    paddingHorizontal: 60,
    paddingVertical: 10,
  },
  tasksContainer: {
    width: '100%'
  }
});