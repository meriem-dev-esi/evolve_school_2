import fs from "node:fs";

const KEYS = [
  "search.placeholder",
  "search.label",
  "search.clear",
  "search.resultsFor",
  "filters.title",
  "filters.all",
  "filters.allShort",
  "list.titleAll",
  "list.count",
  "list.reset",
  "empty.title",
  "empty.text",
  "empty.cta",
  "card.badge",
  "card.defaultDuration",
  "card.projectIncluded",
  "card.participation",
  "card.free",
  "card.currency",
  "card.join",
  "page.hero.badge",
  "page.hero.title",
  "page.hero.brand",
  "page.hero.text",
  "page.community.eyebrow",
  "page.community.title",
  "page.community.text",
  "page.community.cta",
];

const get = (o, p) => p.split(".").reduce((a, k) => (a == null ? a : a[k]), o);
const flat = (o, pre = "") =>
  Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === "object" ? flat(v, `${pre}${k}.`) : [`${pre}${k}`],
  );

let bad = 0;
const sets = {};

for (const l of ["fr", "ar", "en"]) {
  const a = JSON.parse(fs.readFileSync(`messages/${l}.json`, "utf8")).ateliers;
  if (!a) {
    console.log(`${l}: cle "ateliers" ABSENTE`);
    bad++;
    continue;
  }
  sets[l] = new Set(flat(a));
  for (const k of KEYS) {
    const v = get(a, k);
    if (typeof v !== "string" || !v.trim()) {
      console.log(`${l}: manquant -> ateliers.${k}`);
      bad++;
    }
  }
}

for (const l of ["ar", "en"]) {
  if (!sets.fr || !sets[l]) continue;
  for (const k of sets.fr)
    if (!sets[l].has(k)) {
      console.log(`${l}: cle en moins -> ${k}`);
      bad++;
    }
  for (const k of sets[l])
    if (!sets.fr.has(k)) {
      console.log(`${l}: cle en plus -> ${k}`);
      bad++;
    }
}

console.log(
  bad
    ? `${bad} probleme(s)`
    : "OK : toutes les cles existent dans fr, ar et en",
);
process.exit(bad ? 1 : 0);
