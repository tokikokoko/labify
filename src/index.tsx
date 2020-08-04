import React, { FC, useState } from 'react';
import * as ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import Container from '@material-ui/core/Container';
import {Sidebar} from '@/components/Sidebar';
import { createMuiTheme, createStyles, makeStyles, useTheme, Theme, ThemeProvider} from '@material-ui/core/styles';
import { deepOrange } from "@material-ui/core/colors";
import {TodoList} from '@/components/TodoList';
import { SettingsView } from '@/components/SettingsView';
import '@/css/default.css';

import { Provider } from 'react-redux';
import store from '@/store/store';

const theme = createMuiTheme({
  palette: {
    primary: deepOrange,
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Noto Sans JP',
      'sans-serif',
    ].join(','),
  },
});

export const App: FC = () => {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Container>
          <BrowserRouter>
            <Switch>
              <Sidebar name="My Counter for TypeScript">
                <Route path="/" exact>
                  <TodoList />
                </Route>
                <Route path="/settings" exact>
                  <SettingsView />
                </Route>
                <Route exact>
                  <Redirect to="/" />
                </Route>
              </Sidebar>
            </Switch>
          </BrowserRouter>
        </Container>
      </ThemeProvider>
    </div>
  );
}

ReactDOM.render(
  (
    <Provider store={store}>
      <App/>
    </Provider>
  ),
  document.querySelector('#app')
);