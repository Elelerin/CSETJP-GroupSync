import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Card, Text } from "react-native-paper";

var UserURL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/User"
var TaskURL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/TaskFunction"
export default function Settings() {

  return (
    

    <View style={styles.container}>
      {/* Title */}
      <Text variant="headlineLarge" style={styles.title}>
        Settings
      </Text>

      {/* Buttons */}
      <Card mode="outlined" style={styles.card}>
        <Button
          mode="contained"
          buttonColor={useThemeColor("backgroundSecondary")}
          textColor="white"
          onPress={() => console.log("Change Password")}
        >
          Change Password
        </Button>
      </Card>

      <Card mode="outlined" style={styles.card}>
        <Button
          mode="contained"
          buttonColor={useThemeColor("backgroundSecondary")}
          textColor="white"
          onPress={() => console.log("Preferences")}
        >
          Preferences
        </Button>
      </Card>

      <Card mode="outlined" style={styles.card}>
        <Button mode="contained"
          buttonColor={useThemeColor("backgroundSecondary")}
          textColor={useThemeColor("textPrimary")}
          onPress={() => console.log("Logout")}
        >
          Logout
        </Button>
      </Card>
    </View>

  );
}

function registerUser(_userID, _username, _password){ 
  return async () => {
    try{
      const response = await fetch(UserURL, {
        method : 'POST',
        body: JSON.stringify({
          userID : _userID,
          username : _username,
          pword : _password 
        })
      })

      if(!response.ok){
        throw new Error("USER CREATION ERROR");
      }

      const json = response;
      console.log(response);
      return json;
    }catch{

    }
  }
}

function registerTask(_taskName, _taskDesc, _taskAuthor){ 
  return async () => {
    try{
      const response = await fetch(TaskURL, {
        method : 'POST',
        body: JSON.stringify({
          taskName : _taskName,
          taskDesc : _taskDesc,
          taskAuthor : _taskAuthor
        })
      })

      if(!response.ok){
        throw new Error("USER CREATION ERROR");
      }

      const json = response;
      console.log(response);
      return json;
    }catch{

    }
  }
}

function getUser(_userID){ 
  return async () => {
    try{
      const response = await fetch(UserURL, {
        method : 'GET',
        body: JSON.stringify({
          userID : _userID 
        })
      })

      if(!response.ok){
        throw new Error("User retreival error");
      }

      const json = response;
      console.log(response);
      return json;
    }catch{

    }
  }
}

function getTask(_taskAuthor){
  return async () => {
    try{
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
      .then((json) => console.log(json))

      console.log(response);
      console.log("TEST");
      return response;
    }catch{
        throw "Darn, response retrieval error";
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: useThemeColor("backgroundPrimary"), // Match dark theme
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    color: useThemeColor("textPrimary"),
    marginBottom: 20,
  },
  card: {
    width: "80%",
    marginBottom: 10,
    backgroundColor: "transparent",
    borderColor: useThemeColor("highlight"),
    borderWidth: 2,
    // guarantees the card will conform to the buttons
    borderRadius: 1000
  },
});
