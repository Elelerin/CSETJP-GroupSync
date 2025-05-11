import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useState } from "react";
import { Modal, View, StyleSheet, Text } from "react-native";
import { IconButton, TextInput, Button, MD3DarkTheme, Icon, PaperProvider } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";

interface Props {
  modalVisible: boolean,
  setModalVisible: (visible: boolean) => void,
  account: UserAccount,
  onSubmission: (newAccountInfo: UserAccount) => void;
}

interface UserAccount {
  displayName: string; // the display name is (eventually) configurable in the settings
  username: string;
  phoneNumber?: string;
  birthday?: Date;
  pronouns?: string;
  description?: string;
}

export default function ChangeAccountInfoModal({
  modalVisible, setModalVisible, account, onSubmission }: Props
) {
  const [dateSelectorOpen, setDateSelectorOpen] = useState(false);
  const [countryCode, setCountryCode] = useState("US");

  const [displayName, setDisplayName] = useState(account.displayName);
  const [phoneNumber, setPhoneNumber] = useState(account.phoneNumber);
  const [birthday, setBirthday] = useState(account.birthday);
  const [pronouns, setPronouns] = useState(account.pronouns);
  const [description, setBio] = useState(account.description);

  const onDateSelectorDismiss = React.useCallback(() => {
      setDateSelectorOpen(false);
    }, [setDateSelectorOpen]);
  
    const onDateSelectorConfirm = React.useCallback(
      (params: { date: CalendarDate }) => {
        setDateSelectorOpen(false);
        setBirthday(params.date);
      },
      [setDateSelectorOpen, setBirthday]
    );

  // for limiting the date selector
  const today = new Date();

  return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}>
        <PaperProvider theme={paperTheme}>
          <View style={styles.centeredView}>
            <View style={styles.container}>
              {/* display name */}
              <View style={styles.inputContainer}>
                <TextInput
                  label="Display Name"
                  defaultValue={account.displayName}
                  style={styles.displayNameInput}
                  onChangeText={setDisplayName}
                  textColor={useThemeColor("textPrimary")}
                  theme={paperTheme}
                />
              </View>

              {/* date selection button + pronouns input */}
              <View style={styles.dateButtonContainer}>
                <Button
                  onPress={() => setDateSelectorOpen(true)}
                  theme={paperTheme}
                >
                  <View style={{ marginVertical: 0, alignItems: "center", flexDirection: "row" }}>
                    <Icon source={"calendar-clock"} size={24} color={useThemeColor("textPrimary")} />
                    <Text style={styles.dateButtonText}>
                      {birthday ? birthday.toLocaleDateString() : "Add a birthday"}
                    </Text>
                  </View>
                </Button>
                <IconButton
                  icon={"close"}
                  style={{ marginHorizontal: 0, paddingVertical: 0, marginVertical: 0, }}
                  iconColor={useThemeColor("textSecondary")}
                  theme={paperTheme}
                  size={24}
                  onPress={() => setBirthday(undefined)}
                />
              </View>

              {/* date selection modal */}
              { dateSelectorOpen &&
                <DatePickerModal
                  locale="en"
                  mode="single"
                  label="Birthday"
                  visible={dateSelectorOpen}
                  date={birthday}
                  validRange={{ endDate: today }}
                  onDismiss={onDateSelectorDismiss}
                  onConfirm={onDateSelectorConfirm}
                />
              }

              {/* pronouns */}
              <View style={styles.inputContainer}>
                <TextInput
                  label="Pronouns"
                  defaultValue={account.pronouns || ""}
                  style={styles.pronounsInput}
                  onChangeText={setPronouns}
                  textColor={useThemeColor("textPrimary")}
                  theme={paperTheme}
                />
              </View>

              {/* phone number (currently disabled) */}
              {/* <View style={styles.inputContainer}>
                <PhoneNumberInput
                  code={countryCode}
                  setCode={setCountryCode}
                  phoneNumber={phoneNumber}
                  setPhoneNumber={setPhoneNumber}
                  limitMaxLength={true}
                  theme={{
                    ...MD3DarkTheme, // use the default theme for anything we don't override
                    colors: {
                      ...MD3DarkTheme.colors,
                      primary: '#a548e2',
                      secondary: '#ffffff',
                      // onSecondary: '#ffffff',
                      surfaceVariant: '#202020',
                      // surface: '#202020',
                      // onSurface: '#c3c3c3'
                    }
                  }}
                />
              </View> */}

              {/* bio */}
              <View style={styles.inputContainer}>
                <TextInput
                  label="description"
                  defaultValue={account.description || ""}
                  style={styles.bioInput}
                  onChangeText={setBio}
                  textColor={useThemeColor("textPrimary")}
                  // multiline={true}
                  // numberOfLines={4}
                  theme={paperTheme}
                />
              </View>

              {/* submit/close buttons */}
              <View style={{ flexDirection: "row" }}>
                <IconButton
                  icon={"close"}
                  iconColor={useThemeColor("highlight")}
                  theme={paperTheme}
                  size={36}
                  onPress={() => setModalVisible(false)}
                />
                <IconButton
                  icon={"check"}
                  iconColor={useThemeColor("highlight")}
                  theme={paperTheme}
                  size={36}
                  onPress={() => {
                    onSubmission({
                      username: account.username, // this never changes and will just fall through
                      // fallback to displaying the username
                      displayName: displayName.length > 0 ? displayName : account.username,
                      phoneNumber: phoneNumber,
                      birthday: birthday,
                      pronouns: pronouns,
                      description: description
                    });
                    setModalVisible(false);
                  }}
                />
              </View>
            </View>
          </View>
        </PaperProvider>
      </Modal>
  );
}

