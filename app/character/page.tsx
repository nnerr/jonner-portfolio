import type { Metadata } from "next";
import { CharacterSheet } from "@/components/character/CharacterSheet";
import { CloseKeys } from "@/components/character/CloseKeys";
import { profile } from "@/lib/content";

export const metadata: Metadata = {
  title: "Character sheet",
  description: `Skills, achievements and quest log of ${profile.name}, ${profile.role.toLowerCase()} in ${profile.home}.`,
};

export default function CharacterPage() {
  return (
    <>
      <CloseKeys />
      <CharacterSheet />
    </>
  );
}
