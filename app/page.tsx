"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Award,
  Code2,
  ExternalLink,
  GraduationCap,
  Mail,
  Menu,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Inline LinkedIn icon — lucide-react v1 removed brand logo icons,
// so we ship our own SVG to avoid the missing-export error.
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.268 2.37 4.268 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const EMAIL = "jonnervillapando08@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/jonner-villapando";
const RESUME_PATH = "/Resume_Villapando-Jonner.pdf";

type SkillGroup = { category: string; items: string[] };

const skillGroups: SkillGroup[] = [
  {
    category: "Languages",
    items: [
      "Python",
      "JavaScript",
      "TypeScript",
      "Ruby",
      "SQL",
      "PHP",
      "Kotlin",
      "C++",
    ],
  },
  {
    category: "Frameworks & Tools",
    items: ["Ruby on Rails", "Next.js", "Tailwind CSS", "Prisma"],
  },
  {
    category: "Platforms",
    items: [
      "Docker",
      "GitLab CI/CD",
      "Git",
      "Google Cloud Platform",
      "Jira",
      "Jupyter Notebook",
    ],
  },
];

const projects: Array<{
  title: string;
  type: string;
  role: string;
  year: string;
  description: string;
  highlights: string[];
  href?: string;
  linkLabel?: string;
}> = [
  {
    title: "SmishX",
    type: "Thesis · Machine Learning",
    role: "Project Manager",
    year: "2025",
    description:
      "An SMS phishing detection system that uses an ensemble of Random Forest and XGBoost to classify suspicious URLs. Built as a thesis research project focused on improving mobile security by flagging malicious links before a user taps them.",
    highlights: [
      "Random Forest + XGBoost ensemble",
      "Security-focused thesis research",
      "Led the project as PM, coordinating the team",
    ],
    href: "/SmishX_Thesis.pdf",
    linkLabel: "Read thesis paper (PDF)",
  },
  {
    title: "Routa",
    type: "Pitch Project · Technopreneurship",
    role: "Marketing",
    year: "2024",
    description:
      "A PUV tracking and route optimization app concept for Metro Manila commuters. The idea provides real-time public vehicle updates and efficient route recommendations for a daily commute problem most Filipinos know well.",
    highlights: [
      "Pitch concept, not a deployed product",
      "Focused on real commuter problems in Metro Manila",
      "Owned the marketing side of the pitch",
    ],
  },
];

const experience = [
  {
    role: "Software Engineer — Intern",
    company: "Cybersoft Inc.",
    project: "SafeboxIQ",
    year: "May 2025 – Nov 2025",
    description:
      "Worked on a Ruby on Rails mortgage services platform. Shipped features and fixes across the loan computation flow, pre-qualification logic, and UI refinements, while learning how a real engineering team reviews, tests, and ships code.",
    highlights: [
      "Built features and resolved tickets that were merged into staging",
      "Improved loan calculation accuracy and pre-qualification flows",
      "Refined layouts across pages and data tables",
      "Implemented form validation and resolved frontend issues",
      "Worked with Docker and GitLab CI/CD for version control and deployment",
      "Assisted fellow interns with guidance and technical support",
    ],
    stack: ["Ruby on Rails", "CoffeeScript", "JavaScript", "Docker", "GitLab"],
  },
];

const education = {
  degree: "BS in Computer Science",
  specialization: "Specialization in Software Engineering",
  school: "FEU Institute of Technology",
  location: "Manila, Philippines",
  years: "2021 – 2025",
};

