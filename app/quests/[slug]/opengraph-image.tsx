import { renderShareCard, shareCardSize } from "@/components/og/ShareCard";
import { getPlace, getQuest, profile, quests } from "@/lib/content";

// One share card per quest, so a shared link previews the project itself.

export const alt = "A quest from the atlas of Jonner D. Villapando";
export const size = shareCardSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return quests.map((quest) => ({ slug: quest.slug }));
}

export default async function QuestImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quest = getQuest(slug);
  const place = quest ? getPlace(quest.place) : undefined;
  return renderShareCard({
    kicker: place && quest ? `${place.name} · ${quest.kind === "main" ? "Main quest" : "Side quest"}` : "Atlas of",
    title: quest?.title ?? profile.name,
    line: `${profile.name} · ${profile.role}`,
    tagline: quest?.summary ?? `${profile.role} in ${profile.home}`,
  });
}
