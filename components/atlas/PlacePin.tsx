import type { MouseEvent } from "react";
import { MAP_HEIGHT, MAP_WIDTH, type Place } from "@/lib/content";
import { Seal } from "./Seal";

export function PlacePin({
  place,
  visited,
  active,
  onOpen,
}: {
  place: Place;
  visited: boolean;
  active: boolean;
  onOpen: (slug: string, event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <li
      className="place-item"
      style={{
        left: `${(place.x / MAP_WIDTH) * 100}%`,
        top: `${(place.y / MAP_HEIGHT) * 100}%`,
      }}
    >
      <a
        id={`place-${place.slug}`}
        href={`#${place.slug}`}
        className="place"
        data-kind={place.kind}
        data-label={place.label}
        aria-current={active ? "location" : undefined}
        onClick={(event) => onOpen(place.slug, event)}
      >
        <span className="seal-wrap">
          <Seal kind={place.kind} visited={visited} />
        </span>
        <span className="place-text">
          {place.kind === "inn" && <span className="place-here">You are here</span>}
          <span className="place-name">{place.name}</span>
          <span className="place-sub">{place.subtitle}</span>
          <span className="sr-only">{visited ? ", explored" : ", not explored yet"}</span>
        </span>
      </a>
    </li>
  );
}
