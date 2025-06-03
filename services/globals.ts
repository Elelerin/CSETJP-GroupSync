import AsyncStorage from "@react-native-async-storage/async-storage";

const Globals = {
  taskURL: "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/TaskFunction",
  userURL: "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/User",
  groupURL: "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/GroupFunction",
  groupTaskURL: "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/groupTasks",
  groupUserURL: "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/groupUser",
  user: async (): Promise<string> => {
    try {
      const value = await AsyncStorage.getItem("user-id");
      if (value !== null) {
        return value;
      }
      console.error("User ID is null!");
      return "";
    }
    catch (e) {
      console.error(`Caught error when getting user ID: ${e}`);
      return "";
    }
  },
  setUser: async (userID: string) => {
    try {
      await AsyncStorage.setItem("user-id", userID);
    }
    catch (e) {
      console.error(`Caught error when setting user ID: ${e}`);
    }
  }
};
export default Globals;

export interface UserAccount {
  displayName: string; // the display name is (eventually) configurable in the settings
  username: string;
  // i'm assuming none of these are required when creating an account
  phoneNumber?: string; // will this be a string or a number internally?
  birthday?: Date;
  pronouns?: string;
  bio?: string;
}