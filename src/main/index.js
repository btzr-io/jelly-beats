import { app } from 'electron'
import findProcess from 'find-process'

import Daemon from './daemon'
import discordClient from './discord'
import createMainWindow from './create-window'

const IS_WINDOWS = process.platform === 'win32'
const appState = {}

// LBRY daemon instace
let daemon = null

// Discord integration
discordClient()

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  // Main window props
  const windowProps = {
    title: `${app.getName()} ~ ${app.getVersion()}`,
    webPreferences: { webSecurity: false },
  }

  // Create main BrowserWindow when electron is ready
  createMainWindow(windowProps)

  // Windows WMIC returns lbrynet start with 2 spaces. https://github.com/yibn2008/find-process/issues/18
  const processListArgs =
    process.platform === 'win32' ? 'lbrynet  start' : 'lbrynet start'
  const processList = await findProcess('name', processListArgs)
  const isDaemonRunning = processList.length > 0

  // Start LBRY DAEMON
  if (!isDaemonRunning) {
    daemon = new Daemon()
    daemon.launch()
  }
})
