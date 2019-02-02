import { app, ipcMain, BrowserWindow } from 'electron'
import path from 'path'
import { format as formatUrl } from 'url'
import discordRPC from 'discord-rich-presence'

// Discord client_id / app_id
// TODO: Probably move or hide this :)
const DISCORD_APP_ID = '462706392877236247'

// Discord rich presence client
const discordClient = discordRPC(DISCORD_APP_ID)

const isDevelopment = process.env.NODE_ENV !== 'production'

const localURL = `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`

// Production url
const productionURL = formatUrl({
  pathname: path.join(__dirname, 'index.html'),
  protocol: 'file',
  slashes: true,
})

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow

function createMainWindow() {
  const window = new BrowserWindow({
    title: `${app.getName()} ~ ${app.getVersion()}`,
    webPreferences: {
      webSecurity: false,
    },
  })

  // Open the Dev tools only if the environment is not production
  isDevelopment && window.webContents.openDevTools()

  // Pick url based on the deployment environment
  window.loadURL(isDevelopment ? localURL : productionURL)

  window.on('closed', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

// This event is called each time the user plays track
ipcMain.on('update-discord-presence', (event, args) => {
  const { title, artist, duration, currentTime } = args

  // Update discord rich presence data
  discordClient.updatePresence({
    state: artist.channelName,
    details: `♪ ${title}`,
    startTimestamp: Date.now() + currentTime * 1000,
    endTimestamp: Date.now() + duration * 1000,
    largeImageKey: 'jelly-beats-icon',
    // smallImageKey: '',
    instance: true,
  })
})

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()
})
