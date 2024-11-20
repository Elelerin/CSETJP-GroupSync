import { View, StyleSheet } from 'react-native'

import Colors from '@/constants/Colors'

export default function newTask() {
  return (
    <View style={styles.container}>
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.backgroundPrimary,
    paddingHorizontal: 60,
  },
});