import { app } from 'electron'
import findProcess from 'find-process'

import Daemon from './daemon'
import discordClient from './discord'
import createMainWindow from './create-window'

const IS_WINDOWS = process.platform === 'win32'
const appState = {}

// LBRY daemon instace
let daemon = null
// Main window instace
let rendererWindow = null

// Discord integration
discordClient()

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  // Main window props
  const windowProps = {
    title: `${app.getName()} ~ ${app.getVersion()}`,
    webPreferences: { webSecurity: false, nodeIntegration: true },
    autoHideMenuBar: true,
  }

  // Create main BrowserWindow when electron is ready
  rendererWindow = createMainWindow(windowProps)

  // Windows WMIC returns lbrynet start with 2 spaces. https://github.com/yibn2008/find-process/issues/18
  const processListArgs = IS_WINDOWS ? 'lbrynet  start' : 'lbrynet start'
  const processList = await findProcess('name', processListArgs)
  const isDaemonRunning = processList.length > 0

  // Start LBRY DAEMON
  if (!isDaemonRunning) {
    daemon = new Daemon()
    daemon.on('exit', () => {
      daemon = null
    })
    daemon.launch()
  }
})

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', event => {
  if (daemon) {
    daemon.quit()
  }
  if (rendererWindow) {
    rendererWindow = null
  }
})
