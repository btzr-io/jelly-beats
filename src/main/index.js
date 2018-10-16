import { app, BrowserWindow } from 'electron'
import path from 'path'
import { format as formatUrl } from 'url'

const isDevelopment = process.env.NODE_ENV !== 'production'

//localhost url
const localURL = `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`;

//production url
const formattedURL = formatUrl({
  pathname: path.join(__dirname, 'index.html'),
  protocol: 'file',
  slashes: true,
})

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow

function createMainWindow() {
  const window = new BrowserWindow({
    webPreferences: {
      webSecurity: false,
    },
  })

  //open the Dev tools only if the environment is not production
  isDevelopment && window.webContents.openDevTools();

  //pick url based on the deployment environment
  window.loadURL(isDevelopment ? localURL : formattedURL);

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
