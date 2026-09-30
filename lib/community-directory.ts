export interface DirectoryProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
  bio?: string;
  online?: boolean;
}

export const COMMUNITY_PROFILES: Record<string, DirectoryProfile> = {
  // Community Project Authors & Active Members
  "10000000-0000-0000-0000-000000000001": {
    id: "10000000-0000-0000-0000-000000000001",
    full_name: "Amine Hadjadj",
    avatar_url:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    role: "Étudiant Fullstack Next.js",
    bio: "Passionné par l'architecture logicielle moderne et les SaaS B2B en Algérie.",
    online: true,
  },
  "10000000-0000-0000-0000-000000000002": {
    id: "10000000-0000-0000-0000-000000000002",
    full_name: "Sara Meziani",
    avatar_url:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    role: "Spécialiste IA & Data Science",
    bio: "Travaille sur les modèles LLM open-source et le RAG appliqué au e-commerce.",
    online: true,
  },
  "10000000-0000-0000-0000-000000000003": {
    id: "10000000-0000-0000-0000-000000000003",
    full_name: "Yanis Khelifi",
    avatar_url:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    role: "Développeur Frontend Vue/React",
    bio: "Créateur d'expériences web interactives et plateformes e-commerce ultra fluides.",
    online: false,
  },
  "10000000-0000-0000-0000-000000000004": {
    id: "10000000-0000-0000-0000-000000000004",
    full_name: "Lina Benabderrahmane",
    avatar_url:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "Développeuse Mobile Flutter",
    bio: "Spécialisée dans les applications mobiles éducatives et le design cross-platform.",
    online: true,
  },
  "10000000-0000-0000-0000-000000000005": {
    id: "10000000-0000-0000-0000-000000000005",
    full_name: "Karim Boudiaf",
    avatar_url:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "Ingénieur Web Fullstack",
    bio: "Expert Next.js, streaming vidéo et optimisation des performances serveur.",
    online: false,
  },
  "10000000-0000-0000-0000-000000000006": {
    id: "10000000-0000-0000-0000-000000000006",
    full_name: "Nour Belkacem",
    avatar_url:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    role: "Développeuse Backend & APIs",
    bio: "Passionnée de microservices, bases PostgreSQL et intégrations météo temps-réel.",
    online: true,
  },
  "10000000-0000-0000-0000-000000000007": {
    id: "10000000-0000-0000-0000-000000000007",
    full_name: "Rayan Dahmani",
    avatar_url:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    role: "Game Developer Unity / C#",
    bio: "Créateur indépendant de jeux mobiles 2D avec un accent sur le gameplay réactif.",
    online: false,
  },
  "10000000-0000-0000-0000-000000000008": {
    id: "10000000-0000-0000-0000-000000000008",
    full_name: "Ines Chaouche",
    avatar_url:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    role: "Développeuse Python & Django",
    bio: "Conception de systèmes transactionnels et plateformes de réservation complexes.",
    online: true,
  },
  "10000000-0000-0000-0000-000000000009": {
    id: "10000000-0000-0000-0000-000000000009",
    full_name: "Sofiane Zerrouki",
    avatar_url:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    role: "Data Analyst & Frontend Dev",
    bio: "Visualisation de données complexes avec D3.js et tableaux de bord décisionnels.",
    online: false,
  },
  "10000000-0000-0000-0000-000000000010": {
    id: "10000000-0000-0000-0000-000000000010",
    full_name: "Meriem Cherif",
    avatar_url:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
    role: "Designer UI/UX & Astro Dev",
    bio: "Obsédée par la typographie, l'accessibilité web et les performances de chargement.",
    online: true,
  },

  // Evolve Mentors & Official Support
  "teacher-amina": {
    id: "teacher-amina",
    full_name: "Amina Benali",
    avatar_url:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    role: "Instructrice Principale UI/UX Design",
    bio: "Ex-Product Designer chez Yassir, formatrice Figma & Design Systems chez Evolve.",
    online: true,
  },
  "teacher-yacine": {
    id: "teacher-yacine",
    full_name: "Yacine Mansouri",
    avatar_url:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    role: "Lead Formateur Web Fullstack",
    bio: "Architecte Next.js & Cloud, mentor de plus de 400 développeurs certifiés.",
    online: true,
  },
  "support-evolve": {
    id: "support-evolve",
    full_name: "Support Evolve Academy",
    avatar_url: "/logo.png",
    role: "Équipe Pédagogique & Tuteurs",
    bio: "Support technique, coordination des ateliers et accompagnement de vos projets.",
    online: true,
  },
};

/**
 * Resolves an author's profile by ID.
 * First checks database profiles map if provided, then falls back to verified
 * community directory profiles, and finally returns a safe default.
 */
export function resolveAuthorProfile(
  id: string,
  dbProfilesMap?: Map<
    string,
    {
      id: string;
      full_name: string | null;
      avatar_url: string | null;
      role: string | null;
    }
  >,
): DirectoryProfile {
  if (dbProfilesMap?.has(id)) {
    const p = dbProfilesMap.get(id);
    if (p?.full_name) {
      return {
        id: p.id,
        full_name: p.full_name,
        avatar_url: p.avatar_url,
        role: p.role || "Étudiant Evolve",
        online: false,
      };
    }
  }

  if (COMMUNITY_PROFILES[id]) {
    return COMMUNITY_PROFILES[id];
  }

  // Fallback for any unknown user ID
  return {
    id,
    full_name: "Étudiant Evolve",
    avatar_url: null,
    role: "Membre de l'Académie",
    online: false,
  };
}
