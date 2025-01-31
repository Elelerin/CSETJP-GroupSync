import React from "react";
import { NativeBaseProvider, Box } from "@chakra-ui/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Import Screens from 'tabs'
import TasksScreen from "./app/tabs/tasks";
import GroupsScreen from "./app/tabs/groups";
import SettingsScreen from "./app/tabs/settings";

// Import Theme (if available)
// import customTheme from "./app/constants/Colors"; // Optional

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NativeBaseProvider theme={customTheme}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: { backgroundColor: "#1A365D" }, // Customize Tab Bar
            tabBarActiveTintColor: "white",
          }}
        >
          <Tab.Screen name="Tasks" component={TasksScreen} />
          <Tab.Screen name="Groups" component={GroupsScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
