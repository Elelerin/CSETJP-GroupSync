import AsyncStorage from '@react-native-async-storage/async-storage';
import { getIdToken } from "./firebaseAuthService";
export const BASE_API_URL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync";
export const fetchUserTasks = async () => {
  const token = await getIdToken();
  const res = await fetch(`${BASE_API_URL}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return res.json();
};
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