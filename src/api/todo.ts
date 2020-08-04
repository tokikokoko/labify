import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '@/store/store';
import { notify } from '@/common/notification';
import { callApi, getURL } from '@/request';
import { Settings } from '@/api/setting';

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
      todos
        .filter((value) => !existTodo(state, value))
        .map((value) => {
          return value;
        })
        .map((value) => notifyTodo(value));
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

export const fetchTodos = (settings: Settings): AppThunk => async dispatch => {
  dispatch(getTodosStart())
  const todos = await getTodos(settings);
  dispatch(getTodosSuccess({ todos: todos }));
};

export const doneTodo = (settings: Settings, id: number): AppThunk => async dispatch => {
  await doneTodos(settings, id);
  dispatch(removeTodo(id));
};

const existTodo = (state: TodosState, todo: Todo): boolean => {
  const found = state.todos.find((value) => value.id == todo.id);
  return found != undefined
}

const notifyTodo = async (todo: Todo) => {
  notify(
    `${todo.action_name} by ${todo.author.name}(${todo.author.username})`,
    todo.body,
    todo.author.avatar_url,
  );
}

// Api
export const getTodos = async (settings: Settings): Promise<Array<Todo>> => {
  let items: Array<Todo> = [];
  try {
    let res = await callGetTodosApi(settings, null);
    console.log("DEBUG: ", res);
    let body: Array<Todo> = await res.json();
    items = items.concat(body);
    while (res.headers.get("x-next-page")) {
      const nextPage = res.headers.get("x-next-page");
      res = await callGetTodosApi(settings, nextPage);
      body = await res.json();
      items = items.concat(body);
    }
  } catch {
    console.log("DEBUG: err");
    items = [];
  }
  return items;
}

export const doneTodos = async (settings: Settings, id: number): Promise<Todo> => {
  const url = await getURL(settings, `/todos/${id}/mark_as_done`);
  const req = new Request(url.toString(), {
    method: "post",
    mode: "cors",
  });
  let res = await callApi(settings, req);
  let body: Todo = await res.json();
  return body;
}

const callGetTodosApi = async (settings: Settings, page: string | null): Promise<Response> => {
  const url = await getURL(settings, '/todos');
  if (typeof page === 'string') {
    url.searchParams.append('page', page);
  }
  const req = new Request(url.toString(), {
    method: "get",
    mode: "cors",
  });

  let res = await callApi(settings, req);
  return res;
}