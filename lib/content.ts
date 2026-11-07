// All of the site's words and facts live here. Edit this file to change content;
// the map, panels and quest pages read from it.

export const SITE_URL = "https://jonner-portfolio.vercel.app";

export const profile = {
  name: "Jonner D. Villapando",
  shortName: "Jonner Villapando",
  role: "Software Developer",
  home: "Manila",
  location: "Manila, Philippines",
  email: "jonnervillapando08@gmail.com",
  linkedin: {
    href: "https://www.linkedin.com/in/jonner-villapando",
    label: "linkedin.com/in/jonner-villapando",
  },
  resume: "/Resume_Villapando-Jonner.pdf",
  // Replace public/profile.jpeg to change the portrait. Any photo works:
  // the site tints it to match the parchment.
  photo: "/profile.jpeg",
  intro:
    "I ship features in Ruby on Rails, and I led the thesis team behind SmishX, an app that catches phishing links in text messages.",
  about: [
    "I studied Computer Science at FEU Institute of Technology, specializing in software engineering. In my final six months I interned at Cybersoft as a software engineer, working on SafeboxIQ, a Ruby on Rails mortgage platform.",
    "I like knowing how things work under the hood. I build things properly, ask why they work, and keep refining them until they make sense. I'm most interested in full-stack development and applied machine learning.",
  ],
  // The "active quest" banner under the map. Set to "" to hide it.
  activeQuest: "Keep sharpening my skills",
};

export type SkillGroup = { category: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  {
    category: "Languages and runtimes",
    items: [
      "Python",
      "JavaScript",
      "TypeScript",
      "Ruby",
      "Node.js",
      "SQL",
      "PHP",
      "Kotlin",
      "C++",
    ],
  },
  {
    category: "Frameworks and libraries",
    items: ["Ruby on Rails", "Next.js", "React", "Tailwind CSS", "Prisma"],
  },
  {
    category: "Tools and platforms",
    items: [
      "Git",
      "GitLab CI/CD",
      "Docker",
      "Google Cloud Platform",
      "Jira",
      "Jupyter Notebook",
    ],
  },
];

export const education = {
  degree: "BS in Computer Science",
  specialization: "Specialization in Software Engineering",
  school: "FEU Institute of Technology",
  location: "Manila, Philippines",
  years: "Sept 2021 – Nov 2025",
  honors: ["Top Performing Student, AY 2021–2022"],
};

export const certifications = [
  { name: "CCNA – DevNet Associate", issuer: "Cisco", year: "2024" },
  {
    name: "IT Specialist: Python",
    issuer: "Certiport / Pearson VUE",
    year: "2023",
  },
  {
    name: "IT Specialist: Java",
    issuer: "Certiport / Pearson VUE",
    year: "2022",
  },
];

export const leadership = [
  {
    role: "Director for Technical",
    org: "ACM Student Chapter",
    orgLong: "Association for Computing Machinery",
    years: "Sep 2023 – Jul 2024",
    points: [
      "Ran technical production for chapter events, leading a student team through setup, execution and troubleshooting.",
      "Worked with academic and industry partners on chapter initiatives that got more students into computing.",
    ],
  },
  {
    role: "Director for Events",
    org: "Itamaraws Esports Club",
    years: "Aug 2022 – Jun 2023",
    points: [
      "Directed the team behind university-wide esports tournaments, handling logistics, budgets and timelines across several events.",
      "Assigned staff and delegated responsibilities so each event ran smoothly.",
    ],
  },
  {
    role: "External Affairs Head",
    org: "CS Expo 2024",
    years: "Oct – Nov 2024",
    points: [
      "Handled external communications and sponsorships for the university-wide showcase of defended Computer Science theses.",
      "Coordinated with industry and academic partners to secure participation and support.",
    ],
  },
  {
    role: "Event Head",
    org: "ACM Kode Kombat: Ascension 2024",
    years: "2024",
    points: [
      "Ran a hackathon for ACM FEU Tech chapter members from start to finish.",
      "Designed the challenges, which tested problem-solving and teamwork.",
    ],
  },
];

