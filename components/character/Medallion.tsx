import type { Achievement } from "@/lib/content";

// Ink medallions for achievements. One small glyph per kind of achievement.

function Glyph({ icon }: { icon: Achievement["icon"] }) {
  switch (icon) {
    case "honor":
      return (
        <path
          d="M0 -9L2.6 -3.2L8.6 -2.8L4 1.2L5.4 7.2L0 4L-5.4 7.2L-4 1.2L-8.6 -2.8L-2.6 -3.2Z"
          fill="var(--ink)"
        />
      );
    case "cert":
      return (
        <g>
          <path d="M-4 3L-6 10L-2 8L0 11L1 4M4 3L6 10L2 8L0 11" fill="var(--seal)" stroke="var(--seal-deep)" strokeWidth={0.8} strokeLinejoin="round" />
          <circle cy={-2} r={6} fill="var(--paper)" stroke="var(--ink)" strokeWidth={1.4} />
          <circle cy={-2} r={3} fill="none" stroke="var(--ink)" strokeWidth={0.9} />
        </g>
      );
    case "lead":
      return (
        <g fill="none" stroke="var(--ink)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M-5 10V-9" />
          <path d="M-5 -9h11l-3 4.5l3 4.5h-11" fill="var(--seal)" stroke="var(--seal-deep)" strokeWidth={1} />
        </g>
      );
    case "craft":
      return (
        <g>
          <path
            d="M0 -9L2 -6.3L5.3 -7.3L5.1 -3.9L8.3 -2.7L6.3 0L8.3 2.7L5.1 3.9L5.3 7.3L2 6.3L0 9L-2 6.3L-5.3 7.3L-5.1 3.9L-8.3 2.7L-6.3 0L-8.3 -2.7L-5.1 -3.9L-5.3 -7.3L-2 -6.3Z"
            fill="var(--paper-deep)"
            stroke="var(--ink)"
            strokeWidth={1.2}
            strokeLinejoin="round"
          />
          <circle r={2.6} fill="var(--paper)" stroke="var(--ink)" strokeWidth={1} />
        </g>
      );
    case "quest":
      return (
        <g stroke="var(--ink)" strokeWidth={1.2} strokeLinejoin="round">
          <rect x={-7} y={-6} width={14} height={12} fill="var(--paper)" />
          <ellipse cx={-7} cy={0} rx={2} ry={6} fill="var(--paper-deep)" />
          <ellipse cx={7} cy={0} rx={2} ry={6} fill="var(--paper-deep)" />
          <path d="M-4 -2.5h7M-4 0.5h8M-4 3.5h5" strokeWidth={0.8} opacity={0.6} />
        </g>
      );
    case "seal":
      return (
        <g fill="var(--seal)">
          <circle cy={-3} r={4.2} />
          <path d="M-2.4 -1.2H2.4L4 8.5H-4Z" />
        </g>
      );
  }
}

export function Medallion({ icon }: { icon: Achievement["icon"] }) {
  const ring = icon === "seal" ? "var(--seal)" : "var(--ink)";
  return (
    <svg viewBox="-20 -20 40 40" aria-hidden="true" className="h-11 w-11 flex-none">
      <circle r={18} fill="var(--paper)" stroke={ring} strokeWidth={2} />
      <circle r={14.5} fill="none" stroke={ring} strokeWidth={0.9} strokeDasharray="1.2 2.4" />
      <Glyph icon={icon} />
    </svg>
  );
}
