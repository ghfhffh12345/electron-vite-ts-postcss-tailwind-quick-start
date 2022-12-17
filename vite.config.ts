import fs from "fs";
import path from "path";
import { defineConfig } from "vite";
import electron from "vite-plugin-electron";

fs.rmSync("dist", { recursive: true, force: true });

export default defineConfig({
  base: "./",
  plugins: [
    electron({
      main: {
        entry: "electron/main.ts",
      },
      preload: {
        input: {
          preload: path.join(__dirname, "electron/preload.ts"),
        },
      },
      renderer: {},
    }),
  ],
});
