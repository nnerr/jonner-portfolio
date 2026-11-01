import type { PlaceKind } from "@/lib/content";
import { blob, smoothPath } from "./geometry";

// Map markers. Quests are red wax seals, landmarks are ink medallions and the
// inn is a red star. "!" means not yet visited; a tick means visited. The
// sealed commission shows a keyhole until it has been opened once.

const WAX = smoothPath(blob(0, 0, 17.5, { n: 12, wobble: 0.07, seed: 4 }));

const STAR = (() => {
  const points: string[] = [];
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? 18.5 : 8.5;
    points.push(`${(Math.cos(angle) * r).toFixed(2)} ${(Math.sin(angle) * r).toFixed(2)}`);
  }
  return `M${points.join("L")}Z`;
})();

function Glyph({ visited, color }: { visited: boolean; color: string }) {
  if (visited) {
    return (
      <path
        d="M-6.5 0.5l4.2 4.2l8.5 -9.4"
        fill="none"
        stroke={color}
        strokeWidth={2.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  }
  return (
    <g fill={color}>
      <rect x={-1.8} y={-9} width={3.6} height={10.5} rx={1.6} />
      <circle cy={6} r={2} />
    </g>
  );
}

export function Seal({
  kind,
  visited = false,
  className,
}: {
  kind: PlaceKind;
  visited?: boolean;
  className?: string;
}) {
  if (kind === "landmark") {
    return (
      <svg viewBox="-20 -20 40 40" aria-hidden="true" className={className}>
        <circle r={16.5} fill="var(--paper)" stroke="var(--ink)" strokeWidth={2.2} />
        <circle r={12.5} fill="none" stroke="var(--ink)" strokeWidth={1} />
        <Glyph visited={visited} color={visited ? "var(--ink)" : "var(--seal)"} />
      </svg>
    );
  }
  if (kind === "inn") {
    return (
      <svg viewBox="-20 -20 40 40" aria-hidden="true" className={className}>
        <path d={STAR} fill="var(--seal)" stroke="var(--seal-deep)" strokeWidth={1.2} strokeLinejoin="round" />
        <circle r={6.5} fill="var(--paper)" stroke="var(--seal-deep)" strokeWidth={1} />
        {visited ? (
          <path
            d="M-3.2 0.3l2.2 2.2l4.3 -4.8"
            fill="none"
            stroke="var(--seal)"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <circle r={2.4} fill="var(--seal)" />
        )}
      </svg>
    );
  }
  return (
    <svg viewBox="-20 -20 40 40" aria-hidden="true" className={className}>
      <path d={WAX} fill="var(--seal)" stroke="var(--seal-deep)" strokeWidth={1.2} />
      <circle r={12.2} fill="none" stroke="var(--seal-deep)" strokeWidth={1.5} opacity={0.75} />
      <path
        d="M-11 -6a12 12 0 0 1 8 -7"
        fill="none"
        stroke="#fff"
        strokeWidth={1.6}
        strokeLinecap="round"
        opacity={0.35}
      />
      {kind === "sealed" && !visited ? (
        // A keyhole: this place stays locked under NDA.
        <g fill="var(--paper)">
          <circle cy={-3} r={4.2} />
          <path d="M-2.4 -1.2H2.4L4 8.5H-4Z" />
        </g>
      ) : (
        <Glyph visited={visited} color="var(--paper)" />
      )}
    </svg>
  );
}

export function WaystoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="-10 -12 20 22" aria-hidden="true" className={className}>
      <path d="M0 -10L7 0L0 9L-7 0Z" fill="var(--paper)" stroke="var(--ink)" strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M0 -10L7 0L0 9Z" fill="var(--ink)" opacity={0.3} />
    </svg>
  );
}

export function FogIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <rect x={1} y={1} width={22} height={22} rx={3} fill="var(--sea)" />
      <ellipse cx={12} cy={13} rx={10} ry={6.5} fill="var(--paper)" opacity={0.95} />
      <path d="M5 13q3.5 -2 7 0t7 0" fill="none" stroke="var(--ink-faint)" strokeWidth={1.1} />
    </svg>
  );
}
