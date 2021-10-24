
const { BrowserWindow, app, Notification } = require('electron');
const path = require('path');
const { IpcEvents } = require('../ipc-events');
const {getOrCreateMainWindow} = require('./window.js');
const {ipcMainManager} = require('./ipc.js');
const isDev = !app.isPackaged;






onReady = () => {
  getOrCreateMainWindow();
} 

main = () => {

  if(isDev) {
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
    })
  }
  app.whenReady().then(onReady)
}

/** Executing here !!!! */

main();
