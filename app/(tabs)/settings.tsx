import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useEffect } from "react";
import * as Tasks from "@/services/tasks";
import { View, StyleSheet } from "react-native";
import { Button, Card, IconButton, Text } from "react-native-paper";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import { useState } from "react";
import { useRouter } from "expo-router";
import ChangePreferencesModal from "@/components/PreferencesModal";
import { logoutUser } from "@/services/firebaseAuthService";
import MultiStyledText, {
  MultiStyledTextDivider,
  MultiStyledTextItem,
} from "@/components/MultiStyledText";
import ChangeAccountInfoModal from "@/components/ChangeAccountInfoModal";

const router = useRouter();

const UserURL =
  "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/User";
// is this unecessary or just unused for now?
const TaskURL =
  "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/TaskFunction";

interface UserAccount {
  displayName: string; // the display name is (eventually) configurable in the settings
  username: string;
  // i'm assuming none of these are required when creating an account
  phoneNumber?: string; // will this be a string or a number internally?
  birthday?: Date;
  pronouns?: string;
  bio?: string;
}

// needs to be outside the function because react be like that
const subLineDivider: MultiStyledTextDivider = {
  type: "divider",
  width: 2,
  color: useThemeColor("highlight"),
  margin: 5,
};

function getSubLineContent(account: UserAccount): (MultiStyledTextItem | MultiStyledTextDivider)[] {
  let content: (MultiStyledTextItem | MultiStyledTextDivider)[] = [];

  if (account.pronouns && account.pronouns !== "") {
    content.push({
      type: "text",
      content: account.pronouns,
      style: infoStyles.subLineInfo,
    });
  }
  if (account.birthday) {
    content.push({
      type: "text",
      content: account.birthday.toLocaleDateString(),
      style: infoStyles.subLineInfo,
    });
  }
  if (account.phoneNumber && account.phoneNumber !== "") {
    content.push({
      type: "text",
      content: account.phoneNumber,
      style: infoStyles.subLineInfo,
    });
  }
  if (content.length > 0) {
    content = content.flatMap((i) => [subLineDivider, i]).slice(1);
  }

  return content;
}

const dummyAccount = {
  displayName: "Joe Williams",
  username: "JustASideQuestNPC",
  pronouns: "he/him",
  phoneNumber: "(314) 159-2653",
  birthday: new Date("4/20/1969"),
  bio: (
    "Software engineering student and president of D&D club at Oregon Tech. Plays too much " +
    "Titanfall and occasionally writes code."
  ),
};

export default function Settings() {
  const [infoModalVisible, setInfoModalVisible] = useState(false); // for account info modal
  const [isModalVisible, setModalVisible] = useState(false); // for change password modal
  const [isPreferencesVisible, setPreferencesVisible] = useState(false); // for preferences modal
  const router = useRouter(); // for logout page

  const handleLogout = async () => {
    await logoutUser(); // Firebase signOut
    router.replace("/");
  };

  // TODO: make this pull from the database
  let accountData: UserAccount = dummyAccount;

  // required because react is a PERFECT library with NO FLAWS WHATSOEVER
  const [accountDisplayName, setAccountDisplayName] = useState(accountData.displayName);
  const [subLineContent, setSubLineContent] = useState(getSubLineContent(accountData));
  const [accountBio, setAccountBio] = useState(accountData.bio);

  return (
    <View style={containerStyles.page}>
      <ChangeAccountInfoModal
        modalVisible={infoModalVisible}
        setModalVisible={setInfoModalVisible}
        account={accountData}
        onSubmission={(newAccountInfo: UserAccount) => {
          accountData = newAccountInfo;
          setAccountDisplayName(accountData.displayName);
          setSubLineContent(getSubLineContent(accountData));
          setAccountBio(accountData.bio);
        }}
      />

      <View style={containerStyles.info}>
        <IconButton
          icon={"pencil"}
          iconColor={useThemeColor("textSecondary")}
          size={36}
          onPress={() => { setInfoModalVisible(true); }}
        />
        <View style={infoStyles.container}>
          <Text style={infoStyles.displayName}>{accountDisplayName}</Text>
          <Text style={infoStyles.username}>@{accountData.username}</Text>
          <MultiStyledText
            content={subLineContent}
            topLevelStyle={infoStyles.subLine}
          />
          {accountBio != null && accountBio != "" ? (
            <Text style={infoStyles.bioText}>{accountData.bio}</Text>
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

        <ChangePreferencesModal
          visible={isPreferencesVisible} // ✅ Now linked to the Preferences Button
          onDismiss={() => setPreferencesVisible(false)}
        />
      </View>
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
    fontSize: 50,
    lineHeight: 55,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginTop: 3,
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
