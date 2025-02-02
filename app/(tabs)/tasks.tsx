import { FlatList, View, StyleSheet } from "react-native";
import { useCallback, useState } from 'react';

import * as Tasks from '@/services/tasks'
import PillButton from '@/components/PillButton'
import TaskView from "@/components/TaskView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useFocusEffect } from "@react-navigation/native";

var User = 'doro';
const TaskURL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/TaskFunction"

//TODO: Remove nested 'then' chain-hell. 
function getTasks(_taskAuthor: string){
  var toReturn = "ERROR";
  return async () => {
    try{
      console.log("Trying");
      
      const response = await fetch(TaskURL, {
        method : 'GET',
        headers : {
        taskAuthor : _taskAuthor
        }
      }).then((response) => {
        const reader = response.body.getReader();
        return new ReadableStream({
          start(controller){
            return pump();
            function pump(){
              return reader.read().then(({done, value}) =>{
                if(done){
                  controller.close();
                  return;
                }
                controller.enqueue(value);
                return pump();
              })
            }
          }
        })
      })
      .then((stream) => new Response(stream))
      .then((response) => response.json())
      .then((json) => {
        for(var i = 0; i < json.length; i++){
          console.log(json[i]);
          Tasks.addTask(parseTask(json[i]));
        }
      });
      console.log("Successful Response");
      return toReturn;
    }catch{
        throw "Darn, response retrieval error";
    }
  }
}


function parseTask(taskToParse: any){
  var taskToAdd = {
    title: taskToParse[1],
    id: taskToParse[0],
    description: taskToParse[2],

    //TODO: PARSE DATE PROPERLY
    dueDate: taskToParse[4],
    complete: taskToParse[5]
  }
  console.log(taskToAdd);

  return taskToAdd;
}


export default function Index() {
  const [tasks, setTasks] = useState<Tasks.Task[]>([]);
  const onLoad = async () => {
    getTasks(User);
    setTasks(await Tasks.getTasks());
  }

  const remove = async () => {
    //Delete all tasks
    await Tasks.clearTasks();
    
    //Refetch tasks list and update state
    setTasks(await Tasks.getTasks());
  }

//Return render of tasks page
  return (
    <View style={styles.container}>
      <PillButton icon={"download"} onPress={getTasks(User)}/>
      <PillButton icon={"trash"} onPress={remove}/>
      <FlatList 
        style={styles.tasksContainer} 
        data={tasks} 
        renderItem={({item}) => <TaskView task={item}/>}
        showsHorizontalScrollIndicator={false}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: useThemeColor("backgroundPrimary"),
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  tasksContainer: {
    width: '100%',
    marginTop: 10,
  }
});