// ---------------------------------------------------------------------------
// Quests: the case-study pages at /quests/[slug]
// ---------------------------------------------------------------------------

export type Stat = { value: string; label: string };

export type Quest = {
  slug: string;
  place: string; // slug of the map place this quest belongs to
  kind: "main" | "side";
  title: string;
  summary: string;
  giver: string;
  party?: string;
  role: string;
  season: string;
  tools: string[];
  lore: string[];
  objectives: string[];
  approach?: string[];
  pipeline?: boolean; // show the SmishX pipeline diagram under Approach
  stats?: Stat[];
  statsNote?: string;
  rewards?: string[];
  lessons?: string[];
  note?: string;
  artifacts?: { label: string; detail: string; href: string }[];
};

export const quests: Quest[] = [
  {
    slug: "safeboxiq",
    place: "cybersoft-citadel",
    kind: "main",
    title: "SafeboxIQ",
    summary:
      "Six months as a software engineering intern on a Ruby on Rails mortgage platform, shipping features in a large production codebase.",
    giver: "Cybersoft Inc.",
    role: "Software Engineer Intern",
    season: "May – Nov 2025",
    tools: ["Ruby on Rails", "CoffeeScript", "JavaScript", "Docker", "GitLab CI/CD"],
    lore: [
      "SafeboxIQ is a mortgage and loan processing platform. It automates document handling, income analysis and integration with loan origination systems, so lenders can prepare, validate and manage loan documents in one place.",
      "I joined as an intern and worked real tickets across the backend and the frontend of a large production codebase. Everything I built was merged into production.",
    ],
    objectives: [
      "Built a PDF generation flow for Exception Forms. It runs when a loan decision is Approved, Conditionally Approved or Counter Offered, and carries the decision data through the loan exception workflow.",
      "Made password reset and confirmation email links tenant-aware, so each user lands on the namespace they are allowed to log into. This fixed a multi-tenant authentication issue.",
      "Added cross-field validation to bank account intake in loan pre-qualification, blocking duplicate account numbers across up to three accounts. I wrote both the Rails check and the inline error message.",
      "Built a cascading Account Executive dropdown in the broker workflow. Its options fill in based on the selected Channel.",
      "Fixed bugs across database migrations, form validation and the frontend.",
      "Helped other interns find their way around the codebase so they could unblock their own tickets.",
    ],
    approach: [
      "Most tickets touched both sides of the stack. The bank account validation, for example, needed a check in the Rails backend and an inline error in the form.",
      "Every change went through a merge request and code review, then shipped through Docker and GitLab CI/CD.",
    ],
    stats: [{ value: "40+", label: "merge requests merged into production" }],
    rewards: [
      "Learned how a real engineering team reviews, tests and ships code.",
    ],
    note: "The SafeboxIQ codebase is private, so this page has no screenshots or code.",
  },
  {
    slug: "smishx",
    place: "phishing-coast",
    kind: "main",
    title: "SmishX",
    summary:
      "An Android app that checks the links in incoming text messages and flags phishing URLs before anyone taps them.",
    giver: "FEU Tech Computer Science thesis",
    party: "4 people",
    role: "Project manager, assistant back-end developer, documentation",
    season: "2024",
    tools: ["Kotlin", "Python", "Random Forest", "XGBoost", "TF-IDF", "SMOTE"],
    lore: [
      "Filipinos send more text messages than almost anyone in the world, which makes SMS phishing, or smishing, an easy way to steal accounts here. A scam text usually carries one link to a fake login page or a spyware download.",
      "SIM registration and carrier filtering stop some of it, but plenty of smishing still reaches people's phones. Our thesis asked whether a phone could catch the link itself.",
    ],
    objectives: [
      "Build an Android app that detects phishing URLs in SMS in real time, using Random Forest and XGBoost.",
      "Train the model on public phishing-detection datasets.",
      "Design an interface that fits the Android ecosystem.",
      "Measure how accurately the app catches malicious URLs.",
    ],
    approach: [
      "As project manager, I coordinated the team through five Scrum sprints from April to June 2024: research and design, two development sprints, deployment with user testing, and a final sprint to compile results and documentation.",
      "We trained on a 20,000-URL dataset from Kaggle with an 80/20 split, balanced the classes with SMOTE, and tuned each model with randomized search and cross-validation.",
    ],
    pipeline: true,
    stats: [
      { value: "99.38%", label: "accuracy" },
      { value: "99.49%", label: "precision" },
      { value: "99.29%", label: "recall" },
      { value: "99.39%", label: "F1 score" },
    ],
    statsNote:
      "Measured on the 3,887 URLs held out for testing: 1,915 legitimate and 1,972 phishing.",
    rewards: [
      "50 testers, from computer science students to CS/IT professionals and everyday internet users, rated the app “Strongly agree” in all five ISO 25010 categories we surveyed: effectiveness, performance, reliability, usability and security.",
      "IT officers at the Department of Information and Communications Technology (DICT) reviewed and validated the system.",
    ],
    lessons: [
      "The DICT reviewers' main note was that accuracy isn't enough on its own. The verdicts needed to be easier for non-technical users to understand.",
      "Our recommendations for future work were deep learning models, DNS-level blocking, and an iOS version.",
    ],
    artifacts: [
      {
        label: "Read the thesis",
        detail: "A Comprehensive Phishing Detection System Using Machine Learning Algorithms · PDF, 6 MB",
        href: "/SmishX_Thesis.pdf",
      },
    ],
  },
  {
    slug: "routa",
    place: "routa-crossroads",
    kind: "side",
    title: "Routa",
    summary:
      "A pitch for an app that tracks public utility vehicles in Metro Manila and recommends faster routes.",
    giver: "Technopreneurship course, FEU Tech",
    role: "Marketing",
    season: "2024",
    tools: [],
    lore: [
      "Commuting in Metro Manila means guessing: when the next jeepney or bus will come, and which route is fastest today. Routa's idea was real-time public vehicle locations and route recommendations in one app.",
    ],
    objectives: [
      "Shape a product pitch around a daily commute problem most Filipinos know well.",
      "Own the marketing side of the pitch.",
    ],
    note: "Routa is a pitch concept. It was never built or deployed.",
  },
];

