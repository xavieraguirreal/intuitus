const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs de forma segura al frontend
contextBridge.exposeInMainWorld('electronAPI', {
  // Control de ventana
  setAlwaysOnTop: (flag) => ipcRenderer.invoke('set-always-on-top', flag),
  setOpacity: (opacity) => ipcRenderer.invoke('set-opacity', opacity),
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),

  // Listeners
  onAlwaysOnTopChanged: (callback) => {
    ipcRenderer.on('always-on-top-changed', (event, value) => callback(value));
  },
  onOpacityChanged: (callback) => {
    ipcRenderer.on('opacity-changed', (event, value) => callback(value));
  },

  // Detectar si estamos en Electron
  isElectron: true,
});
