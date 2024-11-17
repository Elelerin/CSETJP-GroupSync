import { Text, View, TextInput, Button, StyleSheet } from "react-native";
import { useState } from 'react';
const customData = require('./customData.json');



export default function Index() {
//INIT STATES
  const[parsedValue, setParsedValue] = useState('');
  const[descValue, setDescValue] = useState ('');
  const[tNameValue, setTNameValue] = useState ('');


//BOILER FUNCTIONS
  function loadTasksFunction(){
    //Load Tasks from File
    const v = JSON.stringify(customData);
    setParsedValue(v);
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

function TaskRow({Name, Date, Creator}){

}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});