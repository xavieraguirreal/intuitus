const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: false,
    hasShadow: false,
    backgroundColor: '#00000000',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
    },
  });

  // Cargar la URL correcta según el entorno
  const startUrl = isDev
    ? 'http://localhost:3000/teleprompter'
    : `file://${path.join(__dirname, '../.next/server/app/teleprompter/page.html')}`;

  mainWindow.loadURL(startUrl);

  // Abrir DevTools en desarrollo
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  // Hacer la ventana arrastrable
  mainWindow.setIgnoreMouseEvents(false);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Registrar atajos globales
function registerGlobalShortcuts() {
  // Ctrl+Shift+T para toggle always on top
  globalShortcut.register('CommandOrControl+Shift+T', () => {
    if (mainWindow) {
      const isOnTop = mainWindow.isAlwaysOnTop();
      mainWindow.setAlwaysOnTop(!isOnTop);
      mainWindow.webContents.send('always-on-top-changed', !isOnTop);
    }
  });

  // Ctrl+Shift+O para ajustar opacidad
  globalShortcut.register('CommandOrControl+Shift+O', () => {
    if (mainWindow) {
      const opacity = mainWindow.getOpacity();
      const newOpacity = opacity === 1 ? 0.8 : opacity === 0.8 ? 0.6 : 1;
      mainWindow.setOpacity(newOpacity);
      mainWindow.webContents.send('opacity-changed', newOpacity);
    }
  });

  // Ctrl+Shift+Q para cerrar
  globalShortcut.register('CommandOrControl+Shift+Q', () => {
    if (mainWindow) {
      mainWindow.close();
    }
  });
}

// IPC handlers
ipcMain.handle('set-always-on-top', (event, flag) => {
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(flag);
  }
});

ipcMain.handle('set-opacity', (event, opacity) => {
  if (mainWindow) {
    mainWindow.setOpacity(opacity);
  }
});

ipcMain.handle('minimize-window', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.handle('maximize-window', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle('close-window', () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

// Evento ready
app.whenReady().then(() => {
  createWindow();
  registerGlobalShortcuts();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Limpiar atajos al cerrar
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// Cerrar en todas las plataformas excepto macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Manejo de errores
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
