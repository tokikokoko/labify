import getConfig from '@/config';
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