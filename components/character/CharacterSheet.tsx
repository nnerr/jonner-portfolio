import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  achievements,
  character,
  characterStats,
  commission,
  getPlace,
  leadership,
  profile,
  quests,
  skillTiers,
} from "@/lib/content";
import { Seal } from "@/components/atlas/Seal";
import { Medallion } from "./Medallion";

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <h2
        id={id}
        className="font-display flex items-center gap-3 text-[1.85rem] leading-tight font-semibold tracking-[-0.01em]"
      >
        <svg width="12" height="12" viewBox="-6 -6 12 12" aria-hidden="true" className="flex-none">
          <path d="M0 -5.5L5.5 0L0 5.5L-5.5 0Z" fill="var(--seal)" />
        </svg>
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="py-2.5">
      <dt className="font-fell text-[0.98rem] text-ink-soft">{label}</dt>
      <dd className="mt-0.5 leading-snug">{children}</dd>
    </div>
  );
}

function CharacterCard() {
  return (
    <div className="border-[1.5px] border-ink bg-paper-deep px-5 pt-6 pb-5 shadow-[inset_0_0_0_3px_var(--paper-deep),inset_0_0_0_4px_var(--ink)]">
      <div className="portrait portrait--large mx-auto">
        <Image
          src={profile.photo}
          alt={`Portrait of ${profile.name}`}
          fill
          sizes="136px"
          className="object-cover"
          priority
        />
      </div>
      <p className="font-display mt-5 text-center text-[1.35rem] leading-tight font-semibold">{profile.name}</p>
      <p className="font-fell text-center text-[1.05rem] text-seal">{character.className}</p>
      <dl className="mt-4 divide-y divide-ink/15 border-t border-ink/15">
        <Row label="Specialization">{character.specialization}</Row>
        <Row label="Home">{character.home}</Row>
        <Row label="Guild">{character.guild}</Row>
        <Row label="Current commission">
          {commission.role}, {commission.since} to now
          <span className="block text-[0.92rem] italic text-ink-soft">Sealed under NDA</span>
        </Row>
      </dl>
      <div className="mt-3 space-y-1.5 border-t border-ink/15 pt-3 text-[0.95rem]">
        <a className="link-seal block break-all" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <a className="link-seal block" href={profile.linkedin.href} target="_blank" rel="noopener noreferrer">
          {profile.linkedin.label}
        </a>
      </div>
    </div>
  );
}

