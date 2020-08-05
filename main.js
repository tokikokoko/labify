const {electron, BrowserWindow, app, ipcMain} = require('electron');
const config = require('./config');
const path = require('path');

let mainWindow = null;
const CreateWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadURL('file://' + __dirname + '/dist/index.html');
  // mainWindow.webContents.openDevTools(); 
  mainWindow.on('closed', function() {
      mainWindow = null;
  });
}
app.on('ready', CreateWindow);

ipcMain.handle('get-config', (event) => {
  console.log("Called get config.");
  return config.loadConfig();
});

ipcMain.handle('save-config', (event, hostname, apiBasePath, gitlabToken) => {
  console.log("Called save config.");
  config.saveConfig(hostname, apiBasePath, gitlabToken);
  return true;
});