import Link from "next/link";
import {
  certifications,
  commission,
  education,
  getQuest,
  leadership,
  profile,
  skillGroups,
} from "@/lib/content";
import { WaystoneIcon } from "./Seal";

function BeginQuest({ slug }: { slug: string }) {
  return (
    <Link href={`/quests/${slug}`} className="btn-ink">
      Begin quest <span aria-hidden="true">→</span>
    </Link>
  );
}

function StatRow({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <dl
      className={`mt-5 grid gap-x-4 gap-y-3 border-y border-ink/20 py-4 ${stats.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
    >
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col-reverse">
          <dt className="mt-1 text-[0.92rem] italic text-ink-soft">{stat.label}</dt>
          <dd className="stat-value text-[1.9rem] text-ink">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="font-fell text-[1.2rem] leading-tight text-ink">{children}</h3>;
}

function QuestSummary({ slug, stats }: { slug: string; stats?: string[] }) {
  const quest = getQuest(slug);
  if (!quest) return null;
  const shown = quest.stats?.filter((stat) => !stats || stats.includes(stat.label));
  return (
    <>
      <p>{quest.summary}</p>
      <p className="mt-3 text-[0.95rem] text-ink-soft">
        <span className="font-fell text-ink">Role:</span> {quest.role}
      </p>
      {quest.note && <p className="mt-3 text-[0.95rem] italic text-ink-soft">{quest.note}</p>}
      {shown && shown.length > 0 && <StatRow stats={shown} />}
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
        <BeginQuest slug={slug} />
        {quest.artifacts?.map((artifact) => (
          <a key={artifact.href} href={artifact.href} className="link-seal" target="_blank" rel="noopener">
            {artifact.label} (PDF)
          </a>
        ))}
      </div>
    </>
  );
}

export function PlaceDetails({ slug }: { slug: string }) {
  switch (slug) {
    case "feu-highlands":
      return (
        <>
          <p className="font-display text-[1.3rem] leading-snug font-semibold">{education.degree}</p>
          <p className="text-ink-soft">{education.specialization}</p>
          <p className="mt-3">
            {education.school}, {education.location}
          </p>
          <p className="text-ink-soft">{education.years}</p>
          {education.honors.map((honor) => (
            <p key={honor} className="mt-3">
              <span className="font-fell text-seal">Honor:</span> {honor}
            </p>
          ))}
          <div className="mt-7">
            <SubHeading>
              <span className="inline-flex items-center gap-2">
                <WaystoneIcon className="h-4 w-4" /> Waystones
              </span>
            </SubHeading>
            <p className="text-[0.95rem] italic text-ink-soft">Certifications picked up along the road.</p>
            <ul className="mt-2 divide-y divide-ink/15">
              {certifications.map((cert) => (
                <li key={cert.name} className="flex items-baseline justify-between gap-4 py-2.5">
                  <span>
                    <span className="block">{cert.name}</span>
                    <span className="block text-[0.9rem] text-ink-soft">{cert.issuer}</span>
                  </span>
                  <span className="text-ink-soft tabular-nums">{cert.year}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      );

    case "guild-hall":
      return (
        <ol className="space-y-7">
          {leadership.map((item) => (
            <li key={`${item.role}-${item.org}`}>
              <p className="font-fell text-[1.02rem] text-seal">{item.role}</p>
              <p className="font-display text-[1.25rem] leading-tight font-semibold">{item.org}</p>
              <p className="text-[0.92rem] text-ink-soft">
                {item.orgLong ? `${item.orgLong} · ` : ""}
                {item.years}
              </p>
              <ul className="diamond-list mt-2 space-y-1.5 text-[0.97rem]">
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      );

    case "phishing-coast":
      return <QuestSummary slug="smishx" stats={["accuracy", "F1 score"]} />;

    case "cybersoft-citadel":
      return <QuestSummary slug="safeboxiq" />;

    case "routa-crossroads":
      return <QuestSummary slug="routa" />;

    case "sealed-commission":
      return (
        <>
          <p className="font-display text-[1.3rem] leading-snug font-semibold">{commission.role}</p>
          <p className="text-ink-soft">{commission.since} to now</p>
          <p className="mt-4">
            I&rsquo;m working as a freelance full-stack engineer. The client and the work are under
            an NDA, so this scroll stays sealed for now.
          </p>
          <StatRow stats={[commission.stat]} />
          <p className="mt-4 italic text-ink-soft">The seal breaks when the NDA allows.</p>
        </>
      );

    case "tinkers-workshop":
      return (
        <div className="space-y-6">
          <p>The languages, frameworks and tools I work with.</p>
          {skillGroups.map((group) => (
            <div key={group.category}>
              <SubHeading>{group.category}</SubHeading>
              <ul className="mt-2.5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="stamp">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    case "wayfarers-inn":
      return (
        <>
          <div className="space-y-4">
            {profile.about.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
          {profile.activeQuest && (
            <div className="mt-6 border-y border-ink/20 py-4">
              <p className="font-fell text-[1rem] text-seal">Active quest</p>
              <p className="font-display text-[1.3rem] leading-snug font-semibold">{profile.activeQuest}</p>
            </div>
          )}
          <h3 className="font-fell mt-6 text-[1.2rem] leading-tight text-ink">Send word</h3>
          <ul className="mt-3 space-y-3">
            <li>
              <span className="font-fell block text-[0.95rem] text-ink-soft">Email</span>
              <a className="link-seal break-all" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </li>
            <li>
              <span className="font-fell block text-[0.95rem] text-ink-soft">LinkedIn</span>
              <a className="link-seal" href={profile.linkedin.href} target="_blank" rel="noopener noreferrer">
                {profile.linkedin.label}
              </a>
            </li>
          </ul>
          <a className="btn-ink mt-6" href={profile.resume} download>
            Download CV
          </a>
        </>
      );

    default:
      return null;
  }
}
