import AsyncStorage from '@react-native-async-storage/async-storage';

export type Task = {
  id: number,
  title: string,
  description: string,
  dueDate: Date,
  complete: boolean
}

export const getTasks = async () => {
  try {
    const readString = await AsyncStorage.getItem('tasks');
    let tasks: Task[] = readString ? JSON.parse(readString) : [];
    return tasks;
  } catch(error) {
    console.error("Error reading JSON file", error);
    return [];
  }

}

export const addTask = async (newTask: Task) => {
  try {
    let tasks = await getTasks();
    tasks.push(newTask);
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  } catch(error) {
    console.error("Error writing JSON file", error);
  }
}

export const clearTasks = async () => {
  try {
    AsyncStorage.clear()
  } catch(error) {
    console.error("Error clearing storage", error);
  }
}