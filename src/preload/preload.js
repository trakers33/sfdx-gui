
const { ipcRenderer, contextBridge } = require('electron');
const {IpcEvents} = require('../ipc-events');

contextBridge.exposeInMainWorld('electron', {
  notificationApi: {
    sendNotification(message) {
      ipcRenderer.send(IpcEvents.INTERACTION_NOTIFICATION, message);
    }
  },
  batteryApi: {

  },
  filesApi: {

  }
})
