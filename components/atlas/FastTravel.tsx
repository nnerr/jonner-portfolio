import type { MouseEvent } from "react";
import type { Place } from "@/lib/content";
import { Seal } from "./Seal";

export function FastTravel({
  places,
  visited,
  onSelect,
}: {
  places: Place[];
  visited: string[];
  onSelect: (slug: string, event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <ol className="fast-travel">
      {places.map((place) => (
        <li key={place.slug}>
          <a href={`#${place.slug}`} onClick={(event) => onSelect(place.slug, event)}>
            <Seal
              kind={place.kind}
              visited={visited.includes(place.slug)}
              className="ft-seal"
            />
            <span className="ft-name">{place.name}</span>
            <span className="ft-sub">{place.subtitle}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}
