const { BrowserWindow, app, Notification } = require('electron');
const path = require('path');
const {ipcMainManager} = require('./ipc.js');
const { IpcEvents } = require('../ipc-events');


let browserWindows = [];
exports.browserWindows;

exports.createMainWindow = createMainWindow = () => {

    console.log(`Creating main window`);
    let browserWindow = BrowserWindow || null;
        browserWindow = new BrowserWindow(getMainWindowOptions());
        browserWindow.loadFile('static/index.html');
        browserWindow.webContents.once('dom-ready', () => {
          if (browserWindow) {
            browserWindow.show();
            /** To handle later to have right click menu */
            //createContextMenu(browserWindow);
          }
        });
  
    browserWindow.on('focus', () => {
      if (browserWindow) {
        //ipcMainManager.send(IpcEvents.SET_SHOW_ME_TEMPLATE);
      }
    });
  
    browserWindow.on('closed', () => {
      browserWindows = browserWindows.filter((bw) => browserWindow !== bw);
      browserWindow = null;
    });
  
    browserWindow.webContents.on('new-window', (event, url) => {
      event.preventDefault();
      shell.openExternal(url);
    });
  
    browserWindow.webContents.on('will-navigate', (event, url) => {
      event.preventDefault();
      shell.openExternal(url);
    });
  
    /** For testing */
    ipcMainManager.on(IpcEvents.INTERACTION_NOTIFICATION, (_, message) => {
      new Notification({title: 'Notifiation', body: message}).show();
    })
    
    browserWindows.push(browserWindow);
  
    return browserWindow;
  }
  
exports.getMainWindowOptions = getMainWindowOptions = () => {
    return {
      width: 1400,
      height: 900,
      minHeight: 600,
      minWidth: 600,
      titleBarStyle: process.platform === 'darwin' ? 'hidden' : undefined,
      acceptFirstMouse: true,
      backgroundColor: '#1d2427',
      show: false,
      webPreferences: {
        devTools:true,
        webviewTag: false,
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, '..', 'preload', 'preload'),
      },
    };
}
  
exports.getOrCreateMainWindow = getOrCreateMainWindow = () => {
    return (
      BrowserWindow.getFocusedWindow() || browserWindows[0] || createMainWindow()
    );
}