import { Button, StyleSheet, Text, View } from 'react-native';
import PillButton from '@/components/PillButton'

var url = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/User"
export default function Settings() {

  return (
    

    <View style={styles.container}>
      <Text>Hello world!</Text>
      <PillButton icon="key" onPress={registerUser("doro", "dororo", "dorororo")}/>
    </View>

  );
}

function registerUser(_userID, _username, _password){ 
  return async () => {
    try{
      const response = await fetch(url, {
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

  function getUser(_userID){ 
    return async () => {
      try{
        const response = await fetch(url, {
          method : 'POST',
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});