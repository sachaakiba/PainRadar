/**
 * Simple deterministic hash from string to number (0-1 range)
 */
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h = (h << 5) - h + c;
    h = h & h; // bitwise to 32-bit
  }
  return Math.abs(h % 10000) / 10000;
}

/**
 * Pick from array based on hash-derived index
 */
function pickFrom<T>(arr: T[], key: string): T {
  const idx = Math.floor(hashStr(key) * arr.length) % arr.length;
  return arr[idx];
}

/**
 * Pick N items from array (deterministic, no duplicates)
 */
function pickNFrom<T>(arr: T[], key: string, n: number): T[] {
  const indices: number[] = [];
  let seed = hashStr(key);
  while (indices.length < n && indices.length < arr.length) {
    const idx = Math.floor(seed * arr.length) % arr.length;
    if (!indices.includes(idx)) indices.push(idx);
    seed = (seed * 9301 + 49297) % 233280;
  }
  return indices.map((i) => arr[i]);
}

export type MockPainPoint = {
  text: string;
  sourceName: string | null;
  sourceType: string | null;
  sourceUrl: string | null;
  authorHandle: string | null;
  sentiment: string | null;
  frequency: number;
  tags: string[];
  audience: string | null;
  problemCategory: string | null;
  severityScore: number;
};

export type MockProductIdea = {
  title: string;
  description: string;
  targetAudience: string | null;
  monetizationModel: string | null;
  differentiation: string | null;
  mvpScope: string | null;
};

export type MockKeywordIdea = {
  keyword: string;
  intent: string | null;
  priority: string | null;
};

export type MockObjection = { text: string };

export type MockAcquisitionChannel = { name: string; rationale: string | null };

export type MockRecurringPhrase = { phrase: string; frequency: number };

export type MockAnalysisResult = {
  summary: string;
  opportunityScore: number;
  demandScore: number;
  urgencyScore: number;
  competitionScore: number;
  monetizationScore: number;
  recommendedMvp: string;
  pricingSuggestion: string;
  seoSummary: string;
  painPoints: MockPainPoint[];
  productIdeas: MockProductIdea[];
  keywordIdeas: MockKeywordIdea[];
  objections: MockObjection[];
  acquisitionChannels: MockAcquisitionChannel[];
  recurringPhrases: MockRecurringPhrase[];
};

type Locale = "en" | "fr";

const PAIN_TEMPLATES: Record<Locale, ((q: string, t: string, a?: string) => string)[]> = {
  en: [
    (q, t) =>
      `Spending too much time on manual ${t.toLowerCase()} tasks that could be automated`,
    (q, t) =>
      `No single tool does ${t.toLowerCase()} well—everything feels half-baked`,
    (q, t) =>
      `Existing solutions are too expensive for solo practitioners or small teams`,
    (q, t) =>
      `Constantly switching between 3-4 different apps to complete ${t.toLowerCase()} workflows`,
    (q, t) =>
      `Clients/customers complaining about slow or confusing ${t.toLowerCase()} processes`,
    (q, t) =>
      `Losing deals or customers because ${t.toLowerCase()} isn't streamlined`,
    (q, t) =>
      `Enterprise tools are overkill; small teams need something simpler`,
    (q, t, a) =>
      a
        ? `${a} report that ${t.toLowerCase()} is their biggest time sink`
        : `Research shows ${t.toLowerCase()} is a major bottleneck for professionals`,
  ],
  fr: [
    (q, t) =>
      `Trop de temps passé sur des tâches manuelles de ${t.toLowerCase()} qui pourraient être automatisées`,
    (q, t) =>
      `Aucun outil ne gère correctement ${t.toLowerCase()} — tout semble inachevé`,
    (q, t) =>
      `Les solutions existantes sont trop chères pour les indépendants ou petites équipes`,
    (q, t) =>
      `Jongler constamment entre 3-4 applications différentes pour compléter les workflows de ${t.toLowerCase()}`,
    (q, t) =>
      `Les clients se plaignent de processus de ${t.toLowerCase()} lents ou confus`,
    (q, t) =>
      `Perte de clients ou de contrats car ${t.toLowerCase()} n'est pas optimisé`,
    (q, t) =>
      `Les outils entreprise sont trop complexes ; les petites équipes ont besoin de simplicité`,
    (q, t, a) =>
      a
        ? `${a} rapportent que ${t.toLowerCase()} est leur plus grande perte de temps`
        : `Les études montrent que ${t.toLowerCase()} est un goulot d'étranglement majeur pour les professionnels`,
  ],
};

