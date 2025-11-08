import type { Keypoint } from "./types";

/**
 * Calcule la distance euclidienne entre deux points
 */
export function distance(a: Keypoint, b: Keypoint): number {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}

/**
 * Calcule l'angle ABC en degrés (b étant le sommet)
 */
export function computeJointAngle(
  a: Keypoint,
  b: Keypoint,
  c: Keypoint
): number {
  const ab = distance(a, b);
  const bc = distance(b, c);
  const ac = distance(a, c);

  if (ab === 0 || bc === 0) return 0;

  // Loi des cosinus: cos(C) = (a² + b² - c²) / (2ab)
  const cosAngle =
    (Math.pow(ab, 2) + Math.pow(bc, 2) - Math.pow(ac, 2)) / (2 * ab * bc);

  // Clamp pour éviter les erreurs d'arrondi
  const clamped = Math.max(-1, Math.min(1, cosAngle));
  const angleRad = Math.acos(clamped);
  return (angleRad * 180) / Math.PI;
}

/**
 * Vérifie si un keypoint est fiable (score > seuil)
 */
export function isKeypointReliable(keypoint: Keypoint, threshold = 0.4): boolean {
  return keypoint.score >= threshold;
}

/**
 * Applique un lissage par moyenne glissante
 */
export function smoothArray(
  values: number[],
  windowSize = 3
): number[] {
  if (values.length === 0) return [];
  if (values.length < windowSize) return values;

  const smoothed: number[] = [];
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(values.length, i + Math.floor(windowSize / 2) + 1);
    const window = values.slice(start, end);
    const avg = window.reduce((sum, v) => sum + v, 0) / window.length;
    smoothed.push(avg);
  }
  return smoothed;
}

