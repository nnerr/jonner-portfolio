// Small helpers for drawing the hand-made map. Everything is deterministic
// (seeded), so the server and every visitor see the same coastline.

export type Pt = readonly [number, number];

/** Seeded pseudo-random numbers (mulberry32). */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Splits each segment and nudges the new points sideways, for a hand-drawn edge. */
export function roughen(
  points: Pt[],
  { closed = true, steps = 3, amp = 8, seed = 1 } = {},
): Pt[] {
  const rand = rng(seed);
  const out: Pt[] = [];
  const n = points.length;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[(i + 1) % n];
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    out.push(points[i]);
    for (let s = 1; s < steps; s++) {
      const t = s / steps;
      const off = (rand() - 0.5) * 2 * amp;
      out.push([x0 + dx * t + nx * off, y0 + dy * t + ny * off]);
    }
  }
  if (!closed) out.push(points[n - 1]);
  return out;
}

const r1 = (v: number) => Math.round(v * 10) / 10;

/** A Catmull-Rom spline through the points, as SVG path data. */
export function smoothPath(points: Pt[], closed = true): string {
  const n = points.length;
  const at = (i: number) =>
    closed ? points[(i + n) % n] : points[Math.max(0, Math.min(n - 1, i))];
  let d = `M${r1(points[0][0])} ${r1(points[0][1])}`;
  const segments = closed ? n : n - 1;
  for (let i = 0; i < segments; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${r1(c1x)} ${r1(c1y)} ${r1(c2x)} ${r1(c2y)} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return closed ? `${d}Z` : d;
}

/** An irregular closed loop, for islands and seals. */
export function blob(
  cx: number,
  cy: number,
  r: number,
  { n = 14, wobble = 0.18, squash = 1, seed = 1, rot = 0 } = {},
): Pt[] {
  const rand = rng(seed);
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = r * (1 + (rand() - 0.5) * 2 * wobble);
    const x = Math.cos(a) * rr;
    const y = Math.sin(a) * rr * squash;
    pts.push([
      cx + x * Math.cos(rot) - y * Math.sin(rot),
      cy + x * Math.sin(rot) + y * Math.cos(rot),
    ]);
  }
  return pts;
}

/** Nested contour rings that share one wobble pattern, so they never cross. */
export function contours(
  cx: number,
  cy: number,
  radii: number[],
  { n = 16, wobble = 0.16, squash = 0.7, seed = 1, rot = 0 } = {},
): string[] {
  const base = rng(seed);
  const shape = Array.from({ length: n }, () => 1 + (base() - 0.5) * 2 * wobble);
  return radii.map((r, k) => {
    const jitter = rng(seed * 31 + k);
    const pts: Pt[] = shape.map((s, i) => {
      const a = (i / n) * Math.PI * 2;
      const rr = r * (s + (jitter() - 0.5) * 0.05);
      const x = Math.cos(a) * rr;
      const y = Math.sin(a) * rr * squash;
      return [
        cx + x * Math.cos(rot) - y * Math.sin(rot),
        cy + x * Math.sin(rot) + y * Math.cos(rot),
      ] as const;
    });
    return smoothPath(pts, true);
  });
}

/** Points scattered inside an ellipse, kept a minimum distance apart. */
export function scatter(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  count: number,
  { minDist = 16, seed = 1 } = {},
): Pt[] {
  const rand = rng(seed);
  const out: Pt[] = [];
  let tries = 0;
  while (out.length < count && tries < count * 60) {
    tries++;
    const a = rand() * Math.PI * 2;
    const d = Math.sqrt(rand());
    const p: Pt = [cx + Math.cos(a) * rx * d, cy + Math.sin(a) * ry * d];
    if (out.every((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) >= minDist)) out.push(p);
  }
  // Draw back-to-front so lower trees overlap higher ones.
  return out.sort((a, b) => a[1] - b[1]);
}

/** Points along the same spline smoothPath draws, for measuring and crossing tests. */
export function sampleSpline(points: Pt[], closed = false, steps = 16): Pt[] {
  const n = points.length;
  const at = (i: number) =>
    closed ? points[(i + n) % n] : points[Math.max(0, Math.min(n - 1, i))];
  const out: Pt[] = [];
  const segments = closed ? n : n - 1;
  for (let i = 0; i < segments; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const u = 1 - t;
      const a = u * u * u;
      const b = 3 * u * u * t;
      const c = 3 * u * t * t;
      const d = t * t * t;
      out.push([
        a * p1[0] + b * c1[0] + c * c2[0] + d * p2[0],
        a * p1[1] + b * c1[1] + c * c2[1] + d * p2[1],
      ]);
    }
  }
  out.push(closed ? points[0] : points[n - 1]);
  return out;
}

/** Where polyline `road` crosses polyline `river`, with the road's heading in degrees. */
export function crossings(road: Pt[], river: Pt[]): { point: Pt; angle: number }[] {
  const hits: { point: Pt; angle: number }[] = [];
  for (let i = 1; i < road.length; i++) {
    const [ax, ay] = road[i - 1];
    const [bx, by] = road[i];
    for (let j = 1; j < river.length; j++) {
      const [cx, cy] = river[j - 1];
      const [dx, dy] = river[j];
      const den = (bx - ax) * (dy - cy) - (by - ay) * (dx - cx);
      if (den === 0) continue;
      const t = ((cx - ax) * (dy - cy) - (cy - ay) * (dx - cx)) / den;
      const u = ((cx - ax) * (by - ay) - (cy - ay) * (bx - ax)) / den;
      if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        hits.push({
          point: [ax + (bx - ax) * t, ay + (by - ay) * t],
          angle: (Math.atan2(by - ay, bx - ax) * 180) / Math.PI,
        });
      }
    }
  }
  return hits;
}

/** Point at fraction t along a polyline (by length). */
export function along(points: Pt[], t: number): Pt {
  const lens: number[] = [];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const l = Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
    lens.push(l);
    total += l;
  }
  let target = total * t;
  for (let i = 0; i < lens.length; i++) {
    if (target <= lens[i]) {
      const f = target / lens[i];
      return [
        points[i][0] + (points[i + 1][0] - points[i][0]) * f,
        points[i][1] + (points[i + 1][1] - points[i][1]) * f,
      ];
    }
    target -= lens[i];
  }
  return points[points.length - 1];
}
