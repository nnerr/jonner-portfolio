import { MAP_HEIGHT, MAP_WIDTH, places, uncharted } from "@/lib/content";
import {
  along,
  blob,
  contours,
  roughen,
  scatter,
  smoothPath,
  type Pt,
} from "./geometry";

// The static artwork of the atlas. Rendered on the server only; the
// interactive pins, labels and fog are drawn on top by <Atlas>.

const W = MAP_WIDTH;
const H = MAP_HEIGHT;

const INK = "var(--ink)";
const INK_SOFT = "var(--ink-soft)";
const INK_FAINT = "var(--ink-faint)";
const PAPER = "var(--paper)";
const PAPER_DEEP = "var(--paper-deep)";
const SEA = "var(--sea)";
const SEA_DEEP = "var(--sea-deep)";
const SEAL = "var(--seal)";
const FOREST = "#c4bd93";
const LAMP = "#e2b85a";

const fell = { fontFamily: "var(--font-fell), Georgia, serif" };
const display = { fontFamily: "var(--font-fraunces), Georgia, serif" };
const body = { fontFamily: "var(--font-literata), Georgia, serif" };

// --- Geography --------------------------------------------------------------

const at = Object.fromEntries(places.map((p) => [p.slug, [p.x, p.y] as Pt]));

const MAINLAND: Pt[] = [
  [270, 215], [330, 172], [420, 178], [500, 150], [590, 158], [670, 128],
  [760, 136], [850, 112], [945, 128], [1030, 150], [1105, 190], [1165, 238],
  [1228, 262], [1272, 306], [1300, 360], [1290, 410], [1262, 440], [1258, 484],
  [1284, 530], [1262, 584], [1222, 628], [1230, 690], [1196, 748], [1140, 790],
  [1080, 832], [1000, 868], [915, 862], [835, 892], [745, 912], [660, 896],
  [575, 908], [490, 888], [410, 905], [330, 932], [250, 952], [165, 948],
  [112, 912], [118, 866], [165, 830], [205, 790], [190, 735], [160, 680],
  [148, 615], [168, 552], [150, 490], [170, 420], [205, 360], [195, 300],
  [222, 248],
];

const isleCenter = uncharted[0];
const LAND = [
  smoothPath(roughen(MAINLAND, { steps: 3, amp: 9, seed: 11 })),
  smoothPath(
    roughen(
      blob(isleCenter.x, isleCenter.y, 80, { n: 11, wobble: 0.22, squash: 0.56, seed: 5, rot: -0.2 }),
      { steps: 2, amp: 6, seed: 3 },
    ),
  ),
  ...[
    [1300, 600, 13, 31],
    [1328, 624, 8, 32],
    [80, 520, 15, 33],
    [612, 74, 11, 34],
    [642, 88, 6, 35],
    [985, 938, 10, 36],
  ].map(([x, y, r, seed]) =>
    smoothPath(blob(x, y, r, { n: 8, wobble: 0.25, squash: 0.7, seed })),
  ),
].join("");

// The sea stops at the inner border so the frame shows bare paper.
const SEA_SHAPE = `M24 24H${W - 24}V${H - 24}H24Z${LAND}`;

const TRAIL: Pt[] = [
  at["feu-highlands"], [560, 318], [700, 272], at["guild-hall"], [965, 285],
  [1095, 332], at["phishing-coast"], [1185, 500], [1115, 585],
  at["routa-crossroads"], [955, 690], [845, 648], at["cybersoft-citadel"],
  [665, 690], [605, 762], at["wayfarers-inn"], [455, 850], [335, 872],
  [245, 872], [175, 860],
];

const WORKSHOP_ROAD: Pt[] = [
  at["tinkers-workshop"], [362, 520], [372, 450], [392, 380], at["feu-highlands"],
];
const ROADS: Pt[][] = [
  WORKSHOP_ROAD,
  [at["tinkers-workshop"], [450, 626], [580, 612], at["cybersoft-citadel"]],
  [[968, 300], [1010, 420], [1030, 535], at["routa-crossroads"], [1098, 742], [1110, 795]],
];

