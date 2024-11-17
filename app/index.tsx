import { Text, View, TextInput, Button } from "react-native";
import { useState } from 'react';
const customData = require('./customData.json');



export default function Index() {

  const[parsedValue, setParsedValue] = useState("crittern");

  function cCV(){
    const v = JSON.stringify(customData);
    setParsedValue(v);
  }


  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      
    <Tasks input = {parsedValue} />
    <Betton onPress = {cCV}/>

     
      
    </View>
  )
}

function newTask{
  return (
    <TextInput
      placeholder = "Task Name"
    />
    <TextInput
      placeholder = "Due Date"
    >

    </TextInput>

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

