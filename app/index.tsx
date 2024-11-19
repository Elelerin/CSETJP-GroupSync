import { Text, View, TextInput, Button, StyleSheet } from "react-native";
import { DataTable } from "react-native-paper";
import { useState } from 'react';
const customData = require('./customData.json');



export default function Index() {
//INIT STATES
  const[parsedValue, setParsedValue] = useState('');
  const[descValue, setDescValue] = useState ('');
  const[tNameValue, setTNameValue] = useState ('');


//BOILER FUNCTIONS

  //BOILER PLATE FUNCTION FOR HANDLING INPUT TASK. 
  //REPLACE WITH LOGIC TO HANDLE INPUT SQL STRING.
  function getTaskFunction({inputTask}){
    var toRet = [inputTask["id"], inputTask["name"], inputTask["description"], inputTask["creator"], inputTask["dueDate"]];
    return toRet;
  }


   //Create Table
  function createTable(){

  }

  //Use method created below, custom table thing.
  function appendToTable({tableToAppend, task}){

  }

  function loadTasksFunction(){
    var toParse = customData;

    console.log(toParse.tasks);
    //TODO -- FILTER BY USER
    for(var i = 0; i < customData["tasks"].length; i++){
      var counter = getTaskFunction(customData["tasks"][i]);
      
    }

    //DISPLAY DATA FROM FILE.
    //Draw Table
    var n = createTable();
    for(var k = 0; k < customData["tasks"].length; k++){
      //Append each task to the table.
      appendToTable(null, getTaskFunction(customData["tasks"][k]));
    }

    //Ensure table is drawn

  //TEST DATA BELOW THIS LINE
  //____________________________________
  }


  function saveTaskFunction(){
    //Get info from text boxes
    
    //convert to equivalent SQL / whatever

    //push to server



    //TEST DATA BELOW THIS LINE
    //____________________________________

    console.log(descValue);
    console.log(tNameValue);
  }


//MAKE VIEW / WHATEVER
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      
    <Tasks input = {parsedValue} />
    <Betton onPress = {loadTasksFunction}/>
    <NewTask
      _saveTaskFunction={saveTaskFunction}
      _descValue={descValue}
      _setDescValue={setDescValue}
      _tName={tNameValue}
      _setTName={setTNameValue}
    />
    
    </View>
  )
}

function NewTask({_saveTaskFunction, 
                  _descValue, _setDescValue,
                  _tName, _setTName}){
  return (
    <div>

      <TextInput
        style = {styles.input}
        placeholder="Task Name"
        value = {_tName}
        onChangeText={text => _setTName(text)}
      />

      <TextInput
        style = {styles.input}
        placeholder="Task Desc"
        value = {_descValue}
        onChangeText={text => _setDescValue(text)}
      />

     

      <Button
        title="Save Task"
        onPress = {_saveTaskFunction}
      />
    </div>
  )
}


function Tasks({input}){
  return (
    <Text>
      {input}
    </Text>
  )
}


function Betton({onPress}){
  return(
    <Button
          title="Load Tasks"
          onPress = {onPress}
      />
  )
}

function TaskList({TasksToDisplay}){

}

function TaskRow({id, name, desc, creator, dueDate}){
  //QUESTION: SHOULD WE HAVE A CUSTOM DATA STRUCTURE, AND PASS THAT IN FROM THE MIDDLEWARE, JS, STORE IN BROWSER, ETC? WHAT DO?

  //TODO: CREATE TASK ROW.
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});