import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const htmlPath = path.join(rootDir, "index.html");
const structuredDataPath = path.join(rootDir, "data", "structured-data.json");
const startMarker = "    <!-- structured-data:start -->";
const endMarker = "    <!-- structured-data:end -->";

const html = await readFile(htmlPath, "utf8");
const structuredData = JSON.parse(await readFile(structuredDataPath, "utf8"));
const block = [
  startMarker,
  '    <script type="application/ld+json">',
  JSON.stringify(structuredData, null, 6)
    .split("\n")
    .map((line) => `      ${line}`)
    .join("\n"),
  "    </script>",
  endMarker
].join("\n");

let nextHtml;
if (html.includes(startMarker) && html.includes(endMarker)) {
  nextHtml = html.replace(
    new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`),
    block
  );
} else {
  nextHtml = html.replace("    <link rel=\"stylesheet\" href=\"assets/css/styles-hero-fix.css\">\n", `    <link rel="stylesheet" href="assets/css/styles-hero-fix.css">\n${block}\n`);
}

await writeFile(htmlPath, nextHtml);
console.log("Synced JSON-LD into index.html");
