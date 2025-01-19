import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Frontend data for each group.
 */
export type Group = {
  id: number,
  title: string,
  numTasks: number,
  hasNextTask: boolean,
  /**
   * Title and due date for the next due task in the group. This will need to be changed once the
   * backend is actually implemented, but for now I'm just hard-coding things for the demo.
   */
  nextTaskTitle: string,
  nextTaskDueDate: Date
}

export const getGroups = async () => {
  try {
    const readString = await AsyncStorage.getItem('tasks');
    let groups: Group[] = readString ? JSON.parse(readString) : [];
    return groups;
  } catch(error) {
    console.error("Error reading JSON file", error);
    return [];
  }
}

export const addGroup = async (newGroups: Group) => {
  try {
    let groups = await getGroups();
    groups.push(newGroups);
    await AsyncStorage.setItem('tasks', JSON.stringify(groups));
  } catch(error) {
    console.error("Error writing JSON file", error);
  }
}

export const clearGroups = async () => {
  try {
    AsyncStorage.clear()
  } catch(error) {
    console.error("Error clearing storage", error);
  }
}