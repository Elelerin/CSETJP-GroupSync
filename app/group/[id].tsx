import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Card, IconButton, PaperProvider } from "react-native-paper";
import * as Tasks from '@/services/tasks'
import TaskView from "@/components/TaskView";
import { Dropdown } from "react-native-paper-dropdown";

// temporary, will be replaced later
interface User {
  name: string
}

export default function GroupHome() {
  const { id } = useLocalSearchParams();

  // eventually this will be populated with the actual users, but for now i just need a demo
  const users: User[] = [
    {
      name: "Dave"
    },
    {
      name: "Bob"
    },
    {
      name: "Glornax the Destroyer"
    }
  ];

  const tasks: Tasks.Task[] = [
    {
      id: 1,
      title: "Water plants",
      description: "Water the plants in the foyer. The spider plant needs two cups of water.",
      dueDate: new Date("2024-11-26"),
      complete: false,
    },
    {
      id: 2,
      title: "Buy holiday gifts",
      description: "Peter wants a novelty spoon. Maria wants a go kart. Chet wants a portrait of his dog.",
      dueDate: new Date("2024-12-17"),
      complete: false,
    },
    {
      id: 3,
      title: "Hire minions",
      description: "Consider increasing pay and giving them a health plan this time.",
      dueDate: new Date("2025-1-18"),
      complete: false,
    },
    {
      id: 4,
      title: "Find lair location",
      description: "A volcano island looks cool and even includes its own natural power source.",
      dueDate: new Date("2025-3-31"),
      complete: false,
    },
    {
      id: 5,
      title: "Pay taxes",
      description: "Not even supervillains mess with the IRS.",
      dueDate: new Date("2025-4-15"),
      complete: false,
    },
    {
      id: 6,
      title: "Water plants",
      description: "Water the plants in the foyer. The spider plant needs two cups of water.",
      dueDate: new Date("2024-11-26"),
      complete: false,
    },
    {
      id: 7,
      title: "Buy holiday gifts",
      description: "Peter wants a novelty spoon. Maria wants a go kart. Chet wants a portrait of his dog.",
      dueDate: new Date("2024-12-17"),
      complete: false,
    },
    {
      id: 8,
      title: "Hire minions",
      description: "Consider increasing pay and giving them a health plan this time.",
      dueDate: new Date("2025-1-18"),
      complete: false,
    },
    {
      id: 9,
      title: "Find lair location",
      description: "A volcano island looks cool and even includes its own natural power source.",
      dueDate: new Date("2025-3-31"),
      complete: false,
    },
    {
      id: 0,
      title: "Pay taxes",
      description: "Not even supervillains mess with the IRS.",
      dueDate: new Date("2025-4-15"),
      complete: false,
    },
  ];

  return (
    <View style={styles.pageContainer}>
      <View style={styles.upperColumnContainer}>
        <Card mode="contained" style={styles.titleCard}>
          <Text style={styles.textTitle}>Group {id} name</Text>
        </Card>
        <View style={styles.filtersCard}>
          <PaperProvider>
            <View style={{ margin: 16, justifyContent: "flex-start" }}>
              <Dropdown
                label="Sort By"
                options={[
                  { label: "None", value: "none" },
                  { label: "Name", value: "name" },
                  { label: "Creation Date", value: "created" },
                  { label: "Due Date", value: "due" },
                ]}
                value="none"
              />
            </View>
          </PaperProvider>
          <IconButton
            icon="sort-ascending"
          />
        </View>
      </View>
      <View style={styles.lowerColumnContainer}>
        <Card mode="contained" style={styles.usersCard}>
          <Card.Content>
            <Text style={styles.textSubtitle}>Users</Text>
            <FlatList
              data={users}
              renderItem={({item}) => <Text style={styles.textContent}>{item.name}</Text>}
              showsHorizontalScrollIndicator={false}/>
          </Card.Content>
        </Card>
        <View style={styles.tasksContainer}>
          <FlatList
            data={tasks} 
            renderItem={({item}) => <TaskView task={item}/>}
            showsHorizontalScrollIndicator={false}/>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: useThemeColor("backgroundPrimary"),
    paddingHorizontal: 30,
    paddingTop: 20
  },
  upperColumnContainer: {
    flexDirection: "row",
    backgroundColor: useThemeColor("backgroundPrimary"),
    zIndex: 5
  },
  lowerColumnContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: useThemeColor("backgroundPrimary"),
  },
  titleCard: {
    backgroundColor: useThemeColor("backgroundSecondary"),
    borderRadius: 15,
    borderColor: useThemeColor("highlight"),
    borderWidth: 3,
    marginRight: 10,
    paddingHorizontal: 20,
    paddingBottom: 10,
    width: "30%",
  },
  filtersCard: {
    backgroundColor: useThemeColor("backgroundSecondary"),
    borderRadius: 15,
    borderColor: useThemeColor("highlight"),
    borderWidth: 3,
    flexGrow: 1,
    paddingHorizontal: 20,
    flexDirection: "row-reverse",
  },
  usersCard: {
    backgroundColor: useThemeColor("backgroundSecondary"),
    borderRadius: 15,
    borderColor: useThemeColor("highlight"),
    borderWidth: 3,
    width: "30%",
    alignSelf: "flex-start",
    position: "sticky",
    top: 20,
    marginTop: 9
  },
  tasksContainer: {
    flex: 1,
    flexDirection: "column",
    paddingLeft: 10,
  },
  textTitle: {
    color: useThemeColor("textPrimary"),
    fontWeight: 600,
    fontSize: 48
  },
  textSubtitle: {
    color: useThemeColor("textPrimary"),
    fontWeight: 600,
    fontSize: 36,
    marginBottom: 5
  },
  textContent: {
    color: useThemeColor("textSecondary"),
    fontSize: 28,
  }
});