import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '@/store/store';
import {callApi, getURL} from '@/request';

export interface Todo {
  id: number,
  action_name: string,
  body: string,
  state: string,
  target_url: string,
  author: {
    id: number,
    name: string,
    username: string,
    avatar_url: string,
    web_url: string,
  },
  project: {
    id: string,
    name: string,
  },
  target: {
  },
}

// Redux
type TodosState = {
  todos: Todo[]
  loading: boolean
};

const initialState: TodosState = {
  todos: [],
  loading: false,
};

interface TodoLoaded {
  todos: Todo[]
};

const todos = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    getTodosStart(state) {
      state.loading = true;
    },
    getTodosSuccess(state: TodosState, action: PayloadAction<TodoLoaded>) {
      const { todos } = action.payload;
      state.todos = todos;
      state.loading = false;
    },
    removeTodo(state: TodosState, action: PayloadAction<Number>) {
      const id = action.payload;
      state.todos = state.todos.filter((value) => value.id === id ? false : true);
    },
  }
});

export const {
  getTodosStart,
  getTodosSuccess,
  removeTodo,
} = todos.actions;
export default todos.reducer;

export const fetchTodos = (): AppThunk => async dispatch => {
  dispatch(getTodosStart())
  const todos = await getTodos();
  dispatch(getTodosSuccess({ todos: todos }));
};

export const doneTodo = (id: number): AppThunk => async dispatch => {
  await doneTodos(id);
  dispatch(removeTodo(id));
};

// Api
export const getTodos = async (): Promise<Array<Todo>> => {
  let items: Array<Todo> = [];
  let res = await callGetTodosApi(null);
  let body: Array<Todo> = await res.json();
  items = items.concat(body);
  while (res.headers.get("x-next-page")) {
    const nextPage = res.headers.get("x-next-page");
    res = await callGetTodosApi(nextPage);
    body = await res.json();
    items = items.concat(body);
  }
  return items;
}

export const doneTodos = async (id: number): Promise<Todo> => {
  const url = await getURL(`/todos/${id}/mark_as_done`);
  const req = new Request(url.toString(), {
    method: "post",
    mode: "cors",
  });
  let res = await callApi(req);
  let body: Todo = await res.json();
  return body;
}

const callGetTodosApi = async (page: string | null): Promise<Response> => {
  const url = await getURL('/todos');
  if (typeof page === 'string') {
    url.searchParams.append('page', page);
  }
  const req = new Request(url.toString(), {
    method: "get",
    mode: "cors",
  });

  let res = await callApi(req);
  return res;
}