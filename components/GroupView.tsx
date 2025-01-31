import { View, StyleSheet, Text, Pressable } from "react-native"

import * as Groups from "@/services/groups"
import { useThemeColor } from "@/hooks/useThemeColor";
import { Link } from "expo-router";
import { Card } from "react-native-paper";

type Props = {
  group: Groups.Group
};

export default function GroupView({ group }: Props) {
  return (
    <Card mode="contained" style={styles.groupViewContainer}>
      <Card.Content>
        <Link href={{
          pathname: "/group/[id]",
          params: { id: group.id }
        }}>
          {/* these views are for alignment and deliberately have no styles attached to them */}
          <View>
            <Text style={styles.textTitle}>{group.title}</Text>
            <Text style={styles.textNumTasks}>{group.numTasks} Tasks</Text>
          </View>

          <View style={styles.verticalDivider}></View>

          <View>
            <View style={styles.nextTaskRow}>
              <Text style={styles.textNextTaskSecondary}>Next Task: </Text>
              <Text style={styles.textNextTaskPrimary}>{group.nextTaskTitle}</Text>
            </View>
            <View style={styles.nextTaskRow}>
              <Text style={styles.textNextTaskSecondary}>Due: </Text>
              <Text style={styles.textNextTaskPrimary}>
                {new Date(group.nextTaskDueDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </Link>
      </Card.Content>
    </Card>
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
    borderRadius: 15
  },

  // also contains the number of tasks
  textTitle: {
    color: useThemeColor("textPrimary"),
    fontSize: 28
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
    fontSize: 20
  },
  textNextTaskSecondary: {
    color: useThemeColor("textSecondary"),
    fontSize: 20
  },

  verticalDivider: {
    height: "100%",
    minWidth: 2,
    backgroundColor: useThemeColor("highlight"),
    marginLeft: 20,
    marginRight: 20,

    // borderLeftWidth: 2,
    // borderLeftColor: useThemeColor("highlight")
  }
});