/**
 * Required to make react native paper work. TL;DR, paper uses themes for most of its colors, and
 * there's no good way to make it use stylesheets instead. Themes seem like they could be better
 * for colors than stylesheets, so we may want to refactor in the future.
 */
const paperTheme = {
    ...MD3DarkTheme, // use the default theme for anything we don't override
    colors: {
      ...MD3DarkTheme.colors,
      primary: '#a548e2',
      secondary: '#ffffff',
      onSecondary: '#ffffff',
      surfaceVariant: '#c3c3c3',
      surface: '#202020',
      onSurface: '#c3c3c3'
    }
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: useThemeColor("backgroundSecondary"),
    borderWidth: 3,
    borderRadius: 15,
    borderColor: useThemeColor("highlight"),
    margin: 20,
    // padding: 20,
    // alignItems: 'center',
    elevation: 5,
    flexDirection: "column",
    minWidth: 500
  },
  textTitle: {
    color: useThemeColor("textPrimary"),
    fontWeight: 600,
    fontSize: 36,
    marginBottom: -10
  },
  inputContainer: {
    backgroundColor: useThemeColor("backgroundSecondary"),
    marginVertical: 10,
    width: "100%",
    minHeight: 50,
    textAlignVertical: "top"
  },
  displayNameInput: {
    paddingHorizontal: 0,
    backgroundColor: "transparent",
    fontSize: 24,
    fontWeight: 400,
  },
  pronounsInput: {
    paddingHorizontal: 0,
    backgroundColor: "transparent",
    fontSize: 16,
    fontWeight: 400,
  },
  bioInput: {
    paddingHorizontal: 0,
    backgroundColor: useThemeColor("backgroundSecondary"),
    fontSize: 16,
    fontWeight: 400,
  },
  datePicker: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: "transparent",
    paddingHorizontal: 0
  },
  dateButtonContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    // marginVertical: 10,
    alignContent: "flex-start",
    justifyContent: "center",
    alignSelf: "flex-start",
    borderColor: useThemeColor("highlight"),
    borderWidth: 2,
    borderRadius: 30,
  },
  dateButtonText: {
    fontSize: 16,
    fontWeight: 400,
    marginLeft: 10,
    marginVertical: 0,
    color: useThemeColor("textPrimary")
  },
  phoneInput: {
    paddingHorizontal: 0,
    backgroundColor: "transparent",
    fontSize: 16,
    fontWeight: 400,
  }
});
