import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Frontend data for each group.
 */
export type Group = {
  id: number,
  title: string,
  description: string,
  numTasks: number,
  hasNextTask: boolean,
  /**
   * Title and due date for the next due task in the group. This will need to be changed once the
   * backend is actually implemented, but for now I'm just hard-coding things for the demo.
   */
  nextTaskTitle: string
}