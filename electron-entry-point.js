const { app, BrowserWindow } = require("electron");
const path = require("path");
const express = require("express");
const cors = require("cors");

const localServerApp = express();
const PORT = 8088;

// Start local server
const startLocalServer = () => {
  localServerApp.use(express.json({ limit: "100mb" }));
  localServerApp.use(cors());
  localServerApp.use(express.static(path.join(__dirname, "build")));

  localServerApp.listen(PORT, () => {
    console.log("Server Started on PORT ", PORT);
  });
};

// Create window function
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL("http://localhost:" + PORT);
};

// App ready event
app.on("ready", () => {
  startLocalServer();
  createWindow();

  // Activate event
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // Set login item settings based on platform
  switch (process.platform) {
    case "darwin":
    case "win32":
      app.setLoginItemSettings({
        openAtLogin: true,
        path: app.getPath("exe"),
      });
      break;
    case "linux":
      break;
    default:
      console.log("Unsupported platform:", process.platform);
  }
});

// Window all closed event
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
