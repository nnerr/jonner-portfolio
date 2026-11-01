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
  const [fraunces, fell, literata] = await Promise.all([
    googleFont("Fraunces:wght@600", title),
    googleFont("IM+Fell+English+SC", `${kicker}${line}`),
    googleFont("Literata:ital@1", tagline),
  ]);
  const fonts = [
    fraunces && { name: "Fraunces", data: fraunces, weight: 600 as const, style: "normal" as const },
    fell && { name: "Fell", data: fell, weight: 400 as const, style: "normal" as const },
    literata && { name: "Literata", data: literata, weight: 400 as const, style: "italic" as const },
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
            <div style={{ display: "flex", fontFamily: "Fell", fontSize: 40, color: INK_SOFT }}>{kicker}</div>
            <div
              style={{
                display: "flex",
                fontFamily: "Fraunces",
                fontSize: 88,
                lineHeight: 1,
                letterSpacing: -2,
                color: INK,
                marginTop: 6,
              }}
            >
              {title}
            </div>
            <div style={{ display: "flex", fontFamily: "Fell", fontSize: 40, color: SEAL, marginTop: 18 }}>
              {line}
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: "Literata",
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
