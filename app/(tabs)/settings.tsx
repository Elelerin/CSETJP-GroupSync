import { Button, StyleSheet, Text, View } from 'react-native';
import PillButton from '@/components/PillButton'


export default function Settings() {

  return (
    

    <View style={styles.container}>
      <Text>Hello world!</Text>
      <PillButton icon="key" onPress={registerUser("doro", "dororo", "dorororo")}/>
    </View>

  );
}

function registerUser(userID, username, password){
  return async () => {
    try{
      const response = await fetch(url, {
      method : 'POST',
      headers: {
      },
      body : JSON.stringify({
        'userID' : userID,
        'username' : username,
        'pword' : password 
      })
      })

      if(!response.ok){
        throw new Error("USER CREATION ERROR");
      }

      const json = await response.json();
      console.log(json);
      return json;
    }catch{
      throw new Error("GENERAL ERROR USER CREATION");
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