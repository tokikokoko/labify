import { combineReducers } from '@reduxjs/toolkit';
import todosReducer from '@/api/todo';
import settingsReducer from '@/api/setting';
 
const rootReducer = combineReducers({
  todos: todosReducer,
  settings: settingsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;