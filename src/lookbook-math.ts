export const wrap = (x: number, n: number) => ((x % n) + n) % n;

export const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

export const KX = [1.2, 0.744, 0.496, 0.346, 0.235, 0.15, 0.085];
export const KF = [1.14, 0.89, 0.777, 0.704, 0.651, 0.616, 0.59];
export const KH = [1.18, 0.832, 0.574, 0.436, 0.334, 0.258, 0.19];
export const KB = [0, 0, 1.5, 4, 8, 12, 17];
export const KO = [1, 1, 1, 1, 0.86, 0.5, 0];

export function computeModelDepth(index: number, p: number, n: number = 6) {
  let d = wrap(index - p, n);
  if (d > n - 1) d -= n;
  return d;
}

export function interpolateDepthStops(d: number, W: number, H: number, base: number, r: number) {
  const k = clamp(d + 1, 0, 6);
  const a = Math.floor(k);
  const b = Math.min(6, a + 1);
  const t = k - a;
  const mix = (A: number[]) => A[a] + (A[b] - A[a]) * t;

  const h = mix(KH) * H;
  const s = h / base;
  const w = h * r;
  const x = mix(KX) * W - w / 2;
  const y = mix(KF) * H - h;
  const f = mix(KB) / s;
  const o = mix(KO);
  const zIndex = 100 - Math.round(d * 10);

  return { x, y, s, w, h, blur: f, opacity: o, zIndex };
}

export function computeCardOffset(i: number, p: number, cardS: number, totalCards: number = 12) {
  const all = cardS * totalCards;
  let y = wrap(i * cardS - p * 2 * cardS, all);
  if (y > all - cardS) y -= all;
  return y;
}

export function easePosition(currentP: number, target: number, dt: number) {
  const dtClamped = Math.min(50, dt);
  let p = currentP + (target - currentP) * (1 - Math.exp(-dtClamped * 0.0072));
  if (Math.abs(target - p) < 0.0004) {
    p = target;
  }
  return p;
}
