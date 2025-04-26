import { useThemeColor } from '@/hooks/useThemeColor';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Provider as PaperProvider } from 'react-native-paper'; 

export default function TabLayout() {
  return (
    <PaperProvider> 
      <Tabs screenOptions={{
        headerStyle: {
          backgroundColor: useThemeColor("backgroundSecondary"),
        },
        headerShadowVisible: false,
        headerTintColor: useThemeColor("textPrimary"),
        tabBarActiveTintColor: useThemeColor("highlight"),
        tabBarActiveBackgroundColor: useThemeColor("backgroundSecondary"),
        tabBarInactiveBackgroundColor: useThemeColor("backgroundPrimary")
      }}>
        <Tabs.Screen
          name="groups"
          options={{
            title: 'Groups',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="group" color={color} />,
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: 'Tasks',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="list" color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
          }}
        />
      </Tabs>
     </PaperProvider>  
  );
}