const SOURCES = [
  { name: "r/freelance", type: "reddit", url: "https://reddit.com/r/freelance" },
  { name: "r/smallbusiness", type: "reddit", url: "https://reddit.com/r/smallbusiness" },
  { name: "Hacker News", type: "forum", url: "https://news.ycombinator.com" },
  { name: "G2 Reviews", type: "review", url: "https://g2.com" },
  { name: "Indie Hackers", type: "forum", url: "https://indiehackers.com" },
  { name: "r/entrepreneur", type: "reddit", url: "https://reddit.com/r/entrepreneur" },
  { name: "Capterra", type: "review", url: "https://capterra.com" },
  { name: "Reddit", type: "reddit", url: "https://reddit.com" },
];

const SENTIMENTS: Record<Locale, string[]> = {
  en: ["frustrated", "disappointed", "annoyed", "overwhelmed", "confused"],
  fr: ["frustré", "déçu", "agacé", "submergé", "confus"],
};

const PROBLEM_CATEGORIES: Record<Locale, string[]> = {
  en: ["Workflow", "Pricing", "Integration", "UX", "Support", "Automation", "Reporting"],
  fr: ["Workflow", "Tarification", "Intégration", "UX", "Support", "Automatisation", "Reporting"],
};

const TAGS_POOL = [
  "manual-work",
  "expensive",
  "complex",
  "slow",
  "missing-features",
  "support",
  "integration",
  "mobile",
  "automation",
  "pricing",
  "invoicing",
  "scheduling",
  "reporting",
];

const PRODUCT_TEMPLATES: Record<Locale, ((q: string, t: string) => Partial<MockProductIdea>)[]> = {
  en: [
    (q, t) => ({
      title: `Streamlined ${t} for Solo Professionals`,
      description: `A focused tool that handles the core ${t.toLowerCase()} workflow without enterprise bloat. Built for individuals and small teams who need simplicity over feature sprawl.`,
      targetAudience: "Solo practitioners and freelancers",
      monetizationModel: "Monthly subscription ($15-30/mo)",
      differentiation: `Designed from the ground up for the ${t} workflow—not a generic CRM with ${t} bolted on`,
      mvpScope: "Core workflow only: create, send, track. No integrations in v1.",
    }),
    (q, t) => ({
      title: `Lightweight ${t} Platform`,
      description: `Replace your spreadsheet-and-email chaos with a single app. Automates reminders, tracks status, and gives clients a simple portal—all without requiring a full-time ops person.`,
      targetAudience: "Small agencies and consultancies (5-25 people)",
      monetizationModel: "Per-seat pricing ($10-20/seat/mo)",
      differentiation: "Built for service businesses, not product companies. Handles client-facing workflows natively.",
      mvpScope: "Core pipeline + client view + basic reporting. No API in v1.",
    }),
    (q, t) => ({
      title: `Affordable ${t} for Growing Teams`,
      description: `Enterprise-grade ${t.toLowerCase()} at a fraction of the cost. Scales from 1 to 50 users without forcing you to upgrade to a $500/mo plan.`,
      targetAudience: "Startups and SMBs (5-50 employees)",
      monetizationModel: "Tiered pricing ($0-$99/mo)",
      differentiation: "Pay for what you use. No mandatory annual contracts or enterprise sales cycles.",
      mvpScope: "Essential features + Zapier/Make integration. Custom workflows in v2.",
    }),
  ],
  fr: [
    (q, t) => ({
      title: `${t} simplifié pour les indépendants`,
      description: `Un outil focalisé qui gère le workflow principal de ${t.toLowerCase()} sans la complexité des outils entreprise. Conçu pour les individus et petites équipes qui veulent de la simplicité.`,
      targetAudience: "Indépendants et freelances",
      monetizationModel: "Abonnement mensuel (15-30€/mois)",
      differentiation: `Conçu de A à Z pour le workflow ${t} — pas un CRM générique avec ${t} ajouté après coup`,
      mvpScope: "Workflow principal uniquement : créer, envoyer, suivre. Pas d'intégrations en v1.",
    }),
    (q, t) => ({
      title: `Plateforme ${t} légère`,
      description: `Remplacez le chaos des tableurs et emails par une seule application. Automatise les rappels, suit les statuts et offre un portail client simple — sans nécessiter un ops à temps plein.`,
      targetAudience: "Petites agences et cabinets de conseil (5-25 personnes)",
      monetizationModel: "Tarification par utilisateur (10-20€/utilisateur/mois)",
      differentiation: "Conçu pour les entreprises de services, pas les entreprises produit. Gère nativement les workflows orientés client.",
      mvpScope: "Pipeline principal + vue client + reporting basique. Pas d'API en v1.",
    }),
    (q, t) => ({
      title: `${t} abordable pour équipes en croissance`,
      description: `Du ${t.toLowerCase()} de niveau entreprise à une fraction du coût. Passe de 1 à 50 utilisateurs sans vous forcer à upgrader vers un plan à 500€/mois.`,
      targetAudience: "Startups et PME (5-50 employés)",
      monetizationModel: "Tarification par paliers (0-99€/mois)",
      differentiation: "Payez ce que vous utilisez. Pas de contrats annuels obligatoires ni de cycles de vente entreprise.",
      mvpScope: "Fonctionnalités essentielles + intégration Zapier/Make. Workflows personnalisés en v2.",
    }),
  ],
};

