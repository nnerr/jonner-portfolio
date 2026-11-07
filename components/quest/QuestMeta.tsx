import type { ReactNode } from "react";
import type { Quest } from "@/lib/content";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="py-3">
      <dt className="font-label text-[0.98rem] text-ink-soft">{label}</dt>
      <dd className="mt-0.5 text-[1rem] leading-snug">{children}</dd>
    </div>
  );
}

export function QuestMeta({ quest }: { quest: Quest }) {
  return (
    <div className="border-[1.5px] border-ink bg-paper-deep px-5 pt-4 pb-5 shadow-[inset_0_0_0_3px_var(--paper-deep),inset_0_0_0_4px_var(--ink)]">
      <h2 className="font-label text-[1.3rem]">Quest details</h2>
      <dl className="mt-1 divide-y divide-ink/15">
        <Row label="Quest giver">{quest.giver}</Row>
        {quest.party && <Row label="Party">{quest.party}</Row>}
        <Row label="My role">{quest.role}</Row>
        <Row label="Season">{quest.season}</Row>
        {quest.tools.length > 0 && (
          <Row label="Tools">
            <ul className="mt-2 flex flex-wrap gap-2">
              {quest.tools.map((tool) => (
                <li key={tool} className="stamp">
                  {tool}
                </li>
              ))}
            </ul>
          </Row>
        )}
      </dl>
      {quest.artifacts?.map((artifact) => (
        <a
          key={artifact.href}
          href={artifact.href}
          target="_blank"
          rel="noopener"
          className="btn-ink mt-4 w-full justify-center"
        >
          {artifact.label} <span className="text-[0.85em] opacity-80">(PDF)</span>
        </a>
      ))}
    </div>
  );
}
