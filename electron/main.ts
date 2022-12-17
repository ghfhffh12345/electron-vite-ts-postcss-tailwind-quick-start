process.env.DIST = join(__dirname, "..");
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : join(process.env.DIST, "../public");

import { join } from "path";
import { app, BrowserWindow, ipcMain } from "electron";

let win: BrowserWindow | null;

const preload = join(__dirname, "./preload.js");

const url = process.env["VITE_DEV_SERVER_URL"];

function createWindow() {
  win = new BrowserWindow({
    icon: join(process.env.PUBLIC, "logo.svg"),
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload,
    },
    autoHideMenuBar: true,
  });

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (app.isPackaged) {
    win.loadFile(join(process.env.DIST, "index.html"));
  } else {
    win.loadURL(url);
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
