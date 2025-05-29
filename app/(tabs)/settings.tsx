import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import Globals from "@/services/globals";
import { View, StyleSheet } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import { useState } from "react";
import { useRouter } from "expo-router";
import ChangePreferencesModal from "@/components/PreferencesModal";
import MultiStyledText, {
  MultiStyledTextDivider,
  MultiStyledTextItem,
} from "@/components/MultiStyledText";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { syncUserToDatabase } from "@/services/registerUser";

interface AccountInfo {
  displayName: string; // the display name is (eventually) configurable in the settings
  username: string;
  // i'm assuming none of these are required when creating an account
  phoneNumber?: string; // will this be a string or a number internally?
  birthday?: Date;
  pronouns?: string;
  description?: string;
}

export default function Settings() {
  const [isModalVisible, setModalVisible] = useState(false); // for change password modal
  const [isPreferencesVisible, setPreferencesVisible] = useState(false); // for preferences modal

  const [userData, setUserData] = useState<AccountInfo | null>({
    displayName: "Joe Williams",
    username: "JustASideQuestNPC",
    pronouns: "he/him",
    phoneNumber: "(314) 159-2653",
    birthday: new Date("1/1/1970"),
    description:
      "Software engineering student at Oregon Tech. Occasionally writes code.",
  });
  const router = useRouter(); // for logout page
  const handleLogout = () => {
    // returns to the login page
    router.replace("/");
  };

  //button for syncing
  const handleSync = () => {};
  useFocusEffect(
    useCallback(() => {
      const fetchUsers = async () => {
        getUser(Globals.user());
      };

      fetchUsers();

      return () => console.log("Screen is unfocused!"); // Cleanup if needed
    }, [])
  );

  // create an element for the sub line
  let subLineContent: (MultiStyledTextItem | MultiStyledTextDivider)[] = [];
  if (userData && userData.pronouns && userData.pronouns !== "") {
    subLineContent.push({
      type: "text",
      content: userData.pronouns,
      style: infoStyles.subLineInfo,
    });
  }
  if (userData && userData.birthday) {
    subLineContent.push({
      type: "text",
      content: userData?.birthday?.toLocaleDateString() || "",
      style: infoStyles.subLineInfo,
    });
  }
  if (userData && userData.phoneNumber && userData.phoneNumber !== "") {
    subLineContent.push({
      type: "text",
      content: userData.phoneNumber,
      style: infoStyles.subLineInfo,
    });
  }
  if (subLineContent.length > 0) {
    const divider: MultiStyledTextDivider = {
      type: "divider",
      width: 2,
      color: useThemeColor("highlight"),
      margin: 5,
    };
    subLineContent = subLineContent.flatMap((i) => [divider, i]).slice(1);
  }

  return (
    <View style={containerStyles.page}>
      <View style={containerStyles.info}>
        <View style={infoStyles.container}>
          {userData && (
            <Text style={infoStyles.displayName}>{userData.displayName}</Text>
          )}
          {userData && (
            <Text style={infoStyles.username}>@{userData.username}</Text>
          )}
          <MultiStyledText
            content={subLineContent}
            topLevelStyle={infoStyles.subLine}
          />
          {userData && userData.description != null ? (
            <Text style={infoStyles.bioText}>{userData.description}</Text>
          ) : null}
        </View>
      </View>
      <View style={containerStyles.settings}>
        {/* Title */}
        <Text variant="headlineLarge" style={settingsStyles.title}>
          Settings
        </Text>

        {/* Buttons */}
        <Card mode="outlined" style={settingsStyles.card}>
          <Button
            mode="contained"
            buttonColor={useThemeColor("backgroundSecondary")}
            textColor="white"
            onPress={() => setModalVisible(true)}
          >
            Change Password
          </Button>
        </Card>

        <Card mode="outlined" style={settingsStyles.card}>
          <Button
            mode="contained"
            buttonColor={useThemeColor("backgroundSecondary")}
            textColor="white"
            onPress={() => setPreferencesVisible(true)}
          >
            Preferences
          </Button>
        </Card>

        <Card mode="outlined" style={settingsStyles.card}>
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
        <Card mode="outlined" style={settingsStyles.card}>
          <Button
            mode="contained"
            buttonColor={useThemeColor("backgroundSecondary")}
            textColor={useThemeColor("textPrimary")}
            onPress={handleSync}
            // onPress={syncUserToDatabase(userData)}?
            //for now pointing to empty function
          >
            Sync
          </Button>
        </Card>
        <ChangePreferencesModal
          visible={isPreferencesVisible}
          onDismiss={() => setPreferencesVisible(false)}
        />
      </View>
    </View>
  );

  /**
   * Gets a user's account from the database.
   */
  function getUser(_userID: string) {
    return async () => {
      try {
        console.log(`Getting ${_userID}`);
        const response = await fetch(Globals.userURL, {
          method: "GET",
          mode: "cors",
          headers: {
            userID: _userID,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();
        console.log("API response:", json);
        const mappedAccount: AccountInfo = {
          displayName: json.displayName || "Joe Williams", // Fallback to default if not present
          username: json.userID || "JustASideQuestNPC",
          pronouns: json.pronouns || "he/him",
          phoneNumber: json.phoneNumber || "(314) 159-2653",
          birthday: json.birthday
            ? new Date(json.birthday)
            : new Date("1/1/1970"),
          description:
            json.description ||
            "Software engineering student at Oregon Tech. Occasionally writes code.",
        };
        setUserData(mappedAccount);
        console.log(mappedAccount);
        return mappedAccount;
      } catch (err: any) {
        console.error("Error fetching userData:", err.message || err);
      }
    };
  }
}

/**
 * Creates and adds a user account.
 * @param _userID Should this be a number?
 */
function registerUser(_userID: string, _username: string, _password: string) {
  return async () => {
    try {
      const response = await fetch(Globals.userURL, {
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

/**
 * Gets list of users in database as an array of userIDs
 * Will change to be DISPLAYNAMES, but that's all backend stuff. For now, if this is loaded in
 * then you won't need to change anything when I push it.
 * @param _userID Should this be a number?
 */
function getGroupUsers(groupID: number) {
  return async () => {
    try {
      const response = await fetch(Globals.userURL, {
        method: "GET",
        headers: {
          usergroupgroup: groupID.toString(),
        },
      });

      if (!response.ok) {
        throw new Error("Group Users Retrieval error");
      }

      const json = response;
      console.log(json);
      return json;
    } catch {}
  };
}

const containerStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: useThemeColor("backgroundPrimary"), // Match dark theme
    flexDirection: "row",
  },
  info: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    paddingVertical: 20,
    paddingLeft: 55,
    paddingRight: 35,
  },
  settings: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

const infoStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: useThemeColor("backgroundSecondary"),
    borderWidth: 3,
    borderRadius: 15,
    borderColor: useThemeColor("highlight"),
  },

  displayName: {
    color: useThemeColor("textPrimary"),
    fontSize: 60,
    lineHeight: 66,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginTop: 0,
    marginBottom: 7,
    borderBottomWidth: 2,
    borderBottomColor: useThemeColor("highlight"),
  },
  username: {
    color: useThemeColor("textSecondary"),
    fontSize: 20,
    alignSelf: "flex-start",
    marginBottom: 7,
    paddingBottom: 7,
    borderBottomWidth: 2,
    borderBottomColor: useThemeColor("highlight"),
  },
  bioText: {
    color: useThemeColor("textPrimary"),
    fontSize: 18,
    marginBottom: 8,
  },

  // pronouns, birthday, and/or phone number
  subLine: {
    alignSelf: "flex-start",
    marginBottom: 7,
    paddingBottom: 7,
    borderBottomWidth: 2,
    borderBottomColor: useThemeColor("highlight"),
  },
  subLineInfo: {
    color: useThemeColor("textSecondary"),
    fontSize: 20,
  },
});

const settingsStyles = StyleSheet.create({
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
