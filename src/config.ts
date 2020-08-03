import {ipcRenderer} from 'electron';

interface config {
  gitlabHostName: string
  gitlabApiBasePath: string
  gitlabToken: string
};

const getConfig = async (): Promise<config> => {
  const data = await ipcRenderer.invoke('get-config');
  return data;
}

export default getConfig;