export function getQuest(slug: string) {
  return quests.find((quest) => quest.slug === slug);
}

// ---------------------------------------------------------------------------
// Places on the map. Coordinates are in map units (1600 × 1000).
// Order is the journey order: it drives the trail, the fast-travel list and
// the keyboard tab order.
// ---------------------------------------------------------------------------

export type PlaceKind = "main" | "side" | "landmark" | "inn" | "sealed";

export type Place = {
  slug: string;
  name: string;
  subtitle: string;
  kind: PlaceKind;
  kindLabel: string;
  x: number;
  y: number;
  label: "below" | "above" | "left" | "right";
  quest?: string;
  // Two or three short facts shown when hovering the place on the map.
  peek: string[];
};

const skillCount = skillGroups.reduce((total, group) => total + group.items.length, 0);

export const places: Place[] = [
  {
    slug: "feu-highlands",
    name: "FEU Highlands",
    subtitle: "Computer Science degree · 2021–2025",
    kind: "landmark",
    kindLabel: "Landmark",
    x: 420,
    y: 300,
    label: "below",
    peek: ["BS Computer Science, software engineering", "Top Performing Student, AY 2021–2022", "3 certifications"],
  },
  {
    slug: "guild-hall",
    name: "The Guild Hall",
    subtitle: "Leadership roles · 2022–2024",
    kind: "landmark",
    kindLabel: "Landmark",
    x: 840,
    y: 240,
    label: "below",
    peek: ["4 leadership roles", "ACM, Itamaraws Esports, CS Expo, Kode Kombat"],
  },
  {
    slug: "phishing-coast",
    name: "Phishing Coast",
    subtitle: "SmishX thesis · 2024",
    kind: "main",
    kindLabel: "Main quest",
    x: 1215,
    y: 390,
    label: "right",
    quest: "smishx",
    peek: ["99.38% accuracy on 3,887 test URLs", "Project manager of a 4-person team"],
  },
  {
    slug: "routa-crossroads",
    name: "Routa Crossroads",
    subtitle: "Commuter app pitch · 2024",
    kind: "side",
    kindLabel: "Side quest",
    x: 1060,
    y: 650,
    label: "below",
    quest: "routa",
    peek: ["Commuter app pitch for Metro Manila", "Owned the marketing side"],
  },
  {
    slug: "cybersoft-citadel",
    name: "Cybersoft Citadel",
    subtitle: "SafeboxIQ internship · 2025",
    kind: "main",
    kindLabel: "Main quest",
    x: 735,
    y: 600,
    label: "below",
    quest: "safeboxiq",
    peek: ["40+ merge requests merged into production", "Ruby on Rails · May to Nov 2025"],
  },
  {
    slug: "sealed-commission",
    name: "Sealed Commission",
    subtitle: "Freelance full-stack · 2026 to now",
    kind: "sealed",
    kindLabel: "Sealed commission",
    x: 875,
    y: 520,
    label: "right",
    peek: ["Freelance full-stack engineer", "50+ pull requests delivered", "Details sealed under NDA"],
  },
  {
    slug: "tinkers-workshop",
    name: "Tinker's Workshop",
    subtitle: "Skills and tools",
    kind: "landmark",
    kindLabel: "Landmark",
    x: 340,
    y: 590,
    label: "below",
    peek: [`${skillCount} languages, frameworks and tools`, "Rails, Python, Kotlin, Docker and more"],
  },
  {
    slug: "wayfarers-inn",
    name: "The Wayfarer's Inn",
    subtitle: "About and contact",
    kind: "inn",
    kindLabel: "You are here",
    x: 560,
    y: 815,
    label: "right",
    peek: ["About me", "Email, LinkedIn and CV"],
  },
];

