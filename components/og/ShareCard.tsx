import { ImageResponse } from "next/og";

// The parchment share card used for link previews (LinkedIn, Messenger,
// Slack...). Rendered at build time by the opengraph-image routes.

export const shareCardSize = { width: 1200, height: 630 };

const PAPER = "#f3ead7";
const PAPER_DEEP = "#e8dbbf";
const INK = "#2b2118";
const INK_SOFT = "#5c4d3c";
const SEAL = "#a3271f";

// Google Fonts serves TrueType to non-browser clients, which is what the
// image renderer needs. If the fetch fails, the card falls back to the
// built-in font instead of failing the build.
async function googleFont(query: string, text: string) {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=${query}&text=${encodeURIComponent(text)}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

const compass = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-80 -88 160 170">
<circle r="56" fill="none" stroke="${INK}" stroke-width="1.6"/>
<circle r="49" fill="none" stroke="${INK}" stroke-width="1.2" stroke-dasharray="2 5"/>
<g stroke="${INK}" stroke-width="1.2" stroke-linejoin="round">
<path d="M0 0L0 -74L-12 0Z" fill="${SEAL}"/><path d="M0 0L0 -74L12 0Z" fill="${PAPER}"/>
<path d="M0 0L74 0L0 12Z" fill="${INK}"/><path d="M0 0L74 0L0 -12Z" fill="${PAPER}"/>
<path d="M0 0L0 74L12 0Z" fill="${INK}"/><path d="M0 0L0 74L-12 0Z" fill="${PAPER}"/>
<path d="M0 0L-74 0L0 -12Z" fill="${INK}"/><path d="M0 0L-74 0L0 12Z" fill="${PAPER}"/>
</g><circle r="5" fill="${PAPER}" stroke="${INK}" stroke-width="1.4"/></svg>`)}`;

export async function renderShareCard({
  kicker,
  title,
  line,
  tagline,
}: {
  kicker: string;
  title: string;
  line: string;
  tagline: string;
}) {
  // Same faces as the site: Cormorant Garamond for the name, Jost for labels
  // (set in capitals, so the subset needs the capital letters) and text.
  const [cormorant, jostLabel, jostItalic] = await Promise.all([
    googleFont("Cormorant+Garamond:wght@700", title),
    googleFont("Jost:wght@500", `${kicker}${line}`.toUpperCase()),
    googleFont("Jost:ital,wght@1,400", tagline),
  ]);
  const fonts = [
    cormorant && { name: "Cormorant", data: cormorant, weight: 700 as const, style: "normal" as const },
    jostLabel && { name: "Jost", data: jostLabel, weight: 500 as const, style: "normal" as const },
    jostItalic && { name: "Jost", data: jostItalic, weight: 400 as const, style: "italic" as const },
  ].filter((font) => font !== null);

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: PAPER_DEEP, padding: 22 }}>
      <div style={{ flex: 1, display: "flex", background: PAPER, border: `3px solid ${INK}`, padding: 8 }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: `1.5px solid ${INK}`,
            padding: "0 66px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 760 }}>
            <div
              style={{
                display: "flex",
                fontFamily: "Jost",
                fontWeight: 500,
                fontSize: 28,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: INK_SOFT,
              }}
            >
              {kicker}
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: "Cormorant",
                fontWeight: 700,
                fontSize: 100,
                lineHeight: 1,
                letterSpacing: -1,
                color: INK,
                marginTop: 10,
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: "Jost",
                fontWeight: 500,
                fontSize: 28,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: SEAL,
                marginTop: 20,
              }}
            >
              {line}
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: "Jost",
                fontStyle: "italic",
                fontSize: 30,
                lineHeight: 1.35,
                color: INK_SOFT,
                marginTop: 26,
              }}
            >
              {tagline}
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={compass} width={250} height={266} alt="" />
        </div>
      </div>
    </div>,
    { ...shareCardSize, fonts },
  );
}
