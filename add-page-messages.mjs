import fs from "node:fs";

const PAGE = {
  fr: {
    hero: {
      badge: "Ateliers pratiques & masterclasses",
      title: "Les Ateliers",
      brand: "Evolve",
      text: "Pratiquez en direct avec des experts du secteur. Des sessions intensives et interactives con\u00e7ues pour acc\u00e9l\u00e9rer votre ma\u00eetrise des outils du futur.",
    },
    community: {
      eyebrow: "Rejoignez le r\u00e9seau",
      title: "Proposez un atelier ou partagez vos travaux",
      text: "Vous \u00eates formateur ou expert ? Rejoignez l'\u00e9quipe d'animateurs d'ateliers Evolve ou proposez une masterclass \u00e0 notre communaut\u00e9.",
      cta: "Rejoindre la communaut\u00e9",
    },
  },
  ar: {
    hero: {
      badge:
        "\u0648\u0631\u0634 \u062a\u0637\u0628\u064a\u0642\u064a\u0629 \u0648\u0645\u0627\u0633\u062a\u0631 \u0643\u0644\u0627\u0633",
      title: "\u0648\u0631\u0634 \u0639\u0645\u0644",
      brand: "Evolve",
      text: "\u062a\u062f\u0631\u0651\u0628 \u0645\u0628\u0627\u0634\u0631\u0629 \u0645\u0639 \u062e\u0628\u0631\u0627\u0621 \u0627\u0644\u0642\u0637\u0627\u0639. \u062c\u0644\u0633\u0627\u062a \u0645\u0643\u062b\u0641\u0629 \u0648\u062a\u0641\u0627\u0639\u0644\u064a\u0629 \u0645\u0635\u0645\u0651\u0645\u0629 \u0644\u062a\u0633\u0631\u064a\u0639 \u0625\u062a\u0642\u0627\u0646\u0643 \u0644\u0623\u062f\u0648\u0627\u062a \u0627\u0644\u0645\u0633\u062a\u0642\u0628\u0644.",
    },
    community: {
      eyebrow:
        "\u0627\u0646\u0636\u0645 \u0625\u0644\u0649 \u0627\u0644\u0634\u0628\u0643\u0629",
      title:
        "\u0627\u0642\u062a\u0631\u062d \u0648\u0631\u0634\u0629 \u0623\u0648 \u0634\u0627\u0631\u0643 \u0623\u0639\u0645\u0627\u0644\u0643",
      text: "\u0647\u0644 \u0623\u0646\u062a \u0645\u062f\u0631\u0651\u0628 \u0623\u0648 \u062e\u0628\u064a\u0631\u061f \u0627\u0646\u0636\u0645 \u0625\u0644\u0649 \u0641\u0631\u064a\u0642 \u0645\u064f\u064a\u0633\u0651\u0631\u064a \u0648\u0631\u0634 Evolve \u0623\u0648 \u0627\u0642\u062a\u0631\u062d \u0645\u0627\u0633\u062a\u0631 \u0643\u0644\u0627\u0633 \u0639\u0644\u0649 \u0645\u062c\u062a\u0645\u0639\u0646\u0627.",
      cta: "\u0627\u0646\u0636\u0645 \u0625\u0644\u0649 \u0627\u0644\u0645\u062c\u062a\u0645\u0639",
    },
  },
  en: {
    hero: {
      badge: "Hands-on workshops & masterclasses",
      title: "Workshops by",
      brand: "Evolve",
      text: "Practice live with industry experts. Intensive, interactive sessions designed to speed up your mastery of tomorrow's tools.",
    },
    community: {
      eyebrow: "Join the network",
      title: "Propose a workshop or share your work",
      text: "Are you a trainer or an expert? Join Evolve's team of workshop hosts or pitch a masterclass to our community.",
      cta: "Join the community",
    },
  },
};

for (const loc of ["fr", "ar", "en"]) {
  const path = `messages/${loc}.json`;
  const json = JSON.parse(fs.readFileSync(path, "utf8"));
  if (!json.ateliers) {
    throw new Error(`Cle "ateliers" absente de ${path}`);
  }
  json.ateliers.page = PAGE[loc];
  fs.writeFileSync(path, `${JSON.stringify(json, null, 2)}\n`);
  console.log(`${loc}: ateliers.page ajoute`);
}
