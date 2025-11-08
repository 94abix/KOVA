import { computeAngularVelocity } from "./velocity";

/**
 * Calcule la cadence (pics de vitesse) et la tendance
 * Cadence = nombre de pics par seconde
 * Trend = variation entre premier et dernier tiers (%)
 */
export function computeCadence(
  angles: number[],
  times: number[]
): { value: number; trend: number } {
  if (angles.length < 3 || times.length !== angles.length) {
    return { value: 0, trend: 0 };
  }

  const velocities = computeAngularVelocity(angles, times);
  const threshold = Math.max(...velocities.map(Math.abs)) * 0.6; // 60% du max

  // Détection de pics (signe changeant)
  let peaks = 0;
  for (let i = 1; i < velocities.length - 1; i++) {
    const prev = Math.abs(velocities[i - 1]);
    const curr = Math.abs(velocities[i]);
    const next = Math.abs(velocities[i + 1]);
    if (curr > threshold && curr > prev && curr > next) {
      peaks++;
    }
  }

  const duration = times[times.length - 1] - times[0];
  const cadence = duration > 0 ? peaks / duration : 0;

  // Trend: comparaison premier vs dernier tiers
  const third = Math.floor(velocities.length / 3);
  const firstThirdAvg =
    velocities
      .slice(0, third)
      .reduce((sum, v) => sum + Math.abs(v), 0) / third;
  const lastThirdAvg =
    velocities
      .slice(-third)
      .reduce((sum, v) => sum + Math.abs(v), 0) / third;

  const trend =
    firstThirdAvg > 0
      ? ((lastThirdAvg - firstThirdAvg) / firstThirdAvg) * 100
      : 0;

  return { value: cadence, trend };
}

