const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('halo', {
  onMediaUpdate: (cb) => ipcRenderer.on('media-update', (_event, data) => cb(data)),
  onClipboardUpdate: (cb) => ipcRenderer.on('clipboard-update', (_event, text) => cb(text)),
  onSystemStats: (cb) => ipcRenderer.on('system-stats', (_event, data) => cb(data)),
  toggleClickThrough: (ignore) => ipcRenderer.send('toggle-click-through', ignore),
  controlMedia: (command) => ipcRenderer.send('control-media', command),
  quitApp: () => ipcRenderer.send('quit-app'),
})