// Springs from the eastern hills and runs south between the labels.
const RIVER: Pt[] = [
  [585, 282], [614, 338], [590, 398], [616, 462], [596, 528], [610, 584],
  [574, 646], [528, 708], [508, 760], [492, 822], [482, 912],
];

const WAYSTONES = [0.38, 0.55, 0.72].map((t) => along(WORKSHOP_ROAD, t));

const FORESTS = [
  scatter(238, 455, 62, 50, 16, { minDist: 17, seed: 21 }),
  scatter(1012, 318, 72, 38, 13, { minDist: 18, seed: 22 }),
  scatter(938, 775, 70, 44, 15, { minDist: 17, seed: 23 }),
  scatter(418, 742, 28, 20, 5, { minDist: 16, seed: 24 }),
].flat();

const MOUNTAINS: [number, number, number][] = [
  [292, 266, 1],
  [578, 218, 0.9],
  [248, 304, 0.6],
  [336, 238, 0.55],
  [530, 250, 0.55],
  [620, 240, 0.6],
];

// --- Small drawings -----------------------------------------------------------

function Mountain({ x, y, s }: { x: number; y: number; s: number }) {
  const w = 44 * s;
  const h = 34 * s;
  return (
    <g>
      <path
        d={`M${x - w / 2} ${y}L${x} ${y - h}L${x + w / 2} ${y}`}
        fill={PAPER}
        stroke={INK}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
      <path d={`M${x} ${y - h}L${x + w / 2} ${y}L${x + w * 0.08} ${y}Z`} fill={INK} opacity={0.2} />
      <path
        d={`M${x - w * 0.12} ${y - h * 0.62}l${w * 0.06} ${h * 0.08}l${w * 0.07} -${h * 0.1}`}
        fill="none"
        stroke={INK}
        strokeWidth={1}
      />
    </g>
  );
}

function Tree({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y}v-6`} stroke={INK} strokeWidth={1.3} />
      <circle cx={x} cy={y - 11} r={7.5} fill={FOREST} stroke={INK} strokeWidth={1.1} />
      <path
        d={`M${x + 2} ${y - 17}a7 7 0 0 1 3.5 9.5`}
        fill="none"
        stroke={INK}
        strokeWidth={1}
        opacity={0.55}
      />
    </g>
  );
}

const stroke = {
  stroke: INK,
  strokeWidth: 1.5,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};

function crenels(x: number, y: number, w: number, n: number) {
  const step = w / (n * 2 - 1);
  let d = `M${x} ${y}`;
  for (let i = 0; i < n * 2 - 1; i++) {
    d += i % 2 === 0 ? `v-5h${step}v5` : `h${step}`;
  }
  return d;
}

function University({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y - 26})`}>
      <path d="M-34 -22h68l-6 -8h-56z" fill={PAPER_DEEP} {...stroke} />
      <rect x={-30} y={-22} width={60} height={22} fill={PAPER} {...stroke} />
      <path d="M-22 -15v7M-15 -15v7M15 -15v7M22 -15v7" {...stroke} strokeWidth={2.2} />
      <rect x={-9} y={-58} width={18} height={58} fill={PAPER} {...stroke} />
      <path d="M3 -55v52M6 -55v52" stroke={INK} strokeWidth={1} opacity={0.35} />
      <path d="M-12 -58L0 -80L12 -58Z" fill={PAPER_DEEP} {...stroke} />
      <path d="M0 -80V-96" {...stroke} />
      <path d="M0 -96l13 4.5l-13 4.5z" fill={SEAL} {...stroke} strokeWidth={1.1} />
      <circle cy={-45} r={4.5} fill={PAPER} {...stroke} strokeWidth={1.2} />
      <path d="M0 -45v-2.6M0 -45h2" {...stroke} strokeWidth={1} />
      <path d="M-4 0v-8a4 4 0 0 1 8 0v8z" fill={INK} />
      <path d="M-42 0h84" {...stroke} />
    </g>
  );
}

