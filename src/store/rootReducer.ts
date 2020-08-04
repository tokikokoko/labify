import { combineReducers } from '@reduxjs/toolkit';
import todosReducer from '@/api/todo';
 
const rootReducer = combineReducers({
  todos: todosReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;