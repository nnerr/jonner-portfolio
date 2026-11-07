"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MAP_VIEW, mapPercent, type Place } from "@/lib/content";
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
// Room the docked panel takes on wide screens (its width plus a margin).
const panelSpace = (stageW: number) => Math.min(440, stageW * 0.42) + 24;

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

/** Where a map coordinate sits inside the rendered sheet, in pixels. */
function sheetPoint(x: number, y: number, layout: Layout) {
  return {
    x: ((x - MAP_VIEW.x) / MAP_VIEW.w) * layout.sheetW,
    y: ((y - MAP_VIEW.y) / MAP_VIEW.h) * layout.sheetH,
  };
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
  const router = useRouter();
  const hash = useHash();
  const visited = useVisited();
  const hydrated = useHydrated();
  // Wide screens get the docked panel and the full HUD.
  const wide = useMediaQuery("(min-width: 1024px)");
  // Landscape screens show the whole island at once; taller ones scroll it.
  const landscape = useMediaQuery("(min-aspect-ratio: 5/4)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const hashSlug = hash.slice(1);
  const activePlace = places.find((place) => place.slug === hashSlug) ?? null;
  const active = activePlace?.slug ?? null;

  const [travelOpen, setTravelOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [layout, setLayout] = useState<Layout | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const travelRef = useRef<HTMLDetailsElement>(null);
  const menuRef = useRef<HTMLDetailsElement>(null);
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

  // Taller screens pan the map by scrolling. Start centred, then bring the
  // open place into the middle of the free space.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!hydrated || landscape || !scroller || !layout) return;
    let left = (scroller.scrollWidth - scroller.clientWidth) / 2;
    let top = (scroller.scrollHeight - scroller.clientHeight) / 2;
    if (activePlace) {
      const point = sheetPoint(activePlace.x, activePlace.y - 30, layout);
      const freeW = wide ? layout.stageW - panelSpace(layout.stageW) : layout.stageW;
      // On phones the panel is a sheet over the lower half, so aim higher.
      const freeH = wide ? layout.stageH : layout.stageH * 0.45;
      left = point.x - freeW / 2;
      top = point.y - freeH / 2;
    }
    scroller.scrollTo({ left, top, behavior: activePlace && !reducedMotion ? "smooth" : "auto" });
  }, [activePlace, hydrated, landscape, layout, reducedMotion, wide]);

  // Fast travel and the phone menu: focus the first stop when opened from the
  // keyboard, and close when clicking anywhere else.
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
      setMenuOpen(false);
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

  // Keyboard: Esc closes, M toggles fast travel (the menu on small screens),
  // C opens the character sheet.
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
        } else if (menuOpen) {
          setMenuOpen(false);
          menuRef.current?.querySelector("summary")?.focus();
        } else if (active) {
          close();
        }
      } else if (event.key === "m" || event.key === "M") {
        event.preventDefault();
        if (wide) {
          focusTravelRef.current = !travelOpen;
          setTravelOpen(!travelOpen);
        } else {
          setMenuOpen(!menuOpen);
        }
      } else if (event.key === "c" || event.key === "C") {
        event.preventDefault();
        router.push("/character");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, close, menuOpen, router, travelOpen, wide]);

  // Wide landscape screens: frame the open place in the free space left of the
  // panel. The map may slide under the panel (the page behind it is sea too),
  // but never far enough to leave a bare edge in the visible part.
  let transform: string | undefined;
  if (activePlace && wide && landscape && !reducedMotion && layout) {
    const point = sheetPoint(activePlace.x, activePlace.y - 30, layout);
    const freeW = layout.stageW - panelSpace(layout.stageW);
    const scaledW = ZOOM * layout.sheetW;
    const scaledH = ZOOM * layout.sheetH;
    const left = Math.min(0, Math.max(freeW - scaledW, freeW / 2 - ZOOM * point.x));
    const top = Math.min(0, Math.max(layout.stageH - scaledH, layout.stageH / 2 - ZOOM * point.y));
    const tx = left - layout.sheetX;
    const ty = top - layout.sheetY;
    transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${ZOOM})`;
  }

  const explored = places.filter((place) => visited.includes(place.slug)).length;

  const exploredLine = (
    <>
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
    </>
  );

  return (
    <div
      className="atlas"
      data-js={hydrated ? "" : undefined}
      data-panel={hydrated && active ? "open" : undefined}
    >
      <header className="hud hud--top">
        {header}
        <div className="hud-actions">
          <Link href="/character" className="btn-ink hidden lg:inline-flex">
            Character <kbd>C</kbd>
          </Link>
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
          <a className="btn-ink hidden lg:inline-flex" href={resume} download>
            Download CV
          </a>

          {/* Small screens: one Menu button opens a journal with everything. */}
          <details
            ref={menuRef}
            className="hud-menu lg:hidden"
            open={menuOpen}
            onToggle={(event) => setMenuOpen(event.currentTarget.open)}
          >
            <summary className="btn-ink">{menuOpen ? "Close" : "Menu"}</summary>
            <div className="menu-backdrop" onClick={() => setMenuOpen(false)} aria-hidden="true" />
            <div className="menu-sheet">
              <p className="font-label text-[1.35rem] leading-tight">Journal</p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                <Link href="/character" className="btn-ink">
                  Character sheet
                </Link>
                <a className="btn-ink" href={resume} download>
                  Download CV
                </a>
              </div>
              <nav aria-label="Fast travel" className="mt-5">
                <h2 className="font-label mb-1 text-[1.15rem] text-ink-soft">Fast travel</h2>
                <FastTravel places={places} visited={visited} onSelect={open} />
              </nav>
              <div className="mt-5">
                <h2 className="font-label mb-2 text-[1.15rem] text-ink-soft">Legend</h2>
                <Legend />
              </div>
              <p className="mt-4 flex items-center gap-3 text-[0.95rem] italic text-ink-soft">{exploredLine}</p>
            </div>
          </details>
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
                  style={mapPercent(place.x, place.y)}
                >
                  <FogCloud seed={i} />
                </div>
              ))}
              {uncharted.map((spot, i) => (
                <div key={spot.label} className="fog fog--uncharted" style={mapPercent(spot.x, spot.y)}>
                  <FogCloud seed={places.length + i} />
                </div>
              ))}
            </div>

            <div className="uncharted-layer" aria-hidden="true">
              {uncharted.map((spot) => (
                <div key={spot.label} className="uncharted-label" style={mapPercent(spot.x, spot.y)}>
                  <span className="font-label block text-[1.02rem] text-ink-soft">{spot.label}</span>
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
      </div>

      <footer className="hud hud--bottom">
        <div className="hud-card legend-card hidden lg:block">
          <Legend />
        </div>
        {activeQuest && (
          <a
            href={`#${innSlug}`}
            onClick={(event) => open(innSlug, event)}
            className="hud-card quest-card group no-underline"
          >
            <Seal kind="inn" className="h-6 w-6 flex-none" />
            <span className="leading-tight">
              <span className="font-label block text-[0.92rem] text-seal">Active quest</span>
              <span className="font-display text-[1.3rem] font-semibold text-ink underline decoration-1 underline-offset-3 group-hover:decoration-2">
                {activeQuest}
              </span>
            </span>
          </a>
        )}
        <p className="hud-card explored-card hidden lg:flex" aria-live="polite">
          {exploredLine}
        </p>
        <p className="swipe-hint hud-card" aria-hidden="true">
          Swipe to explore · tap a seal
        </p>
      </footer>

      <div className="hud-frame" aria-hidden="true">
        <i className="hud-frame__band hud-frame__band--top" />
        <i className="hud-frame__band hud-frame__band--bottom" />
        <i className="hud-frame__band hud-frame__band--left" />
        <i className="hud-frame__band hud-frame__band--right" />
      </div>

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
  );
}
