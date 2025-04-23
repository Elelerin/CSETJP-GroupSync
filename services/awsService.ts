import axios from 'axios';
import { auth } from './firebaseConfig';

export const syncUserWithAWS = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const token = await user.getIdToken();
  const uid = user.uid;

  return axios.post(
    "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync",
    { uid },
    {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    }
  );
};
