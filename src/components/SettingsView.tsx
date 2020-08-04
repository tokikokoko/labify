import React, { useState, useEffect, FormEvent } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import clsx from 'clsx';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { RootState } from '@/store/rootReducer';
import { Settings, saveSettings } from '@/api/setting';

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

interface SettingsProps {};

const defaultvalue: Settings = {
  hostname: 'gitlab.com',
  apiBasePath: '/api/v4',
  gitlabToken: '',
};

export const SettingsView = (props: SettingsProps) => {
  const classes = useStyles();
  const dispatch = useDispatch()
  const { settings } = useSelector(
    (state: RootState) => {
      return {
        settings: state.settings.settings,
      }
    },
    shallowEqual
  );

  const [hostname, setHostname] = useState(settings.hostname);
  const [apiBasePath, setApiBasePath] = useState(settings.apiBasePath);
  const [gitlabToken, setGitlabToken] = useState(settings.gitlabToken);

  const changeHostname = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setHostname(event.currentTarget.value);
  };
  const changeApiBasePath = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setApiBasePath(event.currentTarget.value);
  };
  const changeGitlabToken = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setGitlabToken(event.currentTarget.value);
  };

  const submit = (event: FormEvent) => {
    console.log("DEBUG: ", hostname, apiBasePath, gitlabToken);
    dispatch(saveSettings({ hostname, apiBasePath, gitlabToken }));
  };

  return (
    <Container>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField required id="hostname" label="Hostname" defaultValue={settings.hostname} onChange={changeHostname} />
        <TextField required id="api-base-path" label="Api base path" defaultValue={settings.apiBasePath} onChange={changeApiBasePath} />
        <TextField required id="gitlab-token" label="Gitlab Token" defaultValue={settings.gitlabToken} onChange={changeGitlabToken} />
      </form>
      <Button onClick={submit}>Save</Button>
    </Container>
  );
}
