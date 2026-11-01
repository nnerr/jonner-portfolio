import Image from "next/image";
import { profile } from "@/lib/content";

export function AtlasHeader() {
  return (
    <div className="flex min-w-0 items-center gap-4">
      <div className="portrait">
        <Image
          src={profile.photo}
          alt={`Portrait of ${profile.name}`}
          fill
          sizes="68px"
          className="object-cover"
          priority
        />
      </div>
      <div className="min-w-0">
        <h1 className="font-display text-[1.85rem] leading-[1.02] font-semibold tracking-[-0.015em] sm:text-[2.15rem]">
          {profile.name}
        </h1>
        <p className="font-fell mt-1 text-[1.08rem] text-ink-soft">
          {profile.role} · {profile.home}
        </p>
        <p className="mt-1.5 max-w-[50ch] text-[0.95rem] leading-snug lg:hidden xl:block">
          {profile.intro}
        </p>
      </div>
    </div>
  );
}