const certifications = [
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

const leadership = [
  {
    role: "Director for Technical",
    org: "ACM Student Chapter",
    orgLong: "Association for Computing Machinery",
    year: "Sep 2023 – Jul 2024",
    description:
      "Coordinated with academic and industry partners to promote student engagement in computing research and innovation.",
    highlights: [
      "Led outreach and engagement initiatives",
      "Contributed to sustained organizational growth on campus",
    ],
  },
  {
    role: "Director for Events",
    org: "Itamaraws Esports Club",
    year: "Aug 2022 – Jun 2023",
    description:
      "Planned, organized, and executed major esports tournaments and gaming events for the university community.",
    highlights: [
      "Ran event budgets, timelines, and staff coordination",
      "Delivered high-quality competitive experiences for students",
    ],
  },
  {
    role: "External Affairs Head",
    org: "CS Expo 2024",
    year: "2024",
    description:
      "A university-wide exposition presenting defended Computer Science theses, highlighting innovative student research.",
    highlights: [
      "Fostered collaboration between academia and industry",
      "Managed external partnerships for the event",
    ],
  },
  {
    role: "Event Head",
    org: "ACM Kode Kombat: Ascension 2024",
    year: "2024",
    description:
      "A hackathon for ACM FEUTECH chapter members, featuring diverse technical challenges in computer science.",
    highlights: [
      "Designed problems that tested problem-solving and teamwork",
      "Ran the event end-to-end for chapter members",
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

type Star = {
  x: number;
  y: number;
  size: number;
  driftX: number;
  driftY: number;
};

function createStars(count: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random(),
    size: Math.random() * 1.6 + 0.5,
    driftX: (Math.random() - 0.5) * 0.0007,
    driftY: (Math.random() - 0.5) * 0.0007,
  }));
}

function ConstellationBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    // Respect user's reduced-motion preference.
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const liveStars = createStars(160);
    let backgroundDots: { x: number; y: number; r: number; a: number }[] = [];

    const buildDots = () => {
      backgroundDots = Array.from({ length: 220 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.2,
        a: Math.random() * 0.25,
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildDots();
    };

    const handleMove = (event: MouseEvent) => {
      mouseRef.current = {
        x: event.clientX,
        y: event.clientY,
        active: true,
      };
    };

    const handleLeave = () => {
      mouseRef.current.active = false;
    };

    resize();
    window.addEventListener("resize", resize);

    // Static render for reduced motion: paint once, skip animation loop and mouse listeners.
    if (prefersReducedMotion) {
      ctx.clearRect(0, 0, width, height);

      backgroundDots.forEach((dot) => {
        ctx.beginPath();
        ctx.fillStyle = `rgba(148,163,184,${dot.a})`;
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fill();
      });

      liveStars.forEach((star) => {
        ctx.beginPath();
        ctx.fillStyle = "rgba(240, 249, 255, 0.9)";
        ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      return () => {
        window.removeEventListener("resize", resize);
      };
    }

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);

    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      backgroundDots.forEach((dot) => {
        ctx.beginPath();
        ctx.fillStyle = `rgba(148,163,184,${dot.a})`;
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fill();
      });

      const pointer = mouseRef.current;

      const positions = liveStars.map((star) => {
        star.x += star.driftX;
        star.y += star.driftY;

        if (star.x < -0.05) star.x = 1.05;
        if (star.x > 1.05) star.x = -0.05;
        if (star.y < -0.05) star.y = 1.05;
        if (star.y > 1.05) star.y = -0.05;

        let px = star.x * width;
        let py = star.y * height;

        if (pointer.active) {
          const dx = pointer.x - px;
          const dy = pointer.y - py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const radius = Math.min(width, height) * 0.24;

          if (dist < radius) {
            const force = (1 - dist / radius) * 18;
            px += (dx / Math.max(dist, 1)) * force;
            py += (dy / Math.max(dist, 1)) * force;
          }
        }

        return { x: px, y: py, size: star.size };
      });

      for (let i = 0; i < positions.length; i += 1) {
        const a = positions[i];
        for (let j = i + 1; j < positions.length; j += 1) {
          const b = positions[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = pointer.active ? 110 : 82;

          if (dist < maxDist) {
            const alpha =
              (1 - dist / maxDist) * (pointer.active ? 0.28 : 0.13);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(252, 211, 77, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      positions.forEach((star) => {
        ctx.beginPath();
        ctx.fillStyle = "rgba(240, 249, 255, 0.9)";
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      if (pointer.active) {
        const glow = ctx.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          180
        );
        glow.addColorStop(0, "rgba(251, 191, 36, 0.14)");
        glow.addColorStop(1, "rgba(251, 191, 36, 0)");

        ctx.beginPath();
        ctx.fillStyle = glow;
        ctx.arc(pointer.x, pointer.y, 180, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-90"
      aria-hidden="true"
    />
  );
}

function SectionHeading({
  index,
  title,
  subtitle,
}: {
  index: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-8 grid gap-3 md:grid-cols-[120px_1fr] md:items-start">
      <div className="text-xs uppercase tracking-[0.28em] text-amber-300/80">
        {index}
      </div>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
  );
}

export default function PortfolioPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#020617] text-slate-100">
      <ConstellationBackground />

      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at 12% 18%, rgba(251,191,36,0.20), transparent 24%), radial-gradient(circle at 82% 16%, rgba(96,165,250,0.14), transparent 22%), radial-gradient(circle at 50% 75%, rgba(168,85,247,0.08), transparent 28%), linear-gradient(to bottom, rgba(2,6,23,0.32), rgba(2,6,23,0.68))",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.05) 0, transparent 22%), radial-gradient(circle at 78% 22%, rgba(251,191,36,0.08) 0, transparent 18%), radial-gradient(circle at 62% 70%, rgba(96,165,250,0.06) 0, transparent 20%)",
        }}
      />

      <main className="relative z-10 w-full px-4 py-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
        <div className="w-full overflow-hidden border border-white/10 bg-slate-950/30 backdrop-blur-[2px] shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_30px_80px_rgba(2,6,23,0.30)]">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/50 backdrop-blur-[2px]">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <a
                href="#top"
                className="flex items-center gap-3"
                aria-label="Home"
              >
                <div className="flex h-10 w-10 items-center justify-center border border-amber-300/30 bg-amber-400/10 font-mono text-sm font-semibold text-amber-200 shadow-[0_0_24px_rgba(251,191,36,0.12)]">
                  [J]
                </div>
              </a>

              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                className="flex h-10 w-10 items-center justify-center border border-white/10 bg-slate-800/80 text-slate-200 lg:hidden"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>

              <nav className="hidden items-center gap-8 text-sm text-slate-300 lg:flex">
                <a href="#experience" className="transition hover:text-white">
                  Experience
                </a>
                <a href="#projects" className="transition hover:text-white">
                  Projects
                </a>
                <a href="#education" className="transition hover:text-white">
                  Education
                </a>
                <a href="#leadership" className="transition hover:text-white">
                  Leadership
                </a>
              </nav>
            </div>

            {menuOpen && (
              <div className="border-t border-white/10 px-4 py-4 lg:hidden">
                <nav className="flex flex-col gap-3 text-sm text-slate-300">
                  <a
                    href="#experience"
                    onClick={() => setMenuOpen(false)}
                    className="transition hover:text-white"
                  >
                    Experience
                  </a>
                  <a
                    href="#projects"
                    onClick={() => setMenuOpen(false)}
                    className="transition hover:text-white"
                  >
                    Projects
                  </a>
                  <a
                    href="#education"
                    onClick={() => setMenuOpen(false)}
                    className="transition hover:text-white"
                  >
                    Education
                  </a>
                  <a
                    href="#leadership"
                    onClick={() => setMenuOpen(false)}
                    className="transition hover:text-white"
                  >
                    Leadership
                  </a>
                </nav>
              </div>
            )}
          </header>

          <section className="min-h-[calc(100svh-80px)]">
            <div>
              <motion.section
                initial="hidden"
                animate="show"
                variants={fadeUp}
                transition={{ duration: 0.65 }}
                className="grid gap-0 border-b border-white/10 xl:grid-cols-[1.1fr_0.9fr]"
              >
                <div className="border-b border-white/10 bg-white/[0.012] p-5 sm:p-8 md:p-10 xl:border-b-0 xl:border-r xl:border-white/10 xl:p-12 2xl:p-16">
                  <div className="inline-flex items-center gap-2 border border-amber-300/20 bg-amber-400/10 px-3 py-2 text-xs uppercase tracking-[0.22em] text-amber-200">
                    <Sparkles className="h-3.5 w-3.5" />
                    Building real software
                  </div>

                  <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                    <div className="relative shrink-0">
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.25 }}
                        className="relative h-28 w-28 overflow-hidden rounded-xl border border-amber-300/30 bg-amber-400/10 shadow-inner shadow-black/30 transition-all duration-300 hover:border-amber-300/60 hover:shadow-[0_0_25px_rgba(251,191,36,0.25)] sm:h-32 sm:w-32 md:h-36 md:w-36 xl:h-40 xl:w-40"
                      >
                        <Image
                          src="/profile.jpg"
                          alt="Jonner D. Villapando"
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, (max-width: 1280px) 144px, 160px"
                          priority
                        />
                        <div className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.25),transparent_60%)]" />
                      </motion.div>
                    </div>

                    <div className="min-w-0">
                      <h1 className="text-4xl font-semibold leading-[0.95] tracking-tight text-white sm:text-5xl md:text-6xl xl:text-7xl 2xl:text-[5.5rem]">
                        Jonner D. Villapando
                      </h1>
                      <p className="mt-4 text-sm uppercase tracking-[0.22em] text-amber-200 sm:text-base">
                        Software Developer
                      </p>
                      <p className="mt-4 text-sm text-amber-300/80 sm:text-base">
                        Leveling up, one commit at a time
                      </p>
                    </div>
                  </div>

                  <p className="mt-10 max-w-4xl text-sm leading-8 text-slate-300 sm:text-base md:text-lg">
                    Computer Science graduate from FEU Institute of Technology
                    with a growing interest in full-stack development,
                    practical systems, and applied machine learning. I enjoy
                    understanding how things work under the hood and turning
                    that into software that feels reliable and well-built.
                  </p>
                  <p className="mt-5 max-w-4xl text-sm leading-8 text-slate-400 sm:text-base">
                    What I can offer is strong curiosity, practical effort,
                    and a genuine willingness to improve. I like building
                    things properly, asking why they work, and refining them
                    until they make sense.
                  </p>

                  <div className="mt-10 flex flex-wrap gap-3">
                    <Button
                      asChild
                      className="border border-white bg-white px-5 text-slate-950 hover:bg-slate-200"
                    >
                      <a href="#projects">View Projects</a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="border-white/20 bg-transparent px-5 text-white hover:bg-white/10"
                    >
                      <a
                        href={RESUME_PATH}
                        download
                        aria-label="Download CV as PDF"
                      >
                        Download CV
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="border-white/20 bg-transparent px-5 text-white hover:bg-white/10"
                    >
                      <a href={`mailto:${EMAIL}`} aria-label="Send email">
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="border-white/20 bg-transparent px-5 text-white hover:bg-white/10"
                    >
                      <a
                        href={LINKEDIN_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open LinkedIn profile"
                      >
                        <LinkedinIcon className="mr-2 h-4 w-4" />
                        LinkedIn
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="bg-gradient-to-b from-transparent to-white/[0.006] p-5 sm:p-8 md:p-10 xl:p-12 2xl:p-16">
                  <div className="border border-white/10 bg-[#050b18]/68 shadow-[0_20px_60px_rgba(2,6,23,0.28)]">
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                      </div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        stack.ts
                      </p>
                    </div>

                    <div className="space-y-4 p-5 font-mono text-xs leading-7 text-slate-300 sm:text-sm">
                      <div>
                        <span className="text-slate-500">const</span> stack{" "}
                        <span className="text-slate-500">=</span> {"{"}
                      </div>

                      <div className="pl-4 space-y-3">
                        <div>
                          <div>
                            <span className="text-amber-300">languages</span>: [
                          </div>
                          <div className="pl-4 break-words">
                            {skillGroups[0].items.map((item, i) => (
                              <span key={item}>
                                <span className="text-emerald-300">
                                  &quot;{item}&quot;
                                </span>
                                {i < skillGroups[0].items.length - 1 ? ", " : ""}
                              </span>
                            ))}
                          </div>
                          <div>],</div>
                        </div>

                        <div>
                          <div>
                            <span className="text-amber-300">frameworks</span>: [
                          </div>
                          <div className="pl-4 break-words">
                            {skillGroups[1].items.map((item, i) => (
                              <span key={item}>
                                <span className="text-emerald-300">
                                  &quot;{item}&quot;
                                </span>
                                {i < skillGroups[1].items.length - 1 ? ", " : ""}
                              </span>
                            ))}
                          </div>
                          <div>],</div>
                        </div>

                        <div>
                          <div>
                            <span className="text-amber-300">platforms</span>: [
                          </div>
                          <div className="pl-4 break-words">
                            {skillGroups[2].items.map((item, i) => (
                              <span key={item}>
                                <span className="text-emerald-300">
                                  &quot;{item}&quot;
                                </span>
                                {i < skillGroups[2].items.length - 1 ? ", " : ""}
                              </span>
                            ))}
                          </div>
                          <div>],</div>
                        </div>
                      </div>

                      <div>{"}"}</div>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* 01 Experience */}
              <section
                id="experience"
                className="p-5 sm:p-8 md:p-10 xl:p-12 2xl:p-16"
              >
                <SectionHeading
                  index="01"
                  title="Experience"
                  subtitle="Where I have applied my skills in a real engineering environment."
                />

                <div className="grid gap-6">
                  {experience.map((exp, index) => (
                    <motion.article
                      key={exp.company}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: 0.5, delay: index * 0.07 }}
                      className="border border-white/15 bg-slate-900/90 p-5 sm:p-7"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] text-amber-300/90">
                            {exp.role}
                          </p>
                          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                            {exp.company}
                          </h3>
                          {exp.project && (
                            <p className="mt-1 text-sm text-slate-400">
                              Project:{" "}
                              <span className="text-slate-200">
                                {exp.project}
                              </span>
                            </p>
                          )}
                        </div>
                        <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          {exp.year}
                        </span>
                      </div>

                      <p className="mt-6 text-sm leading-7 text-slate-300">
                        {exp.description}
                      </p>

                      {exp.stack && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {exp.stack.map((tech) => (
                            <span
                              key={tech}
                              className="border border-amber-300/20 bg-amber-400/10 px-2.5 py-1 text-xs text-amber-100"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-5 space-y-3">
                        {exp.highlights.map((item) => (
                          <div
                            key={item}
                            className="border border-white/10 bg-[#061120] px-4 py-3 text-sm text-slate-200"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </motion.article>
                  ))}
                </div>
              </section>

              <div className="px-5 sm:px-8 md:px-10 xl:px-12 2xl:px-16">
                <Divider />
              </div>

              {/* 02 Projects */}
              <section
                id="projects"
                className="p-5 sm:p-8 md:p-10 xl:p-12 2xl:p-16"
              >
                <SectionHeading
                  index="02"
                  title="Projects"
                  subtitle="A mix of thesis work, internship contributions, and pitch projects that show how I approach software development."
                />

                <div className="grid gap-6 xl:grid-cols-2">
                  {projects.map((project, index) => (
                    <motion.article
                      key={project.title}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: 0.5, delay: index * 0.07 }}
                      className={`group relative flex flex-col border border-white/15 bg-slate-900/95 p-5 transition duration-300 sm:p-6 ${
                        project.href
                          ? "hover:-translate-y-1 hover:border-amber-300/40 hover:bg-slate-800 focus-within:border-amber-300/60"
                          : ""
                      }`}
                    >
                      {project.href && (
                        <a
                          href={project.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={project.linkLabel ?? `Open ${project.title}`}
                          className="absolute inset-0 z-10 focus:outline-none"
                        >
                          <span className="sr-only">
                            {project.linkLabel ?? `Open ${project.title}`}
                          </span>
                        </a>
                      )}

                      <div className="relative flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] text-amber-300/90">
                            {project.type}
                          </p>
                          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                            {project.title}
                          </h3>
                          <p className="mt-1 text-xs text-slate-400">
                            Role:{" "}
                            <span className="text-slate-200">
                              {project.role}
                            </span>
                          </p>
                        </div>
                        {project.href && (
                          <div className="border border-white/10 bg-slate-800/80 p-2 text-slate-300 transition group-hover:text-white">
                            <ExternalLink className="h-4 w-4" />
                          </div>
                        )}
                      </div>

                      <p className="relative mt-6 text-sm leading-7 text-slate-300">
                        {project.description}
                      </p>

                      <div className="relative mt-6 border-y border-white/10 py-3 text-xs uppercase tracking-[0.22em] text-slate-500">
                        <span>{project.year}</span>
                        {project.href && (
                          <span className="float-right text-amber-300/80">
                            {project.linkLabel}
                          </span>
                        )}
                      </div>

                      <div className="relative mt-5 space-y-3">
                        {project.highlights.map((item) => (
                          <div
                            key={item}
                            className="border border-white/10 bg-[#061120] px-4 py-3 text-sm text-slate-200"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </motion.article>
                  ))}
                </div>
              </section>

              <div className="px-5 sm:px-8 md:px-10 xl:px-12 2xl:px-16">
                <Divider />
              </div>

              {/* 03 Education & Certifications */}
              <section
                id="education"
                className="p-5 sm:p-8 md:p-10 xl:p-12 2xl:p-16"
              >
                <SectionHeading
                  index="03"
                  title="Education & Certifications"
                  subtitle="Where I studied and the certifications I picked up along the way."
                />

                <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                  <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeUp}
                    transition={{ duration: 0.55 }}
                    className="border border-white/15 bg-slate-900/90 p-5 sm:p-7"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center border border-amber-300/20 bg-amber-400/10 text-amber-300">
                        <GraduationCap className="h-5 w-5" />
                      </div>
                      <p className="text-xs uppercase tracking-[0.22em] text-amber-300/90">
                        Education
                      </p>
                    </div>

                    <h3 className="mt-5 text-xl font-semibold tracking-tight text-white">
                      {education.degree}
                    </h3>
                    <p className="mt-1 text-sm text-slate-300">
                      {education.specialization}
                    </p>

                    <div className="mt-5 border-t border-white/10 pt-4">
                      <p className="text-sm text-slate-200">{education.school}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {education.location}
                      </p>
                      <p className="mt-3 text-xs uppercase tracking-[0.22em] text-slate-500">
                        {education.years}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeUp}
                    transition={{ duration: 0.55, delay: 0.08 }}
                    className="border border-white/15 bg-slate-900/90 p-5 sm:p-7"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center border border-amber-300/20 bg-amber-400/10 text-amber-300">
                        <Award className="h-5 w-5" />
                      </div>
                      <p className="text-xs uppercase tracking-[0.22em] text-amber-300/90">
                        Certifications
                      </p>
                    </div>

                    <ul className="mt-5 space-y-3">
                      {certifications.map((cert) => (
                        <li
                          key={cert.name}
                          className="border border-white/10 bg-[#061120] p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium text-white">
                                {cert.name}
                              </p>
                              <p className="mt-1 text-xs text-slate-400">
                                {cert.issuer}
                              </p>
                            </div>
                            <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                              {cert.year}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </section>

              <div className="px-5 sm:px-8 md:px-10 xl:px-12 2xl:px-16">
                <Divider />
              </div>

              {/* 04 Leadership */}
              <section
                id="leadership"
                className="p-5 sm:p-8 md:p-10 xl:p-12 2xl:p-16"
              >
                <SectionHeading
                  index="04"
                  title="Leadership"
                  subtitle="Organizations, events, and student initiatives I helped lead during university."
                />

                <div className="grid gap-6 xl:grid-cols-2">
                  {leadership.map((item, index) => (
                    <motion.article
                      key={`${item.role}-${item.org}`}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: 0.5, delay: index * 0.07 }}
                      className="border border-white/15 bg-slate-900/90 p-5 sm:p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center border border-amber-300/20 bg-amber-400/10 text-amber-300">
                              <Users className="h-3.5 w-3.5" />
                            </div>
                            <p className="text-xs uppercase tracking-[0.22em] text-amber-300/90">
                              {item.role}
                            </p>
                          </div>
                          <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
                            {item.org}
                          </h3>
                          {item.orgLong && (
                            <p className="mt-1 text-xs text-slate-500">
                              {item.orgLong}
                            </p>
                          )}
                        </div>
                        <span className="shrink-0 text-xs uppercase tracking-[0.2em] text-slate-500">
                          {item.year}
                        </span>
                      </div>

                      <p className="mt-5 text-sm leading-7 text-slate-300">
                        {item.description}
                      </p>

                      <div className="mt-4 space-y-3">
                        {item.highlights.map((h) => (
                          <div
                            key={h}
                            className="border border-white/10 bg-[#061120] px-4 py-3 text-sm text-slate-200"
                          >
                            {h}
                          </div>
                        ))}
                      </div>
                    </motion.article>
                  ))}
                </div>
              </section>

              <footer className="border-t border-white/10 px-5 py-8 sm:px-8 md:px-10 xl:px-12 2xl:px-16">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Jonner D. Villapando
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Software developer building one solid project at a time.
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <a
                        href={`mailto:${EMAIL}`}
                        className="flex items-center gap-1.5 transition hover:text-white"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        {EMAIL}
                      </a>
                      <a
                        href={LINKEDIN_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 transition hover:text-white"
                      >
                        <LinkedinIcon className="h-3.5 w-3.5" />
                        linkedin.com/in/jonner-villapando
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <Code2 className="h-4 w-4" />
                    © {new Date().getFullYear()} Jonner D. Villapando
                  </div>
                </div>
              </footer>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}