const KEYWORD_TEMPLATES: Record<Locale, ((q: string, t: string) => MockKeywordIdea)[]> = {
  en: [
    (q, t) => ({ keyword: `${t} software`, intent: "solution-aware", priority: "high" }),
    (q, t) => ({ keyword: `best ${t.toLowerCase()} tool`, intent: "solution-aware", priority: "high" }),
    (q, t) => ({ keyword: `${t.toLowerCase()} alternatives`, intent: "product-aware", priority: "medium" }),
    (q, t) => ({ keyword: `how to simplify ${t.toLowerCase()}`, intent: "problem-aware", priority: "high" }),
    (q, t) => ({ keyword: `${t.toLowerCase()} for small business`, intent: "solution-aware", priority: "high" }),
    (q, t) => ({ keyword: `cheap ${t.toLowerCase()}`, intent: "solution-aware", priority: "medium" }),
    (q, t) => ({ keyword: `${t.toLowerCase()} automation`, intent: "solution-aware", priority: "high" }),
    (q, t) => ({ keyword: `${t.toLowerCase()} reviews`, intent: "product-aware", priority: "medium" }),
  ],
  fr: [
    (q, t) => ({ keyword: `logiciel ${t.toLowerCase()}`, intent: "solution-aware", priority: "high" }),
    (q, t) => ({ keyword: `meilleur outil ${t.toLowerCase()}`, intent: "solution-aware", priority: "high" }),
    (q, t) => ({ keyword: `alternatives ${t.toLowerCase()}`, intent: "product-aware", priority: "medium" }),
    (q, t) => ({ keyword: `comment simplifier ${t.toLowerCase()}`, intent: "problem-aware", priority: "high" }),
    (q, t) => ({ keyword: `${t.toLowerCase()} pour PME`, intent: "solution-aware", priority: "high" }),
    (q, t) => ({ keyword: `${t.toLowerCase()} pas cher`, intent: "solution-aware", priority: "medium" }),
    (q, t) => ({ keyword: `automatisation ${t.toLowerCase()}`, intent: "solution-aware", priority: "high" }),
    (q, t) => ({ keyword: `avis ${t.toLowerCase()}`, intent: "product-aware", priority: "medium" }),
  ],
};

const OBJECTION_TEMPLATES: Record<Locale, ((q: string, t: string) => string)[]> = {
  en: [
    (q, t) => "Another tool? I already have too many apps to manage.",
    (q, t) => `I've tried ${t.toLowerCase()} tools before and they didn't solve my problem.`,
    (q, t) => "My workflow is too unique—generic tools don't fit.",
    (q, t) => "I can't justify another subscription right now.",
  ],
  fr: [
    (q, t) => "Encore un outil ? J'ai déjà trop d'applications à gérer.",
    (q, t) => `J'ai déjà essayé des outils de ${t.toLowerCase()} avant et ils n'ont pas résolu mon problème.`,
    (q, t) => "Mon workflow est trop spécifique — les outils génériques ne conviennent pas.",
    (q, t) => "Je ne peux pas justifier un autre abonnement en ce moment.",
  ],
};

