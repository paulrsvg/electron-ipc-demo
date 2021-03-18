// src/preload.js

import { ipcRenderer } from 'electron'
window.ipcRenderer = ipcRenderer
// const {ipcRenderer} = window.require('electron')
console.log ('preload worked');
// alert("Preload Worked!") // this is a ui pop up coming from ipc yay. 



//from tylers win-ca repo listener.js
// const electron = require('electron')

// const ipc = electron.ipcRenderer

// document.getElementById('start').addEventListener('click', _ => {
//     ipc.send('certs-start')
// })