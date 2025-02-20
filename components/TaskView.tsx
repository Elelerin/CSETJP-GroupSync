import { View, StyleSheet, Text } from 'react-native'

import * as Tasks from '@/services/tasks'
import { useThemeColor } from '@/hooks/useThemeColor';
import { Card } from 'react-native-paper';
import React, { useState } from 'react';
import { Checkbox } from 'react-native-paper';

type Props = {
  task: Tasks.Task,
  onClick: ()=>void
};

export default function TaskView({task, onClick}: Props) {
  const [checked, setChecked] = useState(false);

  return (
    <Card mode="contained" style={styles.taskViewContainer}>
      <Card.Content>
        <View style ={styles.titleRow}>
          <Checkbox status={checked ? 'checked' : 'unchecked'}
              onPress={onClick}
            />
          <Text style={styles.textTitle}>{task.title}</Text>
          <Text style={styles.textDate}>Due: {new Date(task.dueDate).toLocaleDateString()}</Text>
        </View>
        <View> 
          <Text style={styles.textDescription}>{task.description}</Text>
        </View>
      </Card.Content>
    </Card>
  )
}

const styles = StyleSheet.create({
  taskViewContainer: {
    marginVertical: 10,
    width: '100%'
  },
  boxContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: useThemeColor("highlight"),
    borderRadius: 15,
    borderColor: useThemeColor("highlight"),
    borderWidth: 3,
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
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
    color:useThemeColor("textSecondary"),
    fontSize: 20,
  }
});