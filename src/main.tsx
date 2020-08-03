import React, { FC, useState } from 'react';
import * as ReactDOM from 'react-dom';
import Container from '@material-ui/core/Container';
import {Sidebar} from '@/components/Sidebar';
import { createMuiTheme, createStyles, makeStyles, useTheme, Theme, ThemeProvider} from '@material-ui/core/styles';
import { deepOrange } from "@material-ui/core/colors";
import {TodoList} from '@/components/TodoList';
import '@/css/default.css';

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
          <Sidebar name="My Counter for TypeScript">
            <TodoList />
          </Sidebar>
        </Container>
      </ThemeProvider>
    </div>
  );
}

ReactDOM.render(<App/>, document.querySelector('#app'));