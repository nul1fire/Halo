import { exec } from 'node:child_process'
import { app, BrowserWindow, clipboard, ipcMain, screen } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

app.commandLine.appendSwitch('disable-features', 'CalculateNativeWinOcclusion')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isDev = !app.isPackaged

const GET_MEDIA_SCRIPT = path.join(__dirname, '..', 'get-media.ps1')

let lastClipboardText = ''
let mainWindow

function pollMedia(mainWindow) {
  exec(
    `powershell -NoProfile -NonInteractive -ExecutionPolicy Bypass -File "${GET_MEDIA_SCRIPT}"`,
    { windowsHide: true, timeout: 5000, encoding: 'utf8' },
    (error, stdout, stderr) => {
      if (mainWindow.isDestroyed()) {
        return
      }

      if (error) {
        return
      }

      const cleanStdout = stdout.replace(/\r?\n/g, '')
      const parts = cleanStdout.split('|')
      const title = parts[0]?.trim() ?? ''
      const artist = parts[1]?.trim() ?? ''
      const status = parts[2]?.trim() ?? ''
      const position = parts[3]?.trim() ?? '0'
      const endTime = parts[4]?.trim() ?? '0'
      const thumbnail = parts.slice(5).join('|').trim()

      if (!title || title === 'none') {
        mainWindow.webContents.send('media-update', null)
        return
      }

      const payload = {
        title,
        artist,
        isPlaying: status === 'Playing',
        position: parseInt(position, 10) || 0,
        endTime: parseInt(endTime, 10) || 0,
        thumbnail: thumbnail?.trim() ?? '',
      }

      mainWindow.webContents.send('media-update', payload)
    },
  )
}

function startMediaPolling(mainWindow) {
  pollMedia(mainWindow)
  return setInterval(() => pollMedia(mainWindow), 2000)
}

function startClipboardMonitoring(mainWindow) {
  return setInterval(() => {
    if (mainWindow.isDestroyed()) {
      return
    }

    const text = clipboard.readText()
    if (text && text !== lastClipboardText) {
      lastClipboardText = text
      mainWindow.webContents.send('clipboard-update', text)
    }
  }, 1000)
}

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  mainWindow = new BrowserWindow({
    width,
    height,
    x: 0,
    y: 0,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    hasShadow: false,
    paintWhenInitiallyHidden: true,
    resizable: false,
    maximizable: false,
    skipTaskbar: true,
    webPreferences: {
      devTools: true,
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false,
    },
  })

  mainWindow.setAlwaysOnTop(true, 'screen-saver')
  mainWindow.setSkipTaskbar(true)

  mainWindow.setIgnoreMouseEvents(true, { forward: true })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5174')
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  const mediaInterval = startMediaPolling(mainWindow)
  const clipboardInterval = startClipboardMonitoring(mainWindow)

  mainWindow.on('closed', () => {
    clearInterval(mediaInterval)
    clearInterval(clipboardInterval)
  })
}

app.whenReady().then(createWindow)

ipcMain.on('quit-app', () => app.quit())

ipcMain.on('toggle-click-through', (event, ignore) => {
  if (mainWindow) mainWindow.setIgnoreMouseEvents(ignore, { forward: true })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
