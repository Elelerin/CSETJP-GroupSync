import { Stack } from 'expo-router';

import Colors from '@/constants/Colors'
import { NavigationContainer } from '@react-navigation/native';

export default function RootLayout() {
  return (
    <NavigationContainer>
      <Stack screenOptions={{
        headerStyle: {
          backgroundColor: Colors.backgroundSecondary,
        },
        headerShadowVisible: false,
        headerTintColor: Colors.textPrimary,
      }}>
        <Stack.Screen name="index" options={{ title: "Tasks" }} />
        <Stack.Screen name="newtask" options={{ title: "New Task" }} />
      </Stack>
    </NavigationContainer>
  );
}
