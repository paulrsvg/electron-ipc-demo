'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const path = require("path");
import getCerts from './get-certs'
const isDevelopment = process.env.NODE_ENV !== 'production'
let FedUid    

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      // nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.webContents.on('did-finish-load', () => {

    checkCert().then(function() {
       console.log('well we tried') 
       console.log('fed id yet', FedUid);
      });
      console.log('---- starting!');

      async function checkCert() {
        console.log('try to get cert');
        FedUid = await getCerts();
        console.log('fed id yet', FedUid);
      }
    if (FedUid) {
      win.webContents.send('got-cert', FedUid)
    }

  })
  

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

//ipc stuff here yay
// ipcMain.on(sc, _ => {
//   console.log('starting cert grab!')

//   getCerts()
//       win.webContents.send('certs')
// })    

ipcMain.on('scrape-cert', (event, arg) => { //listen for msg from renderer (app.vue)
  // getCerts()
  console.log('here 001', arg)
    checkCert().then(function() { console.log('well we tried') });
      console.log('---- starting!');

      async function checkCert() {
        console.log('try to get cert');
        let tempFedUid = await getCerts();
        console.log('fed id try2?', tempFedUid);
      }

    if (arg === 'ping'){
      // console.log('fed id?', FedUid);
      // console.log('sending to:', event.sender)
      return event.sender.send('reply','pong') //send reply back to renderer
    }
    console.log('new arg', arg)
});

ipcMain.on('got-cert', (event, arg) => { //listen for msg from renderer (app.vue)
  // getCerts()
  console.log('here 003', arg)
    
    // if (arg === 'ping'){
    //   // console.log('fed id?', FedUid);
    //   return event.sender.send('reply','pong') //send reply back to renderer
    // }
    console.log('new arg', arg)
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
