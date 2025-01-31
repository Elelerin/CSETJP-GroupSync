import { Button, StyleSheet, Text, View } from 'react-native';
import PillButton from '@/components/PillButton'
import { PureComponent } from 'react';

var UserURL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/User"
var TaskURL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/TaskFunction"
export default function Settings() {

  return (
    

    <View style={styles.container}>
      <Text>Hello world!</Text>
      <PillButton icon="key" onPress={registerUser("doro", "doro", "I<3DORO")}/>
      <PillButton icon="key" onPress={registerTask("doro", "doro", "doro")}/>
      <PillButton icon="key" onPress={getTask("doro")}/>
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});