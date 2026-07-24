const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('halo', {
  onMediaUpdate: (cb) => ipcRenderer.on('media-update', (_event, data) => cb(data)),
  onClipboardUpdate: (cb) => ipcRenderer.on('clipboard-update', (_event, text) => cb(text)),
  toggleClickThrough: (ignore) => ipcRenderer.send('toggle-click-through', ignore),
  quitApp: () => ipcRenderer.send('quit-app'),
})
