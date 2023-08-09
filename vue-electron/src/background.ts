"use strict";

import { app, protocol, BrowserWindow, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import axios from "axios";
import { getBasicAuth } from "./api/jiraApi";
import { LoginType } from "./stores/indexedDB";
const isDevelopment = process.env.NODE_ENV !== "production";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

const errorMessage: {
  [key: number]: string;
} = {
  [200]: "로그인에 성공 하셨습니다.",
  [401]: "로그인 정보가 일치하지 않습니다.",
  [403]:
    "로그인에 여러번 실패 하셨습니다.\nhttp://jira.com:8080/ 으로 로그인후 다시 시도 해주세요",
  [500]: "서버에러",
  [501]: "서버에러",
  [502]: "서버에러",
  [503]: "서버에러",
};

ipcMain.handle("login", async (_, args) => {
  try {
    const result = await axios
      .get("http://jira.com:8080/rest/api/2/mypermissions", {
        headers: {
          Authorization: getBasicAuth(JSON.parse(args)),
        },
      })
      .then((data) => ({
        status: data.status,
        data: data.data,
        message: errorMessage[data.status],
      }))
      .catch((e) => ({
        status: e.response.status,
        data: null,
        message: errorMessage[e.response.status],
      }));

    return result;
  } catch (error) {
    throw new Error(error as string);
  }
});

ipcMain.handle("postJiraTicket", async (_, args) => {
  const data: {
    loginInfo: LoginType;
    jql: string;
  } = JSON.parse(args);
  try {
    const result = await axios
      .post(
        "http://jira.com:8080/rest/api/2/search",
        {
          fields: [
            "labels",
            "summary",
            "status",
            "assignee",
            "displayName",
            "duedate",
            "customfield_10832",
            "customfield_10833",
            "aggregateprogress",
            "priority",
            "comment",
          ],
          jql: data.jql,
        },
        {
          headers: {
            Authorization: getBasicAuth(data.loginInfo),
          },
        }
      )
      .then((data) => ({
        status: data.status,
        data: data.data,
        message: "success",
      }))
      .catch((e) => ({
        status: e.response.status,
        data: null,
        message: errorMessage[e.response.status],
      }));

    return result;
  } catch (error) {
    throw new Error(error as string);
  }
});

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 670,
    title: "**** 업무보고",
    resizable: false,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e);
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
