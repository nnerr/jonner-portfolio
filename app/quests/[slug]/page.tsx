import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuestLayout } from "@/components/quest/QuestLayout";
import { getPlace, getQuest, profile, quests } from "@/lib/content";

// Only the quests listed in lib/content.ts exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return quests.map((quest) => ({ slug: quest.slug }));
}

export async function generateMetadata(props: PageProps<"/quests/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const quest = getQuest(slug);
  if (!quest) return {};
  const title = `${quest.title} · ${profile.shortName}`;
  return {
    title: quest.title,
    description: quest.summary,
    openGraph: {
      title,
      description: quest.summary,
      url: `/quests/${quest.slug}`,
      type: "article",
      locale: "en_US",
    },
    twitter: { card: "summary_large_image", title, description: quest.summary },
  };
}

export default async function QuestPage(props: PageProps<"/quests/[slug]">) {
  const { slug } = await props.params;
  const quest = getQuest(slug);
  const place = quest ? getPlace(quest.place) : undefined;
  if (!quest || !place) notFound();

  const next = quests[(quests.indexOf(quest) + 1) % quests.length];
  return <QuestLayout quest={quest} place={place} next={next} />;
}
