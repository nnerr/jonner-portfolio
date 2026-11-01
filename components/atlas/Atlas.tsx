"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { MAP_HEIGHT, MAP_WIDTH, type Place } from "@/lib/content";
import { DiscoveryToast } from "./DiscoveryToast";
import { FastTravel } from "./FastTravel";
import { rng } from "./geometry";
import { Legend } from "./Legend";
import { PlacePin } from "./PlacePin";
import { RegionPanel } from "./RegionPanel";
import { Seal } from "./Seal";
import {
  markVisited,
  resetVisited,
  setHash,
  useHash,
  useHydrated,
  useMediaQuery,
  useVisited,
} from "./stores";

type Layout = {
  stageW: number;
  stageH: number;
  sheetX: number;
  sheetY: number;
  sheetW: number;
  sheetH: number;
};

type Props = {
  places: Place[];
  uncharted: { x: number; y: number; label: string }[];
  panels: { slug: string; content: ReactNode }[];
  header: ReactNode;
  resume: string;
  activeQuest: string;
  innSlug: string;
  region: string;
  children: ReactNode;
};

const ZOOM = 1.3;

// A few puffy cloud shapes, fixed per seed so server and client agree.
const FOG_SHAPES = Array.from({ length: 9 }, (_, seed) => {
  const rand = rng(seed + 101);
  return Array.from({ length: 6 }, () => ({
    cx: 34 + rand() * 92,
    cy: 38 + rand() * 26,
    rx: 24 + rand() * 20,
    ry: 15 + rand() * 11,
  }));
});

function FogCloud({ seed }: { seed: number }) {
  const puffs = FOG_SHAPES[seed % FOG_SHAPES.length];
  return (
    <svg viewBox="0 0 160 100" aria-hidden="true">
      <g filter="url(#fog-cloud)" fill="var(--paper)">
        <ellipse cx={80} cy={52} rx={60} ry={31} opacity={0.97} />
        {puffs.map((puff, i) => (
          <ellipse key={i} {...puff} opacity={0.9} />
        ))}
      </g>
      <path
        d="M36 60q12 -5 24 0t24 0M74 44q10 -4 20 0t20 0"
        fill="none"
        stroke="var(--ink-faint)"
        strokeWidth={1}
        opacity={0.4}
      />
    </svg>
  );
}

const position = (x: number, y: number) => ({
  left: `${(x / MAP_WIDTH) * 100}%`,
  top: `${(y / MAP_HEIGHT) * 100}%`,
});

