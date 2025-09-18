import path from "path";
import fs from "fs";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const envTestPath = path.resolve(__dirname, "..", ".env.test");

if (fs.existsSync(envTestPath)) {
  const lines = fs
    .readFileSync(envTestPath, "utf8")
    .split(/\r?\n/)
    .filter(Boolean);
  for (const line of lines) {
    if (line.startsWith("#")) continue;
    const [k, ...rest] = line.split("=");
    const v = rest.join("=");
    if (!process.env[k]) {
      process.env[k] = v;
    }
  }
}
