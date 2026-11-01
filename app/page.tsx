import { Atlas } from "@/components/atlas/Atlas";
import { AtlasHeader } from "@/components/atlas/AtlasHeader";
import { MapArt } from "@/components/atlas/MapArt";
import { PlaceDetails } from "@/components/atlas/PlaceDetails";
import { places, profile, uncharted } from "@/lib/content";

export default function Home() {
  return (
    <Atlas
      places={places}
      uncharted={uncharted}
      header={<AtlasHeader />}
      panels={places.map((place) => ({
        slug: place.slug,
        content: <PlaceDetails slug={place.slug} />,
      }))}
      resume={profile.resume}
      activeQuest={profile.activeQuest}
      innSlug="wayfarers-inn"
      region={profile.home}
    >
      <MapArt />
    </Atlas>
  );
}