const CHANNEL_TEMPLATES: Record<Locale, ((q: string, t: string) => MockAcquisitionChannel)[]> = {
  en: [
    (q, t) => ({
      name: "Reddit",
      rationale: `${t} discussions are active in niche subreddits. Organic posts and helpful comments build trust.`,
    }),
    (q, t) => ({
      name: "Content / SEO",
      rationale: `"${t}" and related long-tail keywords have solid search volume. Comparison posts and how-to guides convert.`,
    }),
    (q, t) => ({
      name: "Product Hunt",
      rationale: `Solo builders and early adopters in this space engage here. Launch can drive initial signups.`,
    }),
    (q, t) => ({
      name: "Niche newsletters",
      rationale: `Sponsored posts in newsletters targeting ${t.toLowerCase()} users reach high-intent audiences.`,
    }),
    (q, t) => ({
      name: "LinkedIn",
      rationale: `B2B decision-makers in this space spend time here. Thought leadership and case studies perform well.`,
    }),
  ],
  fr: [
    (q, t) => ({
      name: "Reddit",
      rationale: `Les discussions sur ${t} sont actives dans les subreddits de niche. Les posts organiques et commentaires utiles construisent la confiance.`,
    }),
    (q, t) => ({
      name: "Contenu / SEO",
      rationale: `"${t}" et les mots-clés longue traîne associés ont un bon volume de recherche. Les articles comparatifs et guides pratiques convertissent bien.`,
    }),
    (q, t) => ({
      name: "Product Hunt",
      rationale: `Les builders solo et early adopters de cet espace sont actifs ici. Un lancement peut générer les premiers inscrits.`,
    }),
    (q, t) => ({
      name: "Newsletters de niche",
      rationale: `Les posts sponsorisés dans les newsletters ciblant les utilisateurs de ${t.toLowerCase()} atteignent des audiences à forte intention.`,
    }),
    (q, t) => ({
      name: "LinkedIn",
      rationale: `Les décideurs B2B de cet espace passent du temps ici. Le thought leadership et les études de cas performent bien.`,
    }),
  ],
};

const PHRASE_TEMPLATES: Record<Locale, ((q: string, t: string) => string)[]> = {
  en: [
    (q, t) => t.toLowerCase(),
    (q, t) => "too complicated",
    (q, t) => "wish there was",
    (q, t) => "does anyone know",
    (q, t) => "any alternatives",
    (q, t) => "frustrated with",
    (q, t) => "spending too much time",
  ],
  fr: [
    (q, t) => t.toLowerCase(),
    (q, t) => "trop compliqué",
    (q, t) => "j'aimerais qu'il y ait",
    (q, t) => "quelqu'un connaît",
    (q, t) => "des alternatives",
    (q, t) => "frustré par",
    (q, t) => "je passe trop de temps",
  ],
};

function generatePainPoints(query: string, topic: string, locale: Locale, audience?: string): MockPainPoint[] {
  const count = 5 + Math.floor(hashStr(query + "p") * 3); // 5-7
  const templates = PAIN_TEMPLATES[locale];
  const result: MockPainPoint[] = [];

  for (let i = 0; i < count; i++) {
    const seed = query + "pain" + i;
    const template = templates[Math.floor(hashStr(seed) * templates.length)];
    const source = pickFrom(SOURCES, seed + "src");
    const sentiment = pickFrom(SENTIMENTS[locale], seed + "s");
    const category = pickFrom(PROBLEM_CATEGORIES[locale], seed + "c");
    const tags = pickNFrom(TAGS_POOL, seed + "t", 2);

    result.push({
      text: template(query, topic, audience),
      sourceName: source.name,
      sourceType: source.type,
      sourceUrl: source.url,
      authorHandle: `user_${Math.floor(hashStr(seed + "u") * 9999)}`,
      sentiment,
      frequency: 2 + Math.floor(hashStr(seed + "f") * 5),
      tags,
      audience: audience ?? null,
      problemCategory: category,
      severityScore: 60 + Math.floor(hashStr(seed + "sv") * 35),
    });
  }
  return result;
}

function generateProductIdeas(query: string, topic: string, locale: Locale): MockProductIdea[] {
  return pickNFrom(PRODUCT_TEMPLATES[locale], query + "prod", 3).map((fn) => {
    const base = fn(query, topic);
    return {
      title: base.title ?? "",
      description: base.description ?? "",
      targetAudience: base.targetAudience ?? null,
      monetizationModel: base.monetizationModel ?? null,
      differentiation: base.differentiation ?? null,
      mvpScope: base.mvpScope ?? null,
    };
  });
}

function generateKeywordIdeas(query: string, topic: string, locale: Locale): MockKeywordIdea[] {
  const count = 6 + Math.floor(hashStr(query + "kw") * 3); // 6-8
  return pickNFrom(KEYWORD_TEMPLATES[locale], query + "kw", count).map((fn) => fn(query, topic));
}

function generateObjections(query: string, topic: string, locale: Locale): MockObjection[] {
  const count = 3 + Math.floor(hashStr(query + "obj") * 2); // 3-4
  return pickNFrom(OBJECTION_TEMPLATES[locale], query + "obj", count).map((fn) => ({
    text: fn(query, topic),
  }));
}

function generateAcquisitionChannels(query: string, topic: string, locale: Locale): MockAcquisitionChannel[] {
  const count = 4 + Math.floor(hashStr(query + "ch") * 2); // 4-5
  return pickNFrom(CHANNEL_TEMPLATES[locale], query + "ch", count).map((fn) => fn(query, topic));
}

function generateRecurringPhrases(query: string, topic: string, locale: Locale): MockRecurringPhrase[] {
  const count = 5 + Math.floor(hashStr(query + "rp") * 2); // 5-6
  return pickNFrom(PHRASE_TEMPLATES[locale], query + "rp", count).map((fn) => ({
    phrase: fn(query, topic),
    frequency: 3 + Math.floor(hashStr(query + fn(query, topic)) * 12),
  }));
}

const SUMMARY_TEMPLATES: Record<Locale, (topic: string, audience?: string) => string> = {
  en: (topic, audience) =>
    `Analysis of ${topic} reveals consistent pain points across Reddit, forums, and review sites. Users report frustration with fragmented tools, high costs, and workflows that don't match how ${audience ?? "professionals"} actually work. Demand appears strong for a simplified, purpose-built solution.`,
  fr: (topic, audience) =>
    `L'analyse de ${topic} révèle des points de douleur récurrents sur Reddit, les forums et les sites d'avis. Les utilisateurs rapportent leur frustration face aux outils fragmentés, aux coûts élevés et aux workflows qui ne correspondent pas à la façon dont ${audience ?? "les professionnels"} travaillent réellement. La demande semble forte pour une solution simplifiée et dédiée.`,
};

const MVP_TEMPLATES: Record<Locale, (topic: string) => string> = {
  en: (topic) =>
    `Build a minimal ${topic.toLowerCase()} tool focusing on the top 3 workflows. Launch with core features only—no integrations in v1. Target: ship in 4–6 weeks.`,
  fr: (topic) =>
    `Construisez un outil ${topic.toLowerCase()} minimal centré sur les 3 workflows principaux. Lancez avec les fonctionnalités essentielles uniquement — pas d'intégrations en v1. Objectif : livrer en 4-6 semaines.`,
};

const PRICING_TEMPLATES: Record<Locale, string> = {
  en: "Tiered subscription: $0 (limited), $19/mo (solo), $49/mo (team). Align with competitor pricing but undercut enterprise tools.",
  fr: "Abonnement par paliers : 0€ (limité), 19€/mois (solo), 49€/mois (équipe). Alignez-vous sur les prix de la concurrence tout en étant moins cher que les outils entreprise.",
};

const SEO_TEMPLATES: Record<Locale, (topic: string) => string> = {
  en: (topic) =>
    `Target keywords like "${topic.toLowerCase()} software", "best ${topic.toLowerCase()} tool", and "${topic.toLowerCase()} for small business". Content around comparisons and how-to guides performs well.`,
  fr: (topic) =>
    `Ciblez des mots-clés comme "logiciel ${topic.toLowerCase()}", "meilleur outil ${topic.toLowerCase()}" et "${topic.toLowerCase()} pour PME". Le contenu autour des comparatifs et guides pratiques performe bien.`,
};

export function generateMockAnalysis(
  query: string,
  topic: string,
  audience?: string,
  locale: Locale = "en"
): MockAnalysisResult {
  const h = hashStr(query);
  const opportunityScore = Math.floor(60 + h * 35);
  const demandScore = Math.floor(65 + (h * 0.3) * 30);
  const urgencyScore = Math.floor(60 + (h * 0.7) * 35);
  const competitionScore = Math.floor(55 + (h * 0.5) * 40);
  const monetizationScore = Math.floor(60 + (h * 0.2) * 35);

  const painPoints = generatePainPoints(query, topic, locale, audience);
  const productIdeas = generateProductIdeas(query, topic, locale);
  const keywordIdeas = generateKeywordIdeas(query, topic, locale);
  const objections = generateObjections(query, topic, locale);
  const acquisitionChannels = generateAcquisitionChannels(query, topic, locale);
  const recurringPhrases = generateRecurringPhrases(query, topic, locale);

  return {
    summary: SUMMARY_TEMPLATES[locale](topic, audience),
    opportunityScore,
    demandScore,
    urgencyScore,
    competitionScore,
    monetizationScore,
    recommendedMvp: MVP_TEMPLATES[locale](topic),
    pricingSuggestion: PRICING_TEMPLATES[locale],
    seoSummary: SEO_TEMPLATES[locale](topic),
    painPoints,
    productIdeas,
    keywordIdeas,
    objections,
    acquisitionChannels,
    recurringPhrases,
  };
}
