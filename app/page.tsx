"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Code2,
  ExternalLink,
  FolderGit2,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const skills = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Ruby on Rails",
  "React",
  "Next.js",
  "Tailwind CSS",
  "PostgreSQL",
  "Git",
  "Docker",
  "REST APIs",
  "Machine Learning",
];

const projects = [
  {
    title: "SmishX",
    type: "Thesis / Machine Learning",
    year: "2025",
    description:
      "An SMS phishing detection project using an ensemble approach designed to classify suspicious links more accurately and show a practical use of applied machine learning.",
    highlights: [
      "Random Forest + XGBoost",
      "Security-focused thesis work",
      "Built around a real problem space",
    ],
  },
  {
    title: "Ops Inventory",
    type: "Personal Project / Full Stack",
    year: "2026",
    description:
      "A modern inventory and restock workflow app built to deepen full-stack skills across UI structure, data modelling, and operational logic.",
    highlights: [
      "Next.js + Prisma + PostgreSQL",
      "Operations-focused workflow",
      "Built to learn proper architecture",
    ],
  },
];

const experience = [
  {
    role: "Software Developer Intern",
    company: "SafeBoxIQ",
    year: "2024",
    description:
      "Contributed to a Ruby on Rails mortgage services platform by fixing loan computation logic, improving pre-qualification calculations, and refining layouts across pages and tables.",
    highlights: [
      "Business logic fixes",
      "Improved calculation accuracy",
      "UI and layout refinements",
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
            ctx.strokeStyle = `rgba(103, 232, 249, ${alpha})`;
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
        glow.addColorStop(0, "rgba(34, 211, 238, 0.14)");
        glow.addColorStop(1, "rgba(34, 211, 238, 0)");

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
      <div className="text-xs uppercase tracking-[0.28em] text-cyan-300/80">
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
            "radial-gradient(circle at 12% 18%, rgba(34,211,238,0.20), transparent 24%), radial-gradient(circle at 82% 16%, rgba(96,165,250,0.14), transparent 22%), radial-gradient(circle at 50% 75%, rgba(168,85,247,0.08), transparent 28%), linear-gradient(to bottom, rgba(2,6,23,0.32), rgba(2,6,23,0.68))",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.05) 0, transparent 22%), radial-gradient(circle at 78% 22%, rgba(34,211,238,0.08) 0, transparent 18%), radial-gradient(circle at 62% 70%, rgba(96,165,250,0.06) 0, transparent 20%)",
        }}
      />

      <main className="relative z-10 w-full px-4 py-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
        <div className="w-full overflow-hidden border border-white/10 bg-slate-950/30 backdrop-blur-[2px] shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_30px_80px_rgba(2,6,23,0.30)]">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/50 backdrop-blur-[2px]">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center border border-cyan-300/20 bg-cyan-400/10 text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.10)]">
                  <Code2 className="h-4 w-4" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                    Jonner.dev
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                className="flex h-10 w-10 items-center justify-center border border-white/10 bg-slate-800/80 text-slate-200 lg:hidden"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>

              <nav className="hidden items-center gap-8 text-sm text-slate-300 lg:flex">
                <a href="#about" className="transition hover:text-white">
                  About
                </a>
                <a href="#experience" className="transition hover:text-white">
                  Experience
                </a>
                <a href="#projects" className="transition hover:text-white">
                  Projects
                </a>
                <a href="#skills" className="transition hover:text-white">
                  Skills
                </a>
              </nav>
            </div>

            {menuOpen && (
              <div className="border-t border-white/10 px-4 py-4 lg:hidden">
                <nav className="flex flex-col gap-3 text-sm text-slate-300">
                  <a
                    href="#about"
                    onClick={() => setMenuOpen(false)}
                    className="transition hover:text-white"
                  >
                    About
                  </a>
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
                    href="#skills"
                    onClick={() => setMenuOpen(false)}
                    className="transition hover:text-white"
                  >
                    Skills
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
                  <div className="inline-flex items-center gap-2 border border-cyan-300/20 bg-cyan-400/10 px-3 py-2 text-xs uppercase tracking-[0.22em] text-cyan-200">
                    <Sparkles className="h-3.5 w-3.5" />
                    Fresh graduate building real software
                  </div>

                  <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                    <div className="relative shrink-0">
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.25 }}
                        className="relative h-28 w-28 overflow-hidden rounded-xl border border-cyan-300/30 bg-cyan-400/10 shadow-inner shadow-black/30 transition-all duration-300 hover:border-cyan-300/60 hover:shadow-[0_0_25px_rgba(34,211,238,0.25)] sm:h-32 sm:w-32 md:h-36 md:w-36 xl:h-40 xl:w-40"
                      >
                        <Image
                          src="/profile.jpg"
                          alt="Jonner D. Villapando"
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, (max-width: 1280px) 144px, 160px"
                          priority
                        />
                        <div className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.25),transparent_60%)]" />
                      </motion.div>
                    </div>

                    <div className="min-w-0">
                      <h1 className="text-4xl font-semibold leading-[0.95] tracking-tight text-white sm:text-5xl md:text-6xl xl:text-7xl 2xl:text-[5.5rem]">
                        Jonner D. Villapando
                      </h1>
                      <p className="mt-4 text-sm uppercase tracking-[0.22em] text-cyan-200 sm:text-base">
                        Software Developer - Fresh Graduate
                      </p>
                      <p className="mt-4 text-sm text-cyan-300/80 sm:text-base">
                        Leveling up, one commit at a time
                      </p>
                    </div>
                  </div>

                  <p className="mt-10 max-w-4xl text-sm leading-8 text-slate-300 sm:text-base md:text-lg">
                    Fresh graduate with a strong interest in software
                    development, especially full-stack work, practical systems,
                    and projects that build real technical depth. I enjoy
                    understanding how things work under the hood and turning
                    that into something useful, polished, and reliable.
                  </p>

                  <div className="mt-10 flex flex-wrap gap-3">
                    <Button
                      asChild
                      className="border border-white bg-white px-5 text-slate-950 hover:bg-slate-200"
                    >
                      <a href="#projects">View Projects</a>
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/20 bg-transparent px-5 text-white hover:bg-white/10"
                    >
                      Download CV
                    </Button>
                  </div>

                  <div className="mt-14 grid gap-4 sm:grid-cols-3">
                    <div className="border border-white/15 bg-slate-900/90 p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Focus
                      </p>
                      <p className="mt-3 text-sm text-white">
                        Full-stack development
                      </p>
                    </div>
                    <div className="border border-white/15 bg-slate-900/90 p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Interests
                      </p>
                      <p className="mt-3 text-sm text-white">
                        AI, web apps, clean logic
                      </p>
                    </div>
                    <div className="border border-white/15 bg-slate-900/90 p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Mindset
                      </p>
                      <p className="mt-3 text-sm text-white">
                        Build, test, refine
                      </p>
                    </div>
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
                        about.tsx
                      </p>
                    </div>

                    <div className="space-y-5 p-5 font-mono text-xs leading-7 text-slate-300 sm:text-sm">
                      <div>
                        <span className="text-slate-500">const</span> developer{" "}
                        <span className="text-slate-500">=</span> {"{"}
                      </div>

                      <div className="pl-4">
                        <div>
                          <span className="text-cyan-300">name</span>:{" "}
                          <span className="text-emerald-300">
                            &quot;Jonner D. Villapando&quot;
                          </span>
                          ,
                        </div>
                        <div>
                          <span className="text-cyan-300">role</span>:{" "}
                          <span className="text-emerald-300">
                            &quot;Software Developer&quot;
                          </span>
                          ,
                        </div>
                        <div>
                          <span className="text-cyan-300">status</span>:{" "}
                          <span className="text-emerald-300">
                            &quot;Fresh Graduate&quot;
                          </span>
                          ,
                        </div>
                        <div>
                          <span className="text-cyan-300">strengths</span>: [
                          <span className="text-emerald-300">
                            &quot;curious&quot;
                          </span>
                          ,{" "}
                          <span className="text-emerald-300">
                            &quot;practical&quot;
                          </span>
                          ,{" "}
                          <span className="text-emerald-300">
                            &quot;fast learner&quot;
                          </span>
                          ],
                        </div>
                        <div>
                          <span className="text-cyan-300">interests</span>: [
                          <span className="text-emerald-300">
                            &quot;full stack&quot;
                          </span>
                          ,{" "}
                          <span className="text-emerald-300">&quot;AI&quot;</span>
                          ,{" "}
                          <span className="text-emerald-300">
                            &quot;real-world systems&quot;
                          </span>
                          ],
                        </div>
                        <div>
                          <span className="text-cyan-300">motto</span>:{" "}
                          <span className="text-emerald-300">
                            &quot;Leveling up, one commit at a time&quot;
                          </span>
                          ,
                        </div>
                      </div>

                      <div>{"}"}</div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="border border-white/15 bg-slate-900/90 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        What I care about
                      </p>
                      <p className="mt-3 text-sm leading-7 text-slate-300">
                        Clear logic, useful interfaces, and projects that feel
                        grounded instead of decorative.
                      </p>
                    </div>
                    <div className="border border-white/15 bg-slate-900/90 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        What I want next
                      </p>
                      <p className="mt-3 text-sm leading-7 text-slate-300">
                        A role where I can contribute early, receive proper
                        feedback, and strengthen my engineering foundations.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.section>

              <section id="about" className="p-5 sm:p-8 md:p-10 xl:p-12 2xl:p-16">
                <SectionHeading
                  index="01"
                  title="About me"
                  subtitle="A developer profile that feels more honest and personal than a generic portfolio headline."
                />

                <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
                  <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeUp}
                    transition={{ duration: 0.55 }}
                    className="border border-white/15 bg-slate-900/90 p-5 sm:p-7"
                  >
                    <p className="text-base leading-8 text-slate-300">
                      I am a fresh graduate with a strong interest in software
                      development, particularly in building web applications
                      that solve real problems. I enjoy understanding how
                      systems behave, improving both front-end and back-end
                      implementation, and learning through hands-on projects
                      that push me to think more carefully.
                    </p>
                    <p className="mt-5 text-base leading-8 text-slate-300">
                      I do not want to present myself as someone who already
                      knows everything. What I can offer is strong curiosity,
                      practical effort, and a genuine willingness to improve. I
                      like building things properly, asking why they work, and
                      refining them until they make sense.
                    </p>
                  </motion.div>

                  <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeUp}
                    transition={{ duration: 0.55, delay: 0.08 }}
                    className="grid gap-4"
                  >
                    <div className="border border-white/15 bg-slate-900/90 p-5 sm:p-6">
                      <p className="text-sm font-medium uppercase tracking-[0.14em] text-white">
                        Practical mindset
                      </p>
                      <p className="mt-3 text-sm leading-7 text-slate-300">
                        I prefer projects that can be used, tested, and improved
                        in realistic scenarios.
                      </p>
                    </div>
                    <div className="border border-white/15 bg-slate-900/90 p-5 sm:p-6">
                      <p className="text-sm font-medium uppercase tracking-[0.14em] text-white">
                        Learns by building
                      </p>
                      <p className="mt-3 text-sm leading-7 text-slate-300">
                        I understand concepts better when I implement them and
                        see where the difficulties really are.
                      </p>
                    </div>
                    <div className="border border-white/15 bg-slate-900/90 p-5 sm:p-6">
                      <p className="text-sm font-medium uppercase tracking-[0.14em] text-white">
                        Growth-focused
                      </p>
                      <p className="mt-3 text-sm leading-7 text-slate-300">
                        I want to become a dependable developer with strong
                        fundamentals and better engineering judgement over time.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </section>

              <div className="px-5 sm:px-8 md:px-10 xl:px-12 2xl:px-16">
                <Divider />
              </div>

              <section
                id="experience"
                className="p-5 sm:p-8 md:p-10 xl:p-12 2xl:p-16"
              >
                <SectionHeading
                  index="02"
                  title="Experience"
                  subtitle="Where I have applied my skills in real-world environments."
                />

                <div className="grid gap-6 xl:grid-cols-2">
                  {experience.map((exp, index) => (
                    <motion.article
                      key={exp.company}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: 0.5, delay: index * 0.07 }}
                      className="border border-white/15 bg-slate-900/90 p-5 sm:p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/90">
                            {exp.role}
                          </p>
                          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                            {exp.company}
                          </h3>
                        </div>
                        <span className="text-xs text-slate-500">
                          {exp.year}
                        </span>
                      </div>

                      <p className="mt-6 text-sm leading-7 text-slate-300">
                        {exp.description}
                      </p>

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

              <section
                id="projects"
                className="p-5 sm:p-8 md:p-10 xl:p-12 2xl:p-16"
              >
                <SectionHeading
                  index="03"
                  title="Projects"
                  subtitle="A mix of thesis work, internship contributions, and personal builds that show how I approach software development."
                />

                <div className="grid gap-6 xl:grid-cols-3">
                  {projects.map((project, index) => (
                    <motion.article
                      key={project.title}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: 0.5, delay: index * 0.07 }}
                      className="group border border-white/15 bg-slate-900/95 p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-slate-800 sm:p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/90">
                            {project.type}
                          </p>
                          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                            {project.title}
                          </h3>
                        </div>
                        <div className="border border-white/10 bg-slate-800/80 p-2 text-slate-300 transition group-hover:text-white">
                          <ExternalLink className="h-4 w-4" />
                        </div>
                      </div>

                      <p className="mt-6 text-sm leading-7 text-slate-300">
                        {project.description}
                      </p>

                      <div className="mt-6 flex items-center justify-between border-y border-white/10 py-3 text-xs uppercase tracking-[0.22em] text-slate-500">
                        <span>{project.year}</span>
                        <span>Selected Work</span>
                      </div>

                      <div className="mt-5 space-y-3">
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

              <section
                id="skills"
                className="p-5 sm:p-8 md:p-10 xl:p-12 2xl:p-16"
              >
                <SectionHeading
                  index="04"
                  title="Skills and stack"
                  subtitle="The tools I have used so far and the stack I want to keep growing with."
                />

                <motion.div
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeUp}
                  transition={{ duration: 0.55 }}
                  className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]"
                >
                  <div className="border border-white/15 bg-slate-900/90 p-5 sm:p-7">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center border border-cyan-300/20 bg-cyan-400/10 text-cyan-300">
                        <FolderGit2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          What my stack says about me
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          I like modern web tooling, practical databases, and
                          systems I can reason about properly.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    {skills.map((skill, index) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.25, delay: index * 0.03 }}
                      >
                        <Badge className="border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100 hover:bg-cyan-400/20 sm:px-5 sm:py-2.5">
                          {skill}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </section>

              <footer className="border-t border-white/10 px-5 py-6 sm:px-8 md:px-10 xl:px-12 2xl:px-16">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Jonner D. Villapando
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Fresh graduate software developer building one solid
                      project at a time.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <Code2 className="h-4 w-4" />
                    Built for portfolio use
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