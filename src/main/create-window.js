import { BrowserWindow } from 'electron'
import { format as formatUrl } from 'url'
import path from 'path'
import createMenu from './create-menu'

const IS_DEV = process.env.NODE_ENV === 'development'

// Development url
const DEV_URL = `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`

// Production url
const PRODUCTION_URL = formatUrl({
  pathname: path.join(__dirname, 'index.html'),
  protocol: 'file',
  slashes: true,
})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow(windowProps = {}) {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600, ...windowProps })

  // Pick url based on the deployment environment and load index.html
  mainWindow.loadURL(IS_DEV ? DEV_URL : PRODUCTION_URL)

  // Setup menu
  createMenu()

  // Open the DevTools
  IS_DEV && mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

export default createWindow
