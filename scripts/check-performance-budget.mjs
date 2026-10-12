import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const DIST = path.resolve("dist");
const MAX_ENTRY_BYTES = 130 * 1024;

const html = await readFile(path.join(DIST, "index.html"), "utf8");
const entry = html.match(/<script[^>]+src="([^"]+\.js)"/i)?.[1];
if (!entry) throw new Error("Could not find the application entry script in dist/index.html");

const entryPath = path.join(DIST, entry.replace(/^\//, ""));
const entryBytes = (await stat(entryPath)).size;
const assetNames = (await readdir(path.join(DIST, "assets"))).filter((name) => name.endsWith(".js"));
const totalJsBytes = (await Promise.all(assetNames.map(async (name) =>
  (await stat(path.join(DIST, "assets", name))).size
))).reduce((sum, bytes) => sum + bytes, 0);

console.log(`Entry JavaScript: ${(entryBytes / 1024).toFixed(1)} KiB (limit ${(MAX_ENTRY_BYTES / 1024).toFixed(0)} KiB)`);
console.log(`All JavaScript chunks: ${(totalJsBytes / 1024).toFixed(1)} KiB across ${assetNames.length} files`);
if (entryBytes > MAX_ENTRY_BYTES) {
  console.error("Performance budget failed: entry JavaScript exceeds the limit.");
  process.exitCode = 1;
}
