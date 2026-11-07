import Link from "next/link";
import type { ReactNode } from "react";
import { profile, type Place, type Quest } from "@/lib/content";
import { QuestMeta } from "./QuestMeta";
import { SmishxPipeline } from "./SmishxPipeline";

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <h2
        id={id}
        className="font-display flex items-center gap-3 text-[2.15rem] leading-tight font-semibold tracking-[-0.01em]"
      >
        <svg width="12" height="12" viewBox="-6 -6 12 12" aria-hidden="true" className="flex-none">
          <path d="M0 -5.5L5.5 0L0 5.5L-5.5 0Z" fill="var(--seal)" />
        </svg>
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-[1.08rem] leading-[1.75]">{children}</div>
    </section>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3.5 4.2l16.3 0.4l-0.3 15.6l-16.2 -0.3z" fill="var(--paper)" stroke="var(--ink)" strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M6.8 12.6l3.9 4.1l9.4 -12.4" fill="none" stroke="var(--seal)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function QuestLayout({ quest, place, next }: { quest: Quest; place: Place; next: Quest }) {
  const mapHref = `/#${place.slug}`;
  const statCols = quest.stats && quest.stats.length >= 4 ? "sm:grid-cols-4" : "sm:grid-cols-2";

  return (
    <div className="min-h-svh">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 pt-5 sm:px-6">
        <Link
          href={mapHref}
          className="font-label inline-flex min-h-11 items-center gap-2 text-[1.08rem] text-ink-soft hover:text-ink"
        >
          <span aria-hidden="true">←</span> Back to the atlas
        </Link>
        <a href={profile.resume} download className="btn-ink">
          Download CV
        </a>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="border-b border-ink/25 pt-8 pb-9 sm:pt-12">
          <p className="font-label text-[1.15rem] text-seal">
            {place.name} · {quest.kind === "main" ? "Main quest" : "Side quest"}
          </p>
          <h1 className="font-display mt-2 text-[3.6rem] leading-[0.95] font-semibold tracking-[-0.03em] sm:text-[5.25rem]">
            {quest.title}
          </h1>
          <p className="mt-5 max-w-[34ch] text-[1.3rem] leading-snug sm:text-[1.55rem]">{quest.summary}</p>
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-16">
          <aside className="self-start lg:sticky lg:top-6 lg:col-start-2 lg:row-start-1">
            <QuestMeta quest={quest} />
          </aside>

          <article className="min-w-0 max-w-[68ch] space-y-14 lg:col-start-1 lg:row-start-1">
            <Section id="lore" title="The lore">
              {quest.lore.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </Section>

            <Section id="objectives" title="Objectives">
              <ul className="checklist space-y-3.5">
                {quest.objectives.map((objective) => (
                  <li key={objective.slice(0, 32)}>
                    <Check />
                    {objective}
                  </li>
                ))}
              </ul>
            </Section>

            {quest.approach && (
              <Section id="approach" title="Approach">
                {quest.approach.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
                {quest.pipeline && <SmishxPipeline />}
              </Section>
            )}

            {(quest.stats || quest.rewards) && (
              <Section id="rewards" title="Rewards">
                {quest.stats && (
                  <div>
                    <dl className={`grid grid-cols-2 gap-px border border-ink/25 bg-ink/25 ${statCols}`}>
                      {quest.stats.map((stat) => (
                        <div key={stat.label} className="flex flex-col-reverse bg-paper px-4 py-4">
                          <dt className="mt-1.5 text-[0.98rem] italic text-ink-soft">{stat.label}</dt>
                          <dd className="stat-value text-[2.15rem] text-ink">{stat.value}</dd>
                        </div>
                      ))}
                    </dl>
                    {quest.statsNote && (
                      <p className="mt-2 text-[0.92rem] italic text-ink-soft">{quest.statsNote}</p>
                    )}
                  </div>
                )}
                {quest.rewards?.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </Section>
            )}

            {quest.lessons && (
              <Section id="lessons" title="What we'd improve">
                {quest.lessons.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </Section>
            )}

            {quest.note && (
              <p className="border-l-2 border-seal pl-4 text-[1.02rem] italic text-ink-soft">{quest.note}</p>
            )}

            {quest.artifacts && (
              <Section id="artifacts" title="Artifacts">
                <ul className="space-y-3">
                  {quest.artifacts.map((artifact) => (
                    <li key={artifact.href}>
                      <a href={artifact.href} target="_blank" rel="noopener" className="link-seal text-[1.15rem]">
                        {artifact.label}
                      </a>
                      <span className="block text-[0.95rem] text-ink-soft">{artifact.detail}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </article>
        </div>

        <nav
          aria-label="More quests"
          className="mt-16 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-ink/25 pt-6"
        >
          <Link href={mapHref} className="font-label inline-flex min-h-11 items-center gap-2 text-[1.1rem] text-ink-soft hover:text-ink">
            <span aria-hidden="true">←</span> Return to the atlas
          </Link>
          <Link href={`/quests/${next.slug}`} className="btn-ink">
            Next quest: {next.title} <span aria-hidden="true">→</span>
          </Link>
        </nav>
      </main>
    </div>
  );
}
