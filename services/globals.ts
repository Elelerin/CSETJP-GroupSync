const Globals = {
    taskURL: "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/TaskFunction",
    userURL: "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/User",
    groupURL: "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/GroupFunction",
    groupTaskURL: "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/groupTasks",
    groupUserURL: "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/groupUser",
    user: "Testing"
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