// ---------------------------------------------------------------------------
// The sealed commission: current freelance work under NDA. Only the role,
// the start year and the count below are public.
// ---------------------------------------------------------------------------

export const commission = {
  role: "Freelance Full-Stack Engineer",
  since: "2026",
  stat: { value: "50+", label: "pull requests delivered" },
};

// ---------------------------------------------------------------------------
// Character sheet (/character)
// ---------------------------------------------------------------------------

export const character = {
  className: "Software Developer",
  specialization: "Full-stack web · Applied ML",
  home: "Manila, Philippines",
  guild: "ACM Student Chapter, FEU Tech",
};

// Real numbers only. Each one is backed by a quest page, the résumé or the thesis.
export const characterStats: Stat[] = [
  { value: "40+", label: "merge requests merged into production" },
  { value: commission.stat.value, label: "pull requests delivered as a freelancer" },
  { value: "99.38%", label: "thesis model accuracy" },
  { value: String(leadership.length), label: "leadership roles" },
  { value: String(certifications.length), label: "certifications" },
];

export type SkillProof = { name: string; proof?: string; href?: string };
export type SkillTier = { tier: string; blurb: string; skills: SkillProof[] };

const productionSkills: SkillProof[] = [
  { name: "Ruby on Rails", proof: "SafeboxIQ backend and forms", href: "/quests/safeboxiq" },
  { name: "Ruby", proof: "SafeboxIQ", href: "/quests/safeboxiq" },
  { name: "JavaScript", proof: "SafeboxIQ frontend", href: "/quests/safeboxiq" },
  { name: "CoffeeScript", proof: "SafeboxIQ frontend", href: "/quests/safeboxiq" },
  { name: "Docker", proof: "Every SafeboxIQ change shipped through it", href: "/quests/safeboxiq" },
  { name: "GitLab CI/CD", proof: "SafeboxIQ pipelines", href: "/quests/safeboxiq" },
  { name: "Git", proof: "40+ merge requests at Cybersoft", href: "/quests/safeboxiq" },
];