function GuildHall({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y - 26})`}>
      <path d="M-50 0v-58M50 0v-58" {...stroke} />
      <path d="M-50 -57h13v17l-6.5 -4.5l-6.5 4.5z" fill={SEAL} {...stroke} strokeWidth={1.1} />
      <path d="M50 -57h13v17l-6.5 -4.5l-6.5 4.5z" fill={INK_SOFT} {...stroke} strokeWidth={1.1} />
      <rect x={-36} y={-24} width={72} height={24} fill={PAPER} {...stroke} />
      <path d="M-42 -24L0 -50L42 -24Z" fill={PAPER_DEEP} {...stroke} />
      <path d="M-30 -24L0 -42.5" stroke={INK} strokeWidth={1} opacity={0.3} />
      <circle cy={-33} r={4} fill={PAPER} {...stroke} strokeWidth={1.2} />
      <path d="M-6 0v-11a6 6 0 0 1 12 0v11z" fill={INK} />
      <path d="M-26 -16v8M-18 -16v8M18 -16v8M26 -16v8" {...stroke} strokeWidth={2.2} />
      <path d="M-58 0h116" {...stroke} />
    </g>
  );
}

function Lighthouse({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y - 24})`}>
      <path d="M-40 -61L-9 -61M-36 -72L-9 -63M-36 -50L-9 -59" stroke={LAMP} strokeWidth={2} opacity={0.9} />
      <path d="M40 -61L9 -61M36 -72L9 -63M36 -50L9 -59" stroke={LAMP} strokeWidth={2} opacity={0.9} />
      <path d="M-24 0q4 -9 13 -8q6 -9 14 -2q9 -6 15 3q8 1 6 7z" fill={PAPER_DEEP} {...stroke} />
      <path d="M-10 -1L-6 -52H6L10 -1Z" fill={PAPER} {...stroke} />
      <path d="M-8.6 -16L-7.9 -26H7.9L8.6 -16Z" fill={SEAL} />
      <path d="M-7.3 -34L-6.7 -43H6.7L7.3 -34Z" fill={SEAL} />
      <path d="M-10 -1L-6 -52H6L10 -1Z" fill="none" {...stroke} />
      <rect x={-9.5} y={-56} width={19} height={4} fill={PAPER} {...stroke} strokeWidth={1.2} />
      <rect x={-5} y={-66} width={10} height={10} fill={LAMP} {...stroke} strokeWidth={1.2} />
      <path d="M-7.5 -66L0 -74L7.5 -66Z" fill={INK} />
      <path d="M-3 -1v-7a3 3 0 0 1 6 0v7z" fill={INK} />
    </g>
  );
}

function Signpost({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y - 24})`}>
      <path d="M0 0V-50" {...stroke} strokeWidth={2.2} />
      <path d="M-2 -46h-24l-6 5l6 5h24z" fill={PAPER} {...stroke} strokeWidth={1.3} />
      <path d="M2 -33h24l6 5l-6 5h-24z" fill={PAPER_DEEP} {...stroke} strokeWidth={1.3} />
      <path d="M-22 -41h14M8 -28h14" stroke={INK} strokeWidth={1} opacity={0.6} />
      <path d="M-14 0h28" {...stroke} />
    </g>
  );
}

function Jeepney({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-22} y={-23} width={44} height={3} fill={INK} />
      <path d="M-19 -20v8M19 -20v8" {...stroke} strokeWidth={1.2} />
      <path d="M-20 -13h40v9h-40zM-20 -10h-8v6h8" fill={PAPER} {...stroke} strokeWidth={1.3} />
      <path d="M-15 -19h5v4h-5zM-7 -19h5v4h-5zM1 -19h5v4h-5zM9 -19h5v4h-5z" fill={SEA} stroke={INK} strokeWidth={0.8} />
      <path d="M-20 -7h40" stroke={SEAL} strokeWidth={2} />
      <path d="M-27 -12l-3 -4" {...stroke} strokeWidth={1.2} />
      <circle cx={-12} cy={-3} r={3.6} fill={INK} />
      <circle cx={13} cy={-3} r={3.6} fill={INK} />
    </g>
  );
}

function Castle({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y - 26})`}>
      <path d="M0 -60V-76" {...stroke} />
      <path d="M0 -76l14 4.5l-14 4.5z" fill={SEAL} {...stroke} strokeWidth={1.1} />
      <rect x={-12} y={-55} width={24} height={30} fill={PAPER} {...stroke} />
      <path d={crenels(-12, -55, 24, 3)} fill="none" {...stroke} strokeWidth={1.3} />
      <path d="M-2 -46v7M2 -46v7" {...stroke} strokeWidth={1.2} />
      <rect x={-34} y={-26} width={68} height={26} fill={PAPER} {...stroke} />
      <path d={crenels(-34, -26, 68, 6)} fill="none" {...stroke} strokeWidth={1.3} />
      <rect x={-46} y={-42} width={16} height={42} fill={PAPER} {...stroke} />
      <path d={crenels(-46, -42, 16, 2)} fill="none" {...stroke} strokeWidth={1.3} />
      <rect x={30} y={-42} width={16} height={42} fill={PAPER} {...stroke} />
      <path d={crenels(30, -42, 16, 2)} fill="none" {...stroke} strokeWidth={1.3} />
      <path d="M36 -38v36M40 -38v36M-4 -52v26" stroke={INK} strokeWidth={1} opacity={0.3} />
      <path d="M-38 -30v6M38 -30v6" {...stroke} strokeWidth={2} />
      <path d="M-8 0v-12a8 8 0 0 1 16 0v12z" fill={INK} />
      <path d="M-54 0h108" {...stroke} />
    </g>
  );
}

