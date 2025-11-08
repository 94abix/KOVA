/**
 * Calcule le pourcentage d'asymétrie entre deux séries d'angles
 * Formule: |moy_G - moy_D| / max(moy_G, moy_D) * 100
 */
export function computeAsymmetry(
  leftAngles: number[],
  rightAngles: number[]
): number {
  if (leftAngles.length === 0 || rightAngles.length === 0) return 0;

  const avgLeft =
    leftAngles.reduce((sum, v) => sum + v, 0) / leftAngles.length;
  const avgRight =
    rightAngles.reduce((sum, v) => sum + v, 0) / rightAngles.length;

  const maxAvg = Math.max(Math.abs(avgLeft), Math.abs(avgRight));
  if (maxAvg === 0) return 0;

  return (Math.abs(avgLeft - avgRight) / maxAvg) * 100;
}

