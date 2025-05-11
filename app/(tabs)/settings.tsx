import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import Globals from "@/services/globals";
import { View, StyleSheet } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import { useState } from "react";
import { useRouter } from "expo-router";
import ChangePreferencesModal from "@/components/PreferencesModal";
import MultiStyledText, { MultiStyledTextDivider, MultiStyledTextItem } from "@/components/MultiStyledText";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import ChangeAccountInfoModal from "@/components/ChangeAccountInfoModal";

interface AccountInfo {
  displayName: string, // the display name is (eventually) configurable in the settings
  username: string,
  // i'm assuming none of these are required when creating an account
  phoneNumber?: string, // will this be a string or a number internally?
  birthday?: Date,
  pronouns?: string,
  description?: string
}

export default function Settings() {
  const [isModalVisible, setModalVisible] = useState(false); // for change password modal
  const [isPreferencesVisible, setPreferencesVisible] = useState(false); // for preferences modal
  const [infoEditorVisible, setInfoEditorVisible] = useState(false);
  
  const [userData, setUserData] = useState<AccountInfo>({
    displayName: "Joe Williams",
    username: "JustASideQuestNPC",
    pronouns: "he/him",
    phoneNumber: "(314) 159-2653",
    birthday: new Date("4/20/1969"),
    description: "Software engineering student and president of D&D club at Oregon Tech. Plays too much Titanfall and occasionally writes code."
  });
  const router = useRouter(); // for logout page
  const handleLogout = () => {
    // returns to the login page
    router.replace("/");
  };

  useFocusEffect(
    useCallback(() => {
      const fetchUsers = async () => {
          console.log("getting users...");
          await getUser(Globals.user())();
      };

      fetchUsers();

      return () => console.log("Screen is unfocused!"); // Cleanup if needed
    }, [])
  );

  // create an element for the sub line
  const highlightColor = useThemeColor("highlight"); // required because react is react
  let buffer: (MultiStyledTextItem|MultiStyledTextDivider)[] = [];
  if (userData.pronouns && userData.pronouns !== "") {
    buffer.push({
      type: "text",
      content: userData.pronouns,
      style: infoStyles.subLineInfo
    });
  }
  if (userData.birthday) {
    buffer.push({
      type: "text",
      content: userData.birthday.toLocaleDateString(),
      style: infoStyles.subLineInfo
    });
  }
  if (userData.phoneNumber && userData.phoneNumber !== "") {
    buffer.push({
      type: "text",
      content: userData.phoneNumber,
      style: infoStyles.subLineInfo
    });
  }
  if (buffer.length > 0) {
    const divider: MultiStyledTextDivider = {
      type: "divider",
      width: 2,
      color: highlightColor,
      margin: 5,
    };
    buffer = buffer.flatMap((i) => [divider, i]).slice(1);
  }
  const [subLineContent, setSubLineContent] = useState(buffer);

  return (
    <View style={containerStyles.page}>
      <View style={containerStyles.info}>
        <Card mode="outlined" style={infoStyles.editButton}>
          <Button
            mode="contained"
            buttonColor={useThemeColor("backgroundSecondary")}
            textColor={useThemeColor("textPrimary")}
            onPress={() => setInfoEditorVisible(true)}
          >
            Edit
          </Button>
        </Card>
        <View style={infoStyles.container}>
          <Text style={infoStyles.displayName}>{userData.displayName}</Text>
          <Text style={infoStyles.username}>@{userData.username}</Text>
          <MultiStyledText content={subLineContent} topLevelStyle={infoStyles.subLine} />
          {userData.description != null ?
            <Text style={infoStyles.bioText}>{userData.description}</Text> : null
          }
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

        <ChangePreferencesModal
          visible={isPreferencesVisible}
          onDismiss={() => setPreferencesVisible(false)}
        />
      </View>
      <ChangeAccountInfoModal
        modalVisible={infoEditorVisible}
        setModalVisible={setInfoEditorVisible}
        account={userData}
        // this is called whenever the confirm button is pressed to close the modal, and gets passed
        // the updated account info from the modal's input fields
        onSubmission={(newUserData: AccountInfo) => {
          // newUserData will *always* be correctly updated
          console.log(
            `newUserData: {\n` +
            `  displayName: "${newUserData.displayName}"\n` +
            `  pronouns: "${newUserData.pronouns}\n` +
            `  birthday: ${newUserData.birthday}\n` +
            `  description: ${newUserData.description}\n` +
            `}`
          );
          // this has to be done with a callback function because react is dumb
          setUserData(prevUser => ({
            // carries over any properties that don't get set in here, which is just the username
            ...prevUser,

            // displayName and description always update immediately when the modal closes
            displayName: newUserData.displayName,
            description: newUserData.description,

            // birthday and pronouns don't update when the modal changes, but opening and closing
            // the modal again (even without changing anything) will make them update. if you check
            // the browser console you can see that userData hasn't been updated, so i'm pretty
            // sure it's a logic error and not a ui error
            birthday: newUserData.birthday,
            pronouns: newUserData.pronouns,
            
            // currently unused
            phoneNumber: newUserData.phoneNumber,
          }));
          console.log(
            `userData: {\n` +
            `  displayName: "${userData.displayName}"\n` +
            `  pronouns: "${userData.pronouns}\n"` +
            `  birthday: ${userData.birthday}\n` +
            `  description: "${userData.description}"\n` +
            `}`
          );

          // update sub line - everything after this seems fine at this point
          buffer = [];
          if (userData.pronouns && userData.pronouns !== "") {
            buffer.push({
              type: "text",
              content: userData.pronouns,
              style: infoStyles.subLineInfo
            });
          }
          if (userData.birthday) {
            buffer.push({
              type: "text",
              content: userData.birthday.toLocaleDateString(),
              style: infoStyles.subLineInfo
            });
          }
          if (userData.phoneNumber && userData.phoneNumber !== "") {
            buffer.push({
              type: "text",
              content: userData.phoneNumber,
              style: infoStyles.subLineInfo
            });
          }
          if (buffer.length > 0) {
            const divider: MultiStyledTextDivider = {
              type: "divider",
              width: 2,
              color: highlightColor,
              margin: 5,
            };
            buffer = buffer.flatMap((i) => [divider, i]).slice(1);
            console.log(buffer);
          }
          setSubLineContent(buffer);
        }}
      />
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
        method: 'GET',
        mode: "cors",
        headers: {
          'userID': _userID,
          'Content-Type': 'application/json'

        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();
      console.log("API response:", json);
      const mappedAccount: AccountInfo = {
        displayName: json.displayName || "Joe Williams",  // Fallback to default if not present
        username: json.userID || "JustASideQuestNPC",
        pronouns: json.pronouns || "he/him",
        phoneNumber: json.phoneNumber || "(314) 159-2653",
        birthday: json.birthday ? new Date(json.birthday) : new Date("4/20/1969"),
        description: json.description || "Software engineering student and president of D&D club at Oregon Tech. Plays too much Titanfall and occasionally writes code."
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
    flexDirection: "row"
  },
  info: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    paddingVertical: 20,
    paddingLeft: 55,
    paddingRight: 35
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
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: useThemeColor("highlight")
  },
  username: {
    color: useThemeColor("textSecondary"),
    fontSize: 20,
    alignSelf: "flex-start",
    marginBottom: 7,
    paddingBottom: 7,
    borderBottomWidth: 2,
    borderBottomColor: useThemeColor("highlight")
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
    borderBottomColor: useThemeColor("highlight")
  },
  subLineInfo: {
    color: useThemeColor("textSecondary"),
    fontSize: 20
  },

  editButton: {
    marginBottom: 10,
    backgroundColor: "transparent",
    borderColor: useThemeColor("highlight"),
    borderWidth: 2,
    // guarantees the card will conform to the buttons
    borderRadius: 1000,
    alignSelf: "flex-start",
    fontSize: 20
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