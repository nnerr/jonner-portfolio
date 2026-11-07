import type { MouseEvent, ReactNode } from "react";
import type { Place } from "@/lib/content";

// The parchment card that opens when a place is chosen. Without JavaScript it
// still opens through the :target selector, because its id matches the hash.
export function RegionPanel({
  place,
  open,
  onClose,
  children,
}: {
  place: Place;
  open: boolean;
  onClose: (event: MouseEvent<HTMLAnchorElement>) => void;
  children: ReactNode;
}) {
  return (
    <section
      id={place.slug}
      className="region-panel"
      data-open={open ? "" : undefined}
      aria-labelledby={`${place.slug}-title`}
    >
      <div className="region-panel__inner">
        <div className="flex items-center justify-between gap-4">
          <p className="font-label text-[1.05rem] text-seal">{place.kindLabel}</p>
          <a
            href="#map"
            onClick={onClose}
            className="font-label -mr-2 inline-flex min-h-11 items-center gap-2 px-2 text-[1rem] text-ink-soft hover:text-ink"
          >
            <span>Close</span>
            <kbd className="hidden lg:inline">Esc</kbd>
            <span className="sr-only"> {place.name}</span>
          </a>
        </div>
        <h2
          id={`${place.slug}-title`}
          tabIndex={-1}
          className="font-display mt-1 text-[2.45rem] leading-[1.05] font-semibold tracking-[-0.01em] outline-none"
        >
          {place.name}
        </h2>
        <p className="mt-1.5 text-[1rem] italic text-ink-soft">{place.subtitle}</p>
        <div className="rule-ornament my-5" aria-hidden="true">
          <svg width="10" height="10" viewBox="-5 -5 10 10">
            <path d="M0 -4.5L4.5 0L0 4.5L-4.5 0Z" fill="currentColor" />
          </svg>
        </div>
        <div className="text-[1rem] leading-[1.65]">{children}</div>
      </div>
    </section>
  );
}
