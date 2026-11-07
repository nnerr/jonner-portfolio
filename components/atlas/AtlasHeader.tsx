import Image from "next/image";
import Link from "next/link";
import { profile } from "@/lib/content";

// The name card floating over the top-left of the map.
export function AtlasHeader() {
  return (
    <div className="hud-card hud-id">
      <Link href="/character" className="portrait portrait--link" aria-label="Open the character sheet">
        <Image
          src={profile.photo}
          alt={`Portrait of ${profile.name}`}
          fill
          sizes="68px"
          className="object-cover"
          priority
        />
      </Link>
      <div className="min-w-0">
        <h1 className="hud-id__name font-display font-semibold tracking-[-0.015em]">{profile.name}</h1>
        <p className="hud-id__role font-label text-ink-soft">
          {profile.role}
          <span className="hidden sm:inline"> · {profile.home}</span>
        </p>
        <p className="hud-id__intro">{profile.intro}</p>
      </div>
    </div>
  );
}
