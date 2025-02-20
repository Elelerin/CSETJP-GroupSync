import { FlatList, View, StyleSheet } from "react-native";
import { useState } from 'react';

import * as Tasks from "@/services/tasks";
import PillButton from '@/components/PillButton'
import TaskView from "@/components/TaskView";
import { useThemeColor } from "@/hooks/useThemeColor";
import TaskCreationModal from "@/components/TaskCreationModal";
import { Menu, Button } from "react-native-paper";

export default function Index() {
  const [selectedTasks, setSelectedTasks] = useState<Number[]>([]);
  const [tasks, setTasks] = useState<Tasks.Task[]>([]);
  //sort by button
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("name");
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const User = 'doro';
  const TaskURL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/TaskFunction"

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === "name") return a.title.localeCompare(b.title);
    if (sortBy === "date") return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    if (sortBy === "size") return (a.description?.length || 0) - (b.description?.length || 0);
    return 0;
  });

  const onLoad = async () => {
    getTasks(User);
    setTasks(await Tasks.getTasks()); // typescript says this doesn't exist??
  }

  function clearTasks() {
    setTasks([]);
  }
  
  /**
   * Converts a task's database entry to a useable object
   * @param taskToParse What type is this?
   */
  function parseTask(taskToParse: any) {
    console.log(taskToParse);
    const taskToAdd = {
      title: taskToParse[1],
      id: taskToParse[0],
      description: taskToParse[2],
      
      dueDate: taskToParse[4],
      complete: taskToParse[5]
    }
    console.log(taskToAdd);
  
    return taskToAdd;
  }

  function getTasks(_taskAuthor: string) {
    const toReturn = "ERROR";
    return async () => {
      try{
        console.log("Trying");
        
        // why is all of this unused?
        const response = await fetch(TaskURL, {
          method: 'GET',
          mode: 'cors',
          headers: {
            taskAuthor: _taskAuthor
          }
        }).then((response) => {
          
          if (!response.body) {
            throw new Error("Response body is null");
          }
          const reader = response.body.getReader();
          return new ReadableStream({
            start(controller){
              return pump();
              function pump(): Promise<void> {
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
      } catch{ 
          throw "Darn, response retrieval error";
      }
    };
  }
  

//Return render of tasks page
  return (
    <View style={styles.container}>
      {/* task creation modal - this is invisible until the button is clicked */}
      <TaskCreationModal modalVisible={modalVisible} setModalVisible={setModalVisible}/>
      
      {/* everything else */}
      <View style={styles.listContainer}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <PillButton icon={"download"} onPress={getTasks(User)} />
          <PillButton icon={"trash"} onPress={clearTasks} />
          <PillButton icon={"newItem"} onPress={()=>{setModalVisible(true)}} />
        </View>
  
        {/* sorting menu */}
        <View style={{ marginLeft: "auto" }}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button mode="contained" onPress={()=>{setModalVisible(true);}}>
                Sort By
              </Button>
            }
          >
            <Menu.Item onPress={() => setSortBy("name")} title="Name" />
            <Menu.Item onPress={() => setSortBy("date")} title="Date" />
            <Menu.Item onPress={() => setSortBy("size")} title="Size" />
          </Menu>
        </View>
      </View>
 
      {/* main task list */}
      <FlatList 
        style={styles.tasksContainer} 
        data={sortedTasks}  
        renderItem={({ item }) => (
          <TaskView 
            task={item} 
            onClick={() => {
              if (!selectedTasks.includes(item.id)) {
                setSelectedTasks([...selectedTasks, item.id]);
              } else {
                setSelectedTasks(selectedTasks.filter(taskId => taskId !== item.id));
              }
              console.log(selectedTasks);
            }}
          />
        )}
        showsHorizontalScrollIndicator={false}
      />
  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: useThemeColor("backgroundPrimary"),
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  listContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 10
  },
  tasksContainer: {
    width: '100%',
    marginTop: 10,
  }
});

function addToSelectedList(item: Tasks.Task): Tasks.Task {
  throw new Error("Function not implemented.");
}