const projectSkills: SkillProof[] = [
  { name: "Python", proof: "SmishX model · IT Specialist certified", href: "/quests/smishx" },
  { name: "Kotlin", proof: "SmishX Android app", href: "/quests/smishx" },
];

const proven = new Set([...productionSkills, ...projectSkills].map((skill) => skill.name));

// Skills grouped by how they were proven. Move a skill up a tier when there's
// public evidence for it.
export const skillTiers: SkillTier[] = [
  {
    tier: "Shipped to production",
    blurb: "Used on SafeboxIQ, where everything I built was merged into production.",
    skills: productionSkills,
  },
  {
    tier: "Used in projects",
    blurb: "Proven on SmishX, my thesis project.",
    skills: projectSkills,
  },
  {
    tier: "Also in the toolbox",
    blurb: "Languages and tools I've worked with, from my résumé.",
    skills: skillGroups
      .flatMap((group) => group.items)
      .filter((name) => !proven.has(name))
      .map((name) => ({ name })),
  },
];

export type Achievement = {
  title: string;
  detail: string;
  year: string;
  icon: "honor" | "cert" | "lead" | "craft" | "quest" | "seal";
};

export const achievements: Achievement[] = [
  { title: "Top Performing Student", detail: "FEU Tech, AY 2021–2022", year: "2022", icon: "honor" },
  { title: "IT Specialist: Java", detail: "Certiport / Pearson VUE", year: "2022", icon: "cert" },
  {
    title: "Tournament Director",
    detail: "Ran university-wide esports tournaments for Itamaraws Esports Club",
    year: "2022–23",
    icon: "lead",
  },
  { title: "IT Specialist: Python", detail: "Certiport / Pearson VUE", year: "2023", icon: "cert" },
  { title: "CCNA – DevNet Associate", detail: "Cisco", year: "2024", icon: "cert" },
  {
    title: "Thesis Accepted",
    detail: "SmishX, reviewed and validated by DICT IT officers",
    year: "2024",
    icon: "quest",
  },
  {
    title: "99.38% Accuracy",
    detail: "SmishX's stacked model on 3,887 held-out URLs",
    year: "2024",
    icon: "craft",
  },
  { title: "Hackathon Host", detail: "Ran ACM Kode Kombat: Ascension 2024", year: "2024", icon: "lead" },
  {
    title: "Shipped to Production",
    detail: "40+ merge requests merged into production at Cybersoft",
    year: "2025",
    icon: "craft",
  },
  { title: "Graduated", detail: "BS Computer Science, FEU Tech", year: "2025", icon: "honor" },
  {
    title: "Sealed Commission",
    detail: "Freelance full-stack engineer, 50+ pull requests delivered",
    year: "2026",
    icon: "seal",
  },
];

// Fogged land for projects that aren't on the map yet. When you add a new
// project, turn one of these into a real place above.
export const uncharted = [
  { x: 1440, y: 170, label: "Uncharted isle" },
  { x: 175, y: 860, label: "Uncharted" },
];

// The map's coordinate window. The island lives in 0-1600 by 0-1000; the
// extra margin is open sea, so when the map is cropped to fill a screen only
// water is lost. Keep the 16:10 shape.
export const MAP_VIEW = { x: -200, y: -125, w: 2000, h: 1250 };

/** A map coordinate as a percentage position inside the map sheet. */
export function mapPercent(x: number, y: number) {
  return {
    left: `${((x - MAP_VIEW.x) / MAP_VIEW.w) * 100}%`,
    top: `${((y - MAP_VIEW.y) / MAP_VIEW.h) * 100}%`,
  };
}

export function getPlace(slug: string) {
  return places.find((place) => place.slug === slug);
}
