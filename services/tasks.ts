import AsyncStorage from '@react-native-async-storage/async-storage';
import { SetStateAction, useState } from 'react';
import { createContext } from 'react';

export type Task = {
  id: number,
  title: string,
  description: string,
  dueDate: Date,
  complete: boolean
}