/** Ignore clicks that should keep their default browser behaviour. */
function isPlainClick(event: MouseEvent) {
  return !(
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

export function Atlas({
  places,
  uncharted,
  panels,
  header,
  resume,
  activeQuest,
  innSlug,
  region,
  children,
}: Props) {
  const hash = useHash();
  const visited = useVisited();
  const hydrated = useHydrated();
  const desktop = useMediaQuery("(min-width: 1024px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const hashSlug = hash.slice(1);
  const activePlace = places.find((place) => place.slug === hashSlug) ?? null;
  const active = activePlace?.slug ?? null;

  const [travelOpen, setTravelOpen] = useState(false);
  const [layout, setLayout] = useState<Layout | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const travelRef = useRef<HTMLDetailsElement>(null);
  // Whether the open panel added its own history entry (so Close can go back).
  const pushedRef = useRef(false);
  // Focus requests that run after React has shown or hidden a panel.
  const focusPanelRef = useRef<string | null>(null);
  const focusPinRef = useRef<string | null>(null);
  const focusTravelRef = useRef(false);

  // Anything opened, including deep links like /#phishing-coast, counts as explored.
  useEffect(() => {
    if (active) markVisited(active);
  }, [active]);

  // Move focus into a panel once it is visible, and back to its pin on close.
  useEffect(() => {
    if (active && focusPanelRef.current === active) {
      document.getElementById(`${active}-title`)?.focus({ preventScroll: true });
      focusPanelRef.current = null;
    }
    if (!active) {
      pushedRef.current = false;
      if (focusPinRef.current) {
        document.getElementById(`place-${focusPinRef.current}`)?.focus({ preventScroll: true });
        focusPinRef.current = null;
      }
    }
  }, [active]);

  // Measure the stage and the map sheet for the pan and zoom.
  useEffect(() => {
    const stage = stageRef.current;
    const sheet = sheetRef.current;
    if (!stage || !sheet) return;
    const observer = new ResizeObserver(() => {
      setLayout({
        stageW: stage.clientWidth,
        stageH: stage.clientHeight,
        sheetX: sheet.offsetLeft,
        sheetY: sheet.offsetTop,
        sheetW: sheet.offsetWidth,
        sheetH: sheet.offsetHeight,
      });
    });
    observer.observe(stage);
    observer.observe(sheet);
    return () => observer.disconnect();
  }, []);

  // Small screens: the map scrolls sideways. Start centred, then follow the open place.
  useEffect(() => {
    const scroller = scrollerRef.current;
    const sheet = sheetRef.current;
    if (!hydrated || desktop || !scroller || !sheet) return;
    const target = activePlace
      ? sheet.offsetLeft + (activePlace.x / MAP_WIDTH) * sheet.offsetWidth - scroller.clientWidth / 2
      : (scroller.scrollWidth - scroller.clientWidth) / 2;
    scroller.scrollTo({
      left: target,
      behavior: activePlace && !reducedMotion ? "smooth" : "auto",
    });
  }, [activePlace, desktop, hydrated, reducedMotion]);

  // Fast travel: focus the first stop when opened from the keyboard, and
  // close when clicking anywhere else.
  useEffect(() => {
    if (!travelOpen) return;
    if (focusTravelRef.current) {
      travelRef.current?.querySelector<HTMLAnchorElement>(".fast-travel a")?.focus();
      focusTravelRef.current = false;
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!travelRef.current?.contains(event.target as Node)) setTravelOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [travelOpen]);

  const open = useCallback(
    (slug: string, event?: MouseEvent) => {
      if (event) {
        if (!isPlainClick(event)) return;
        event.preventDefault();
      }
      setTravelOpen(false);
      focusPanelRef.current = slug;
      if (active === slug) {
        document.getElementById(`${slug}-title`)?.focus({ preventScroll: true });
        return;
      }
      if (active) {
        setHash(slug, "replace");
      } else {
        setHash(slug, "push");
        pushedRef.current = true;
      }
    },
    [active],
  );

  const close = useCallback(
    (event?: { preventDefault: () => void }) => {
      event?.preventDefault();
      if (!active) return;
      focusPinRef.current = active;
      if (pushedRef.current) {
        pushedRef.current = false;
        window.history.back();
      } else {
        setHash(null, "replace");
      }
    },
    [active],
  );

  // Keyboard: Esc closes, M toggles fast travel.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName ?? "")) {
        return;
      }
      if (event.key === "Escape") {
        if (travelOpen) {
          setTravelOpen(false);
          travelRef.current?.querySelector("summary")?.focus();
        } else if (active) {
          close();
        }
      } else if ((event.key === "m" || event.key === "M") && desktop) {
        event.preventDefault();
        focusTravelRef.current = !travelOpen;
        setTravelOpen(!travelOpen);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, close, desktop, travelOpen]);

  // Desktop pan and zoom: bring the open place to the middle of the free space
  // left of the panel.
  // The map is clamped so its edges don't pull away from the free space,
  // which would leave a strip of bare page showing.
  let transform: string | undefined;
  if (activePlace && desktop && !reducedMotion && layout) {
    const px = (activePlace.x / MAP_WIDTH) * layout.sheetW;
    const py = ((activePlace.y - 30) / MAP_HEIGHT) * layout.sheetH;
    const freeW = layout.stageW - (Math.min(440, layout.stageW * 0.42) + 20);
    const scaledW = ZOOM * layout.sheetW;
    const scaledH = ZOOM * layout.sheetH;
    let left = freeW / 2 - ZOOM * px;
    let top = layout.stageH / 2 - ZOOM * py;
    if (scaledW >= freeW) left = Math.min(0, Math.max(freeW - scaledW, left));
    if (scaledH >= layout.stageH) top = Math.min(0, Math.max(layout.stageH - scaledH, top));
    const tx = left - layout.sheetX;
    const ty = top - layout.sheetY;
    transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${ZOOM})`;
  }

  const explored = places.filter((place) => visited.includes(place.slug)).length;

  return (
    <div
      className="atlas"
      data-js={hydrated ? "" : undefined}
      data-panel={hydrated && active ? "open" : undefined}
    >
      <header className="atlas-header">
        {header}
        <div className="atlas-actions">
          <details
            ref={travelRef}
            className="popover hidden lg:block"
            open={travelOpen}
            onToggle={(event) => setTravelOpen(event.currentTarget.open)}
          >
            <summary className="btn-ink">
              Fast travel <kbd>M</kbd>
            </summary>
            <div className="popover-card">
              <nav aria-label="Fast travel">
                <FastTravel places={places} visited={visited} onSelect={open} />
              </nav>
            </div>
          </details>
          <a className="btn-ink" href={resume} download>
            Download CV
          </a>
        </div>
      </header>

      <div id="map" ref={stageRef} className="atlas-stage">
        <div ref={scrollerRef} className="atlas-scroller">
          <div ref={sheetRef} className="map-sheet" style={{ transform }}>
            {children}

            <div className="fog-layer" aria-hidden="true">
              {places.map((place, i) => (
                <div
                  key={place.slug}
                  className="fog"
                  data-cleared={visited.includes(place.slug) ? "" : undefined}
                  style={position(place.x, place.y)}
                >
                  <FogCloud seed={i} />
                </div>
              ))}
              {uncharted.map((spot, i) => (
                <div key={spot.label} className="fog fog--uncharted" style={position(spot.x, spot.y)}>
                  <FogCloud seed={places.length + i} />
                </div>
              ))}
            </div>

            <div className="uncharted-layer" aria-hidden="true">
              {uncharted.map((spot) => (
                <div key={spot.label} className="uncharted-label" style={position(spot.x, spot.y)}>
                  <span className="font-fell block text-[1.02rem] text-ink-soft">{spot.label}</span>
                  <span className="block text-[0.74rem] italic text-ink-soft">
                    A new project, still in the fog
                  </span>
                </div>
              ))}
            </div>

            <ol className="places-layer" aria-label="Places on the map">
              {places.map((place) => (
                <PlacePin
                  key={place.slug}
                  place={place}
                  visited={visited.includes(place.slug)}
                  active={place.slug === active}
                  onOpen={open}
                />
              ))}
            </ol>
          </div>
        </div>

        <p className="px-4 text-[0.92rem] italic text-ink-soft lg:hidden">
          Swipe the map to explore. Tap a seal to open a place.
        </p>

        <DiscoveryToast region={region} />

        <div className="panel-backdrop" onClick={() => close()} aria-hidden="true" />
        {panels.map(({ slug, content }) => {
          const place = places.find((p) => p.slug === slug);
          if (!place) return null;
          return (
            <RegionPanel key={slug} place={place} open={slug === active} onClose={close}>
              {content}
            </RegionPanel>
          );
        })}
      </div>

      <section className="px-4 pt-2 pb-4 lg:hidden" aria-labelledby="fast-travel-heading">
        <h2 id="fast-travel-heading" className="font-fell mb-1 text-[1.15rem] text-ink-soft">
          Fast travel
        </h2>
        <nav aria-label="Fast travel">
          <FastTravel places={places} visited={visited} onSelect={open} />
        </nav>
      </section>

      <footer className="atlas-footer">
        <Legend />
        {activeQuest && (
          <a
            href={`#${innSlug}`}
            onClick={(event) => open(innSlug, event)}
            className="group order-first inline-flex items-center gap-2.5 no-underline lg:order-none"
          >
            <Seal kind="inn" className="h-6 w-6 flex-none" />
            <span className="leading-tight">
              <span className="font-fell block text-[0.92rem] text-seal">Active quest</span>
              <span className="font-display text-[1.05rem] font-semibold text-ink underline decoration-1 underline-offset-3 group-hover:decoration-2">
                {activeQuest}
              </span>
            </span>
          </a>
        )}
        <p className="flex items-center gap-3 text-[0.95rem] italic text-ink-soft" aria-live="polite">
          <span>
            Explored {explored} of {places.length}
          </span>
          {explored > 0 && (
            <button
              type="button"
              onClick={resetVisited}
              className="min-h-11 cursor-pointer px-1 text-ink-soft underline decoration-1 underline-offset-3 hover:text-ink"
            >
              Reset map
            </button>
          )}
        </p>
      </footer>
    </div>
  );
}
