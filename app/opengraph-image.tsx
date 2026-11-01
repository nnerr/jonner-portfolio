import { renderShareCard, shareCardSize } from "@/components/og/ShareCard";
import { profile } from "@/lib/content";

// The share card for the home page and any page without its own card.

export const alt = `Atlas of ${profile.name}, ${profile.role} in ${profile.home}`;
export const size = shareCardSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderShareCard({
    kicker: "Atlas of",
    title: profile.name,
    line: `${profile.role} · ${profile.home}`,
    tagline: "A map of my work: a Rails internship, a phishing detector, and the teams I've led.",
  });
}
