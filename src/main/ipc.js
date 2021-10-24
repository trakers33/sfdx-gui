
const {ipcMain}          = require("electron");
const {EventEmitter}     = require("events");
const {getOrCreateMainWindow} = require('./window.js')
const { ipcMainEvents,WEBCONTENTS_READY_FOR_IPC_SIGNAL } = require("../ipc-events");


class IpcMainManager extends EventEmitter {
    constructor() {
      super();
      this.readyWebContents = new WeakSet();
      this.messageQueue = new WeakMap();

      ipcMainEvents.forEach(name => {
        ipcMain.removeAllListeners(name);
        ipcMain.on(name, (...args) => this.emit(name, ...args));
      });


      ipcMain.on(WEBCONTENTS_READY_FOR_IPC_SIGNAL, event => {
        this.readyWebContents.add(event.sender);
        const queue = this.messageQueue.get(event.sender);
        this.messageQueue.delete(event.sender);
        if (!queue) return;
  
        for (const item of queue) {
          this.send(item[0], item[1], event.sender);
        }
      });
    }


    /**
     * Send an IPC message to an instance of Electron.WebContents.
     * If none is specified, we'll automatically go with the main window.
     *
     * @param {IpcEvents} channel
     * @param {Array<any>} args
     * @param {Electron.WebContents} [target]
     */
  
  
    send(channel, args, target) {
      const _target = target || getOrCreateMainWindow().webContents;
  
      const _args = args || [];
  
      if (!this.readyWebContents.has(_target)) {
        const existing = this.messageQueue.get(_target) || [];
        this.messageQueue.set(_target, [...existing, [channel, args]]);
        return;
      }
  
      _target.send(channel, ..._args);
    }
  
    handle(channel, listener) {
      // there can be only one, so remove previous one first
      ipcMain.removeHandler(channel);
      ipcMain.handle(channel, listener);
    }
  
    handleOnce(channel, listener) {
      ipcMain.handleOnce(channel, listener);
    }
  
  }

exports.ipcMainManager = new IpcMainManager();