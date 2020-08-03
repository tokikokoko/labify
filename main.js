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
      // preload: path.join(__dirname, '/preload.js'),
    },
  });
  mainWindow.loadURL('file://' + __dirname + '/dist/index.html');
  mainWindow.webContents.openDevTools(); 
  mainWindow.on('closed', function() {
      mainWindow = null;
  });
}
app.on('ready', CreateWindow);

ipcMain.handle('get-config', (event) => {
  console.log("Called get config.");
  return config;
})