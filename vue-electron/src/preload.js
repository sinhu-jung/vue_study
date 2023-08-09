import { contextBridge } from "electron";
import fs from "fs";

contextBridge.exposeInMainWorld("file", {
  save: (filePath, text) => {
    fs.writeFileSync(filePath, text, { encoding: "utf-8" });
  },
});
