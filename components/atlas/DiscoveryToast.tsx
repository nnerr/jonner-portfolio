"use client";

import { useShowDiscovery } from "./stores";

// The "area name" card open-world games show when you arrive somewhere new.
// Shown once per browser session, then it fades out on its own.
export function DiscoveryToast({ region }: { region: string }) {
  const show = useShowDiscovery();
  if (!show) return null;
  return (
    <div className="discovery" aria-hidden="true">
      <span className="font-label text-[1.05rem] text-ink-soft">Region discovered</span>
      <span className="discovery__rule" />
      <span className="font-display text-[2.6rem] leading-none font-semibold tracking-[0.02em] text-ink">
        {region}
      </span>
      <span className="discovery__rule" />
    </div>
  );
}