function Stats() {
  return (
    <dl className="grid grid-cols-2 gap-px border border-ink/25 bg-ink/25 lg:grid-cols-5 [&>*:last-child]:col-span-2 lg:[&>*:last-child]:col-span-1">
      {characterStats.map((stat) => (
        <div key={stat.label} className="flex flex-col-reverse justify-end bg-paper px-4 py-4">
          <dt className="mt-1.5 text-[0.92rem] leading-snug italic text-ink-soft">{stat.label}</dt>
          <dd className="stat-value text-[2rem] text-ink">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Skills() {
  return (
    <div className="space-y-9">
      {skillTiers.map((tier) => {
        const withProof = tier.skills.some((skill) => skill.proof);
        return (
          <div key={tier.tier}>
            <h3 className="font-fell text-[1.25rem] leading-tight">{tier.tier}</h3>
            <p className="mt-0.5 text-[0.95rem] italic text-ink-soft">{tier.blurb}</p>
            {withProof ? (
              <ul className="mt-3 divide-y divide-ink/15 border-y border-ink/15">
                {tier.skills.map((skill) => (
                  <li
                    key={skill.name}
                    className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 py-2.5"
                  >
                    <span className="stamp">{skill.name}</span>
                    {skill.href ? (
                      <Link href={skill.href} className="link-seal text-[0.95rem]">
                        {skill.proof}
                      </Link>
                    ) : (
                      <span className="text-[0.95rem] text-ink-soft">{skill.proof}</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="mt-3 flex flex-wrap gap-2">
                {tier.skills.map((skill) => (
                  <li key={skill.name} className="stamp">
                    {skill.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Achievements() {
  return (
    <ol className="grid gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
      {achievements.map((achievement) => (
        <li key={achievement.title} className="flex gap-3">
          <Medallion icon={achievement.icon} />
          <div className="min-w-0">
            <p className="font-display text-[1.08rem] leading-tight font-semibold">{achievement.title}</p>
            <p className="mt-0.5 text-[0.92rem] leading-snug text-ink-soft">{achievement.detail}</p>
            <p className="mt-0.5 text-[0.88rem] italic text-ink-soft">Unlocked {achievement.year}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function QuestLog() {
  const sealed = getPlace("sealed-commission");
  return (
    <ul className="divide-y divide-ink/15 border-y border-ink/15">
      {quests.map((quest) => {
        const place = getPlace(quest.place);
        return (
          <li key={quest.slug}>
            <Link href={`/quests/${quest.slug}`} className="group flex items-center gap-4 py-3.5 no-underline">
              <Seal kind={quest.kind} visited className="h-8 w-8 flex-none" />
              <span className="min-w-0 flex-1">
                <span className="font-display block text-[1.15rem] leading-tight font-semibold group-hover:underline">
                  {quest.title}
                </span>
                <span className="block text-[0.92rem] text-ink-soft">
                  {quest.kind === "main" ? "Main quest" : "Side quest"}
                  {place ? ` · ${place.name}` : ""} · {quest.season}
                </span>
              </span>
              <span className="font-fell text-[0.98rem] text-ink-soft">Completed</span>
              <span aria-hidden="true" className="text-ink-soft group-hover:text-ink">
                →
              </span>
            </Link>
          </li>
        );
      })}
      {sealed && (
        <li>
          <Link href={`/#${sealed.slug}`} className="group flex items-center gap-4 py-3.5 no-underline">
            <Seal kind="sealed" className="h-8 w-8 flex-none" />
            <span className="min-w-0 flex-1">
              <span className="font-display block text-[1.15rem] leading-tight font-semibold group-hover:underline">
                {sealed.name}
              </span>
              <span className="block text-[0.92rem] text-ink-soft">
                Since {commission.since} · details sealed under NDA
              </span>
            </span>
            <span className="font-fell text-[0.98rem] text-seal">In progress</span>
            <span aria-hidden="true" className="text-ink-soft group-hover:text-ink">
              →
            </span>
          </Link>
        </li>
      )}
    </ul>
  );
}

function GuildRanks() {
  return (
    <ol className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
      {leadership.map((rank) => (
        <li key={`${rank.role}-${rank.org}`}>
          <p className="font-fell text-[1.02rem] text-seal">{rank.role}</p>
          <p className="font-display text-[1.15rem] leading-tight font-semibold">{rank.org}</p>
          <p className="text-[0.92rem] text-ink-soft">{rank.years}</p>
        </li>
      ))}
    </ol>
  );
}

export function CharacterSheet() {
  return (
    <div className="min-h-svh">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 pt-5 sm:px-6">
        <Link
          href="/"
          className="font-fell inline-flex min-h-11 items-center gap-2 text-[1.08rem] text-ink-soft hover:text-ink"
        >
          <span aria-hidden="true">←</span> Back to the atlas <kbd className="hidden lg:inline">Esc</kbd>
        </Link>
        <a href={profile.resume} download className="btn-ink">
          Download CV
        </a>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="border-b border-ink/25 pt-8 pb-8 sm:pt-12">
          <p className="font-fell text-[1.15rem] text-seal">Character sheet</p>
          <h1 className="font-display mt-2 text-[2.9rem] leading-[0.98] font-semibold tracking-[-0.025em] sm:text-[4.25rem]">
            {profile.name}
          </h1>
          <p className="mt-4 max-w-[44ch] text-[1.2rem] leading-snug sm:text-[1.35rem]">{profile.intro}</p>
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[18.5rem_minmax(0,1fr)] lg:gap-14">
          <aside className="self-start lg:sticky lg:top-6">
            <CharacterCard />
          </aside>

          <div className="min-w-0 space-y-14">
            <Section id="stats" title="Stats">
              <Stats />
            </Section>
            <Section id="skills" title="Skills">
              <Skills />
            </Section>
            <Section id="achievements" title="Achievements">
              <Achievements />
            </Section>
            <Section id="quest-log" title="Quest log">
              <QuestLog />
            </Section>
            <Section id="guild-ranks" title="Guild ranks">
              <GuildRanks />
            </Section>
          </div>
        </div>

        <nav aria-label="Back to the map" className="mt-16 border-t border-ink/25 pt-6">
          <Link
            href="/"
            className="font-fell inline-flex min-h-11 items-center gap-2 text-[1.1rem] text-ink-soft hover:text-ink"
          >
            <span aria-hidden="true">←</span> Return to the atlas
          </Link>
        </nav>
      </main>
    </div>
  );
}
