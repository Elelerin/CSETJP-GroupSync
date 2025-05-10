import { View, StyleSheet, Text } from "react-native";
import * as Groups from "@/services/groups";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Link } from "expo-router";
import { Card, IconButton } from "react-native-paper";
import AddUserModal from "@/components/AddUserModal";
import { useState } from "react";

type Props = {
  group: Groups.Group;
  id: Number;
};
export default function GroupView({ group }: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddUser = (userData: { name: string; role: string }) => {
    console.log(
      `Add user ${userData.name} to group ${group.id} as ${userData.role}`
    );
    setModalVisible(false);
  };
  return (
    <>
      <Card mode="contained" style={styles.groupViewContainer}>
        <Card.Content>
          <Link
            href={{
              pathname: "/group/[id]",
              params: { id: group.id },
            }}
          >
            <View>
              <Text style={styles.textTitle}>{group.title}</Text>
              <Text style={styles.textNumTasks}>{group.numTasks} Tasks</Text>
            </View>

            <View style={styles.verticalDivider}></View>

            <View>
              <View style={styles.nextTaskRow}>
                <Text style={styles.textNextTaskSecondary}>Next Task: </Text>
                <Text style={styles.textNextTaskPrimary}>
                  {group.nextTaskTitle}
                </Text>
              </View>
              <View style={styles.nextTaskRow}>
                <Text style={styles.textNextTaskSecondary}>Due: </Text>
                <Text style={styles.textNextTaskPrimary}>
                  {new Date(group.nextTaskDueDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </Link>

          <IconButton
            icon="account-plus"
            size={24}
            onPress={() => setModalVisible(true)}
            style={{ position: "absolute", top: 10, right: 10 }}
          />
        </Card.Content>
      </Card>

      <AddUserModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        onAddUser={handleAddUser}
      />
    </>
  );
}

const styles = StyleSheet.create({
  groupViewContainer: {
    marginVertical: 10,
    width: "100%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: useThemeColor("backgroundSecondary"),
    borderColor: useThemeColor("highlight"),
    borderWidth: 3,
    borderRadius: 15,
  },

  // also contains the number of tasks
  textTitle: {
    color: useThemeColor("textPrimary"),
    fontSize: 28,
  },
  textNumTasks: {
    color: useThemeColor("textSecondary"),
    fontSize: 20,
  },

  nextTaskRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "baseline",
  },

  // used multiple times in the next task row
  textNextTaskPrimary: {
    color: useThemeColor("textPrimary"),
    fontSize: 20,
  },
  textNextTaskSecondary: {
    color: useThemeColor("textSecondary"),
    fontSize: 20,
  },

  verticalDivider: {
    height: "100%",
    minWidth: 2,
    backgroundColor: useThemeColor("highlight"),
    marginLeft: 20,
    marginRight: 20,

    // borderLeftWidth: 2,
    // borderLeftColor: useThemeColor("highlight")
  },
});
