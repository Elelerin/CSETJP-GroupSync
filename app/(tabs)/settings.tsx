import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import * as Tasks from "@/services/tasks";
import { View, StyleSheet } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import { useState } from "react";
import { useRouter } from "expo-router";
import ChangePreferencesModal from "@/components/PreferencesModal";

const UserURL =
  "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/User";
// is this unecessary or just unused for now?
const TaskURL =
  "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/TaskFunction";

export default function Settings() {
  //mujtaba late night commit
  const [isModalVisible, setModalVisible] = useState(false); //for change password modal
  const [isPreferencesVisible, setPreferencesVisible] = useState(false); //for preferences modal
  const router = useRouter(); // for logout page

  const handleLogout = () => {
    // reutuns   to the login page
    router.replace("/");
  };
  //end mujtaba late night commit

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text variant="headlineLarge" style={styles.title}>
        Settings
      </Text>

      {/* Buttons */}
      <Card mode="outlined" style={styles.card}>
        <Button
          mode="contained"
          buttonColor={useThemeColor("backgroundSecondary")}
          textColor="white"
          onPress={() => setModalVisible(true)}
        >
          Change Password
        </Button>
      </Card>

      <Card mode="outlined" style={styles.card}>
        <Button
          mode="contained"
          buttonColor={useThemeColor("backgroundSecondary")}
          textColor="white"
          onPress={() => setPreferencesVisible(true)}
        >
          Preferences
        </Button>
      </Card>

      <Card mode="outlined" style={styles.card}>
        <Button
          mode="contained"
          buttonColor={useThemeColor("backgroundSecondary")}
          textColor={useThemeColor("textPrimary")}
          onPress={handleLogout}
        >
          Logout
        </Button>
      </Card>
      <ChangePasswordModal
        visible={isModalVisible}
        onDismiss={() => setModalVisible(false)}
      />

      <ChangePreferencesModal
        visible={isPreferencesVisible} // ✅ Now linked to the Preferences Button
        onDismiss={() => setPreferencesVisible(false)}
      />
    </View>
  );
}

/**
 * Creates and adds a user account.
 * @param _userID Should this be a number?
 */
function registerUser(_userID: string, _username: string, _password: string) {
  return async () => {
    try {
      const response = await fetch(UserURL, {
        method: "POST",
        body: JSON.stringify({
          userID: _userID,
          username: _username,
          pword: _password,
        }),
      });

      if (!response.ok) {
        throw new Error("USER CREATION ERROR");
      }

      const json = response;
      console.log(response);
      return json;
    } catch {}
  };
}

//TEST TASK.
let t: Tasks.Task = {
  id: 0,
  title: "Feed da doro",
  description: "Gotta feed em ",
  dueDate: new Date(1678886400000),
  complete: false,
};

/**
 * Gets a user's account from the database.
 * @param _userID Should this be a number?
 */
function getUser(_userID: string) {
  return async () => {
    try {
      const response = await fetch(UserURL, {
        method: "GET",
        headers: {
          userID: _userID,
        },
      });

      if (!response.ok) {
        throw new Error("User retreival error");
      }

      const json = response;
      console.log(response);
      return json;
    } catch {}
  };
}

/**
 * Gets list of users in database as an array of userIDs
 * Will change to be DISPLAYNAMES, but that's all backend stuff. For now, if this is loaded in
 * then you won't need to change anything when I push it.
 * @param _userID Should this be a number?
 */
function getGroupUsers(groupID: number) {
  return async () => {
    try {
      const response = await fetch(UserURL, {
        method: "GET",
        headers: {
          usergroupgroup: groupID.toString(),
        },
      });

      if (!response.ok) {
        throw new Error("Group Users Retrieval error");
      }

      const json = response;
      console.log(response);
      return json;
    } catch {}
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: useThemeColor("backgroundPrimary"), // Match dark theme
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    color: useThemeColor("textPrimary"),
    marginBottom: 20,
  },
  card: {
    width: "80%",
    marginBottom: 10,
    backgroundColor: "transparent",
    borderColor: useThemeColor("highlight"),
    borderWidth: 2,
    // guarantees the card will conform to the buttons
    borderRadius: 1000,
  },
});
