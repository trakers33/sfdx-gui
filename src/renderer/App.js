
import React from 'react';
import { IpcEvents } from '../ipc-events';


export default function App() {

  return (
    <>
      <h1>I am App Component!!!</h1>
      <button onClick={() => {
        electron.notificationApi.sendNotification('Hello the world');
      }}>Notify</button>
    </>
  )
}
