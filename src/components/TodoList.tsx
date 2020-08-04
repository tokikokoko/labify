import React, { useState, useEffect, FormEvent } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import clsx from 'clsx';
import useInterval from 'use-interval'
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
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
import CircularProgress from '@material-ui/core/CircularProgress';

import { RootState } from '@/store/rootReducer';
import {doneTodo, fetchTodos, Todo} from '@/api/todo';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline',
    },
    loading: {
    },
  }),
);

export interface TodoListProps {
}

export const TodoList = (props: TodoListProps) => {
  const classes = useStyles();
  const dispatch = useDispatch()
  const { loading, todos } = useSelector(
    (state: RootState) => {
      return {
        loading: state.todos.loading,
        todos: state.todos.todos,
      }
    },
    shallowEqual
  );
  useEffect(() => {
    dispatch(fetchTodos());
  }, []);
  useInterval(() => {
    dispatch(fetchTodos());
  }, 30 * 1000);

  const done = async (event: FormEvent) => {
    const rawId = event.currentTarget.getAttribute('todo-id');
    if (typeof rawId === 'string') {
      const id = parseInt(rawId);
      dispatch(doneTodo(id));
    } else {
      console.error('Not id: ', rawId);
    };
  }

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
          primary={`${todo.action_name} by ${todo.author.name}(${todo.author.username})`}
          secondary={
           <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
              {`${todo.body}`}
              </Typography>
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

  const loadingElement = (
    <Container>
      <CircularProgress />
    </Container>
  );

  return (
    <List className={classes.root}>
      { loading ?  loadingElement : itemList }
    </List>
  );
}
