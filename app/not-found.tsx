import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-svh max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
      <svg viewBox="-70 -78 140 150" className="h-36 w-36" aria-hidden="true">
        <circle r={46} fill="none" stroke="var(--ink)" strokeWidth={1.2} />
        <circle r={40} fill="none" stroke="var(--ink)" strokeWidth={1} strokeDasharray="1.5 3.5" />
        <g transform="rotate(28)" strokeLinejoin="round" strokeWidth={1}>
          <path d="M0 0L0 -58L-9 0Z" fill="var(--seal)" stroke="var(--ink)" />
          <path d="M0 0L0 -58L9 0Z" fill="var(--paper)" stroke="var(--ink)" />
          <path d="M0 0L0 58L9 0Z" fill="var(--ink)" stroke="var(--ink)" />
          <path d="M0 0L0 58L-9 0Z" fill="var(--paper)" stroke="var(--ink)" />
        </g>
        <circle r={4} fill="var(--paper)" stroke="var(--ink)" />
        <text y={-62} textAnchor="middle" fontSize={16} fill="var(--ink)" style={{ fontFamily: "var(--font-jost)", fontWeight: 500 }}>
          N
        </text>
      </svg>
      <p className="font-label mt-6 text-[1.15rem] text-seal">Here be dragons</p>
      <h1 className="font-display mt-2 text-[2.6rem] leading-[1.05] font-semibold tracking-[-0.02em] sm:text-[3.2rem]">
        You&rsquo;ve wandered off the map
      </h1>
      <p className="mt-4 text-[1.15rem] leading-relaxed text-ink-soft">
        Nothing is charted at this address. The road back to the atlas is right here.
      </p>
      <Link href="/" className="btn-ink mt-8">
        Return to the atlas
      </Link>
    </main>
  );
}
