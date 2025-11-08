import { smoothArray } from "./utils";

/**
 * Calcule la vélocité angulaire (dérivée simple) en degrés/seconde
 */
export function computeAngularVelocity(
  angles: number[],
  times: number[]
): number[] {
  if (angles.length < 2 || times.length !== angles.length) {
    return angles.map(() => 0);
  }

  const velocities: number[] = [0]; // Première frame = 0

  for (let i = 1; i < angles.length; i++) {
    const dt = times[i] - times[i - 1];
    if (dt > 0) {
      const dAngle = angles[i] - angles[i - 1];
      velocities.push(dAngle / dt);
    } else {
      velocities.push(0);
    }
  }

  return smoothArray(velocities, 3);
}