function gearPath(r: number, teeth: number) {
  let d = "";
  for (let i = 0; i < teeth * 2; i++) {
    const a0 = (i / (teeth * 2)) * Math.PI * 2;
    const a1 = ((i + 1) / (teeth * 2)) * Math.PI * 2;
    const rr = i % 2 === 0 ? r + 3 : r;
    const p0 = [Math.cos(a0) * rr, Math.sin(a0) * rr];
    const p1 = [Math.cos(a1) * rr, Math.sin(a1) * rr];
    d += `${i === 0 ? "M" : "L"}${p0[0].toFixed(1)} ${p0[1].toFixed(1)}L${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`;
  }
  return `${d}Z`;
}

function Workshop({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y - 26})`}>
      <path
        d="M11 -40c-7 -5 6 -9 0 -15c-6 -6 7 -9 1 -15"
        fill="none"
        stroke={INK_FAINT}
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      <rect x={7} y={-38} width={7} height={12} fill={PAPER_DEEP} {...stroke} strokeWidth={1.3} />
      <rect x={-18} y={-20} width={36} height={20} fill={PAPER} {...stroke} />
      <path d="M-23 -20L0 -37L23 -20Z" fill={PAPER_DEEP} {...stroke} />
      <path d="M-5 0v-10h10v10" fill={INK} />
      <path d="M9 -13h5v5h-5z" fill={LAMP} stroke={INK} strokeWidth={1} />
      <g transform="translate(-31 -9)">
        <path d={gearPath(7, 8)} fill={PAPER_DEEP} {...stroke} strokeWidth={1.2} />
        <circle r={2.5} fill={PAPER} {...stroke} strokeWidth={1} />
      </g>
      <path d="M-42 0h64" {...stroke} />
    </g>
  );
}

function Inn({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y - 26})`}>
      <path
        d="M-14 -50c-6 -5 6 -9 0 -14c-6 -5 6 -9 0 -14"
        fill="none"
        stroke={INK_FAINT}
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      <rect x={-18} y={-48} width={7} height={12} fill={PAPER_DEEP} {...stroke} strokeWidth={1.3} />
      <rect x={-24} y={-24} width={48} height={24} fill={PAPER} {...stroke} />
      <path d="M-30 -24L-14 -44H14L30 -24Z" fill={PAPER_DEEP} {...stroke} />
      <path d="M-17 -16h8v7h-8zM9 -16h8v7h-8z" fill={LAMP} stroke={INK} strokeWidth={1} />
      <path d="M-4 0v-12h8v12" fill={INK} />
      <path d="M24 -19h13M33 -19v3M27 -19v3" {...stroke} strokeWidth={1.3} />
      <rect x={25} y={-16} width={11} height={9} fill={SEAL} {...stroke} strokeWidth={1.1} />
      <path d="M-34 0h70" {...stroke} />
    </g>
  );
}

