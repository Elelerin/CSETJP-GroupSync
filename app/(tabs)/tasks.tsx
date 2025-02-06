import { FlatList, View, StyleSheet } from "react-native";
import { useCallback, useState } from 'react';

import * as Tasks from "@/services/tasks";
import PillButton from '@/components/PillButton'
import {TaskView}  from "@/components/TaskView";
import { useThemeColor } from "@/hooks/useThemeColor";


export default function Index() {
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [tasks, setTasks] = useState<Tasks.Task[]>([]);

  var User = 'doro';
  const TaskURL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/TaskFunction"

  //TODO: Remove nested 'then' chain-hell. 
  
  const onLoad = async () => {
    getTasks(User);
    setTasks(await Tasks.getTasks());
  }


  function clearTasks() {
    setTasks([]);
  }

  function parseTask(taskToParse: any){
    console.log(taskToParse);
    var taskToAdd = {
      title: taskToParse[1],
      id: taskToParse[0],
      description: taskToParse[2],
      
      dueDate: taskToParse[4],
      complete: taskToParse[5]
    }
    console.log(taskToAdd);
  
    return taskToAdd;
  }

  function getTasks(_taskAuthor: string){
    var toReturn = "ERROR";
    return async () => {
      try{
        console.log("Trying");
        
        const response = await fetch(TaskURL, {
          method : 'GET',
          mode : 'cors',
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
          let toPushBack : Tasks.Task[] = [];
          for(var i = 0; i < json.length; i++){
             toPushBack.push(parseTask(json[i]));
          }

          setTasks(tasks.concat(toPushBack));
        });
        console.log(tasks);
        return toReturn;
      }catch{
          throw "Darn, response retrieval error";
      }
    }
  }
  

//Return render of tasks page
  return (
    <View style={styles.container}>
      <PillButton icon={"download"} onPress={getTasks(User)}/>
      <PillButton icon={"trash"} onPress={clearTasks}/>
      <FlatList 
        style={styles.tasksContainer} 
        data={tasks} 
        renderItem={({item}) => <TaskView task={item} 
          onClick={() =>{
            if(!selectedTasks.includes(item.id)){
              setSelectedTasks(selectedTasks.concat(item.id));
            }if(selectedTasks.includes(item.id)){
              setSelectedTasks(selectedTasks.splice(selectedTasks.indexOf(item.id), 1));
            }
            
            console.log(selectedTasks);
          }}
        />}
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

function addToSelectedList(item: Tasks.Task): Tasks.Task {
  throw new Error("Function not implemented.");
}
