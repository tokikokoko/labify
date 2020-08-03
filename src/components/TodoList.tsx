import React, { useState, useEffect, FormEvent } from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

import {getTodos, doneTodos, Todo} from '@/api/todo';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline',
    },
  }),
);

const removeTodo = (todos: Array<Todo>, id: number): Array<Todo> => {
  return todos.filter((value) => value.id === id ? false : true);
}

export interface TodoListProps {
}

export const TodoList = (props: TodoListProps) => {
  const classes = useStyles();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const done = async (event: FormEvent) => {
    const rawId = event.currentTarget.getAttribute('todo-id');
    if (typeof rawId === 'string') {
      const id = parseInt(rawId);
      await doneTodos(id);
      setTodos(removeTodo(todos, id));
    } else {
      console.error('Not id: ', rawId);
    };
  }

  useEffect(() => {
    getTodos()
      .then((items) => {
        console.info("Success: ", items);
        setTodos(items);
        setLoading(false);
      });
  }, []);

  const itemContent = (todo: Todo) => {
    return (
      <ListItem alignItems="flex-start" component="a" href={todo.target_url}>
        <ListItemAvatar>
          <Avatar
            alt={`Avatar n°${todo.author.id + 1}`}
            src={todo.author.avatar_url}
          />
        </ListItemAvatar>
        <ListItemText
          primary={todo.action_name}
          secondary={
           <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                {`${todo.author.name}(${todo.author.username})`}
              </Typography>
              {` — ${todo.body}`}
            </React.Fragment>
          }
        >
        </ListItemText>
        <ListItemSecondaryAction>
          <Button onClick={done} variant="contained" color="primary" todo-id={todo.id}>Done</Button>
        </ListItemSecondaryAction>
      </ListItem>
    )
  };

  const itemList = todos.map((todo: Todo, index: number) => {
    return (
      <div key={index}>
        {itemContent(todo)}
      <Divider component="li" />
      </div>
    );
  });

  const loadingElement = (<p>Loading...</p>);

  return (
    <List className={classes.root}>
      { loading ?  loadingElement : itemList }
    </List>
  );
}
