import React, { useState } from "react";
import * as Tasks from "@/services/tasks";
import { View, StyleSheet, Text } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Card } from "react-native-paper";

type Props = {
  task: Tasks.Task;
  onClick: () => void;
};

export default function TaskView({ task, onClick }: Props) {
  // const [checked, setChecked] = useState(false); ->doesn't seem to be used here

  return (
    <Card mode="contained" style={styles.boxContainer}>
      <Card.Content>
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.textTitle,
              task.complete && {
                textDecorationLine: "line-through",
                opacity: 0.5,
              },
            ]}
          >
            {task.title}
          </Text>

          <Text
            style={[
              styles.textDate,
              task.complete && {
                textDecorationLine: "line-through",
                opacity: 0.5,
              },
            ]}
          >
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </Text>
        </View>
        <View>
          <Text
            style={[
              styles.textDescription,
              task.complete && {
                textDecorationLine: "line-through",
                opacity: 0.5,
              },
            ]}
          >
            {task.description}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  boxContainer: {
    marginVertical: 10,
    width: "70%",
    flex: 1,
    flexDirection: "column",
    alignContent: "flex-start",
    backgroundColor: useThemeColor("backgroundSecondary"),
    borderRadius: 15,
    borderColor: useThemeColor("highlight"),
    borderWidth: 3,
  },
  titleRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 12,
  },
  textDate: {
    color: useThemeColor("textPrimary"),
    fontSize: 20,
  },
  textTitle: {
    color: useThemeColor("textPrimary"),
    fontSize: 24,
  },
  textDescription: {
    color: useThemeColor("textSecondary"),
    fontSize: 20,
  },
});
