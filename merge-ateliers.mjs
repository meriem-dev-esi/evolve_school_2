import fs from "node:fs";

const src = JSON.parse(fs.readFileSync("ateliers.messages.json", "utf8"));

for (const loc of ["fr", "ar", "en"]) {
  const path = `messages/${loc}.json`;
  const json = JSON.parse(fs.readFileSync(path, "utf8"));
  json.ateliers = src[loc].ateliers;
  fs.writeFileSync(path, `${JSON.stringify(json, null, 2)}\n`);
}
