import { Stack } from 'expo-router';
import { NavigationContainer } from '@react-navigation/native';

export default function RootLayout() {
  return (
    <NavigationContainer>
      <Stack >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </NavigationContainer>
  );
}
