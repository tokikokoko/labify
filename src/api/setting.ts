import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '@/store/store';
import { ipcRenderer } from 'electron';

export interface Settings {
  hostname: string
  apiBasePath: string
  gitlabToken: string
};

// Redux
type SettingsState = {
  settings: Settings
  initialized: boolean
};

const initialState: SettingsState = {
  settings: {
    hostname: 'gitlab.com',
    apiBasePath: '/api/v4',
    gitlabToken: '',
  },
  initialized: false,
};

const settings = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    initSuccess(state: SettingsState, action: PayloadAction<Settings>) {
      state.initialized = true;
    },
    saveSettingsSuccess(state: SettingsState, action: PayloadAction<Settings>) {
      const settings  = action.payload;
      state.settings = settings;
    },
  }
});

export const {
  initSuccess,
  saveSettingsSuccess,
} = settings.actions;
export default settings.reducer;

export const fetchSettings = (): AppThunk => async dispatch => {
  const settings = await getConfig();
  console.log("DEBUG: settings: ", settings);
  dispatch(saveSettingsSuccess(settings));
  dispatch(initSuccess(settings));
};

const getConfig = async (): Promise<Settings> => {
  const data = await ipcRenderer.invoke('get-config');
  return data;
}

export const saveSettings = (settings: Settings): AppThunk => async dispatch => {
  dispatch(saveSettingsSuccess(settings));
  const data = await ipcRenderer.invoke('save-config', settings.hostname, settings.apiBasePath, settings.gitlabToken);
  return data;
}