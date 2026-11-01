import { FogIcon, Seal, WaystoneIcon } from "./Seal";

export function Legend() {
  return (
    <ul className="legend" aria-label="Map legend">
      <li>
        <Seal kind="main" />
        Main quest
      </li>
      <li>
        <Seal kind="side" />
        Side quest
      </li>
      <li>
        <Seal kind="landmark" />
        Landmark
      </li>
      <li>
        <WaystoneIcon />
        Waystone (certification)
      </li>
      <li>
        <FogIcon />
        Uncharted
      </li>
    </ul>
  );
}
