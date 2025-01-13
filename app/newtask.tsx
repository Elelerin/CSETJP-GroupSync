import { View, StyleSheet, TextInput, Text } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router'

import { useThemeColor } from '@/hooks/useThemeColor';
import PillButton from '@/components/PillButton';
import * as Tasks from '@/services/tasks';

export default function newTask() {
  const [newTask, setNewTask] = useState<Tasks.Task>({
    title: '',
    id: 0,
    description: '',
    dueDate: new Date(),
    complete: false,
  });
  
  const setTitle = (title : string) => {
    let task = newTask;

    task.title = title;
    setNewTask(task);
  }

  const setDescription = (description : string) => {
    let task = newTask;

    task.description = description;
    setNewTask(task);
  }

  const setDate = (date : string) => {
    let task = newTask;

    task.dueDate = new Date(date);
    setNewTask(task);
  }

  const addTask = async () => {
    let tasks = await Tasks.getTasks();
    newTask.id = tasks.length + 1;

    Tasks.addTask(newTask);

    router.back();
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Title</Text>
        <TextInput style={styles.input} onChangeText={setTitle}/>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Due Date</Text>
        <TextInput style={styles.input} onChangeText={setDate}/>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Description</Text>
        <TextInput style={styles.input} onChangeText={setDescription}/>
      </View>
      <PillButton icon="add" onPress={addTask} />
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
  inputLabel: {
    fontSize: 20,
    color: useThemeColor("textSecondary"),
    marginBottom: 5,
  },
  inputContainer: {
    width: '100%',
    marginVertical: 10,
  },
  input: {
    color: useThemeColor("textPrimary"),
    backgroundColor: useThemeColor("backgroundSecondary"),
    width: '100%',
    fontSize: 20,
    borderColor: useThemeColor("highlight"),
    borderWidth: 4,
    borderRadius: 8,
    padding: 8,
  }
});