function Waystone({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 -12L6 -3L0 6L-6 -3Z" fill={PAPER} {...stroke} strokeWidth={1.3} />
      <path d="M0 -12L6 -3L0 6Z" fill={INK} opacity={0.3} />
    </g>
  );
}

function compassPoint(angle: number, length: number, width: number) {
  const s = Math.sin(angle);
  const c = Math.cos(angle);
  const tip = [s * length, -c * length];
  const left = [-c * width, -s * width];
  const right = [c * width, s * width];
  const f = (n: number) => n.toFixed(1);
  return {
    dark: `M0 0L${f(tip[0])} ${f(tip[1])}L${f(left[0])} ${f(left[1])}Z`,
    light: `M0 0L${f(tip[0])} ${f(tip[1])}L${f(right[0])} ${f(right[1])}Z`,
  };
}

function Compass({ x, y }: { x: number; y: number }) {
  const minor = [45, 135, 225, 315].map((deg) => compassPoint((deg * Math.PI) / 180, 34, 7));
  const major = [0, 90, 180, 270].map((deg) => compassPoint((deg * Math.PI) / 180, 60, 10));
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={46} fill="none" stroke={INK} strokeWidth={0.9} />
      <circle r={41} fill="none" stroke={INK} strokeWidth={0.8} strokeDasharray="1.5 3.5" />
      {minor.map((p, i) => (
        <g key={`m${i}`}>
          <path d={p.light} fill={PAPER} stroke={INK} strokeWidth={0.8} strokeLinejoin="round" />
          <path d={p.dark} fill={INK_SOFT} stroke={INK} strokeWidth={0.8} strokeLinejoin="round" />
        </g>
      ))}
      {major.map((p, i) => (
        <g key={`M${i}`}>
          <path d={p.light} fill={PAPER} stroke={INK} strokeWidth={0.9} strokeLinejoin="round" />
          <path d={p.dark} fill={i === 0 ? SEAL : INK} stroke={INK} strokeWidth={0.9} strokeLinejoin="round" />
        </g>
      ))}
      <circle r={4} fill={PAPER} stroke={INK} strokeWidth={1} />
      <text y={-68} textAnchor="middle" fontSize={22} fill={INK} style={fell}>
        N
      </text>
    </g>
  );
}

function SeaMonster({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-68 4q10 -4 20 0t20 0M-12 4q10 -4 20 0t20 0M40 4q10 -4 20 0" fill="none" stroke={INK} strokeWidth={1} opacity={0.5} />
      <path d="M-58 0c-6 -20 4 -36 18 -34c11 2 10 15 2 20c-5 4 -8 9 -6 14z" fill={SEA_DEEP} {...stroke} />
      <circle cx={-41} cy={-27} r={1.8} fill={INK} />
      <path d="M-34 -27l9 -4M-35 -24l9 1" {...stroke} strokeWidth={1} />
      <path d="M-46 -34l-2 -8l5 5l1 -9l4 9" fill="none" {...stroke} strokeWidth={1.1} />
      <path d="M-22 0q11 -30 24 0z" fill={SEA_DEEP} {...stroke} />
      <path d="M10 0q10 -24 21 0z" fill={SEA_DEEP} {...stroke} />
      <path d="M38 0q8 -4 12 -16q3 -9 -5 -9q-6 1 -3 6" fill="none" {...stroke} />
      <text x={-6} y={30} textAnchor="middle" fontSize={16} fontStyle="italic" fill={INK_SOFT} style={body}>
        here be phishers
      </text>
    </g>
  );
}

