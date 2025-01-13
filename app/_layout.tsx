import { Stack } from 'expo-router';

import { useThemeColor } from '@/hooks/useThemeColor';
import { NavigationContainer } from '@react-navigation/native';

export default function RootLayout() {
  return (
    <NavigationContainer>
      <Stack screenOptions={{
        headerStyle: {
          backgroundColor: useThemeColor("backgroundSecondary"),
        },
        headerShadowVisible: false,
        headerTintColor: useThemeColor("textPrimary"),
      }}>
        <Stack.Screen name="index" options={{ title: "Tasks" }} />
        <Stack.Screen name="newtask" options={{ title: "New Task" }} />
      </Stack>
    </NavigationContainer>
  );
}
