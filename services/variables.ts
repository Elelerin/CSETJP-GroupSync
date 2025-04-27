import { SetStateAction, useState } from 'react';


export const TaskURL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/TaskFunction";
export const UserURL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/User";
export const [user, setUser] = useState("Testing");