function Ship({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(-8)`}>
      <path d="M-16 0h32l-6 8h-20z" fill={PAPER_DEEP} {...stroke} strokeWidth={1.3} />
      <path d="M0 0v-28" {...stroke} strokeWidth={1.3} />
      <path d="M1 -26q12 8 1 22z" fill={PAPER} {...stroke} strokeWidth={1.2} />
      <path d="M-1 -24q-10 8 -1 20z" fill={PAPER} {...stroke} strokeWidth={1.2} />
      <path d="M0 -28l7 2.5l-7 2.5" fill={SEAL} stroke="none" />
    </g>
  );
}

function Cartouche() {
  return (
    <g transform="translate(192 92)">
      <rect x={-148} y={-50} width={296} height={100} fill={PAPER} stroke={INK} strokeWidth={1.6} />
      <rect x={-142} y={-44} width={284} height={88} fill="none" stroke={INK} strokeWidth={0.8} />
      {[
        [-142, -44],
        [142, -44],
        [-142, 44],
        [142, 44],
      ].map(([cx, cy]) => (
        <path key={`${cx}${cy}`} d={`M${cx} ${cy - 5}l5 5l-5 5l-5 -5z`} fill={INK} />
      ))}
      <text y={-18} textAnchor="middle" fontSize={16} letterSpacing={2} fill={INK_SOFT} style={fell}>
        Atlas of
      </text>
      <text y={12} textAnchor="middle" fontSize={27} fontWeight={500} fill={INK} style={display}>
        Jonner D. Villapando
      </text>
      <text y={34} textAnchor="middle" fontSize={13.5} fontStyle="italic" fill={INK_SOFT} style={body}>
        Manila · surveyed 2021 to 2026
      </text>
    </g>
  );
}

function ScaleBar({ x, y }: { x: number; y: number }) {
  const seg = 44;
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={i * seg}
          y={0}
          width={seg}
          height={6}
          fill={i % 2 === 0 ? INK : PAPER}
          stroke={INK}
          strokeWidth={1}
        />
      ))}
      <text x={seg * 2} y={26} textAnchor="middle" fontSize={13} fill={INK_SOFT} style={fell}>
        Leagues · one league, one semester
      </text>
    </g>
  );
}

// --- The map ------------------------------------------------------------------

export function MapArt() {
  const trail = smoothPath(TRAIL, false);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="A hand-drawn map of Jonner's journey, from FEU Highlands to the Wayfarer's Inn."
    >
      <defs>
        <clipPath id="land-clip">
          <path d={LAND} />
        </clipPath>
        <clipPath id="sea-clip">
          <path d={SEA_SHAPE} clipRule="evenodd" />
        </clipPath>
        <pattern id="sea-lines" width={28} height={14} patternUnits="userSpaceOnUse">
          <path d="M0 7q7 -3.5 14 0t14 0" fill="none" stroke={INK} strokeWidth={0.8} opacity={0.1} />
        </pattern>
        <mask id="trail-mask" maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
          <path
            className="trail-reveal"
            d={trail}
            pathLength={1}
            fill="none"
            stroke="#fff"
            strokeWidth={18}
            strokeLinecap="round"
          />
        </mask>
        {/* Used by the fog patches drawn in <Atlas>. */}
        <filter id="fog-cloud" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={3} seed={3} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={20} xChannelSelector="R" yChannelSelector="G" result="cloud" />
          <feGaussianBlur in="cloud" stdDeviation={2.6} />
        </filter>
      </defs>

      {/* Sea */}
      <path d={SEA_SHAPE} fillRule="evenodd" fill={SEA} />
      <path d={SEA_SHAPE} fillRule="evenodd" fill="url(#sea-lines)" />
      <g clipPath="url(#sea-clip)" fill="none">
        {[
          [74, 0.16],
          [56, 0.22],
          [38, 0.3],
          [20, 0.42],
        ].map(([w, o]) => (
          <g key={w}>
            <path d={LAND} stroke={INK} strokeWidth={w} opacity={o} />
            <path d={LAND} stroke={SEA} strokeWidth={w - 2.6} />
          </g>
        ))}
      </g>

      {/* Land: transparent, so the paper texture of the sheet shows through. */}
      <g clipPath="url(#land-clip)">
        <path d={LAND} fill="none" stroke="var(--paper-edge)" strokeWidth={30} opacity={0.6} />
        {contours(292, 268, [24, 44, 64, 86], { squash: 0.68, seed: 7, rot: 0.15 }).map((d, i) => (
          <path key={`a${i}`} d={d} fill="none" stroke={INK_FAINT} strokeWidth={1} opacity={0.7} />
        ))}
        {contours(578, 220, [18, 36, 56], { squash: 0.62, seed: 9, rot: -0.2 }).map((d, i) => (
          <path key={`b${i}`} d={d} fill="none" stroke={INK_FAINT} strokeWidth={1} opacity={0.7} />
        ))}
        <path d={smoothPath(RIVER, false)} fill="none" stroke={INK} strokeWidth={6.5} strokeLinecap="round" />
        <path d={smoothPath(RIVER, false)} fill="none" stroke={SEA} strokeWidth={4} strokeLinecap="round" />
      </g>
      <path d={LAND} fill="none" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />

      {/* Roads */}
      {ROADS.map((road, i) => (
        <g key={i} fill="none" strokeLinecap="round">
          <path d={smoothPath(road, false)} stroke={PAPER} strokeWidth={6} />
          <path d={smoothPath(road, false)} stroke={INK_SOFT} strokeWidth={1.3} strokeDasharray="7 4" />
        </g>
      ))}

      {/* Terrain */}
      {MOUNTAINS.map(([x, y, s]) => (
        <Mountain key={`${x}-${y}`} x={x} y={y} s={s} />
      ))}
      {FORESTS.map(([x, y]) => (
        <Tree key={`${x.toFixed(0)}-${y.toFixed(0)}`} x={x} y={y} />
      ))}
      {WAYSTONES.map(([x, y]) => (
        <Waystone key={`${x.toFixed(0)}-${y.toFixed(0)}`} x={x} y={y} />
      ))}

      {/* The journey, drawn in red like a route on an old chart. */}
      <g mask="url(#trail-mask)">
        <path
          d={trail}
          fill="none"
          stroke={SEAL}
          strokeWidth={2.8}
          strokeDasharray="10 8"
          strokeLinecap="round"
          opacity={0.9}
        />
      </g>

      {/* Landmarks */}
      <University x={at["feu-highlands"][0]} y={at["feu-highlands"][1]} />
      <GuildHall x={at["guild-hall"][0]} y={at["guild-hall"][1]} />
      <Lighthouse x={at["phishing-coast"][0]} y={at["phishing-coast"][1]} />
      <Signpost x={at["routa-crossroads"][0]} y={at["routa-crossroads"][1]} />
      <Jeepney x={1140} y={612} />
      <Castle x={at["cybersoft-citadel"][0]} y={at["cybersoft-citadel"][1]} />
      <Workshop x={at["tinkers-workshop"][0]} y={at["tinkers-workshop"][1]} />
      <Inn x={at["wayfarers-inn"][0]} y={at["wayfarers-inn"][1]} />

      {/* Sea furniture */}
      <path
        d="M1286 318Q1330 252 1392 216"
        fill="none"
        stroke={INK_SOFT}
        strokeWidth={1.4}
        strokeDasharray="5 6"
      />
      <Ship x={1336} y={268} />
      <SeaMonster x={1428} y={478} />
      <Compass x={1478} y={690} />
      <text
        x={1350}
        y={840}
        textAnchor="middle"
        fontSize={21}
        fontStyle="italic"
        letterSpacing={3}
        fill={INK_SOFT}
        transform="rotate(-7 1350 840)"
        style={body}
      >
        Sea of Merge Requests
      </text>
      <ScaleBar x={1340} y={924} />
      <Cartouche />

      {/* Neatline: a chequered border band between two rules. */}
      <rect
        x={18}
        y={18}
        width={W - 36}
        height={H - 36}
        fill="none"
        stroke={INK}
        strokeWidth={11}
        strokeDasharray="40 40"
      />
      <rect x={12} y={12} width={W - 24} height={H - 24} fill="none" stroke={INK} strokeWidth={2} />
      <rect x={24} y={24} width={W - 48} height={H - 48} fill="none" stroke={INK} strokeWidth={1.2} />
    </svg>
  );
}
