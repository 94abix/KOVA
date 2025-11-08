import type { PoseFrame } from "./types";
import { computeJointAngle, isKeypointReliable } from "./utils";

/**
 * Seuils de détection des alertes (configurables)
 */
const KNEE_VALGUS_THRESHOLD = 165; // degrés
const KNEE_VALGUS_RATIO_THRESHOLD = 0.1; // 10% des frames
const ASYMMETRY_THRESHOLD = 15; // % de différence
const LUMBAR_FLEXION_THRESHOLD = 160; // degrés
const LUMBAR_FLEXION_RATIO_THRESHOLD = 0.1; // 10% des frames
const FATIGUE_TREND_THRESHOLD = -20; // % de baisse
const KEYPOINT_CONFIDENCE_THRESHOLD = 0.4;

/**
 * Détecte le valgus du genou (angle hanche-genou-cheville < seuil)
 */
export function detectKneeValgus(frames: PoseFrame[]): {
  ratioFrames: number;
  flagged: boolean;
  frames: number[];
} {
  const flaggedFrames: number[] = [];

  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    const hip = frame.keypoints.left_hip;
    const knee = frame.keypoints.left_knee;
    const ankle = frame.keypoints.left_ankle;

    if (
      isKeypointReliable(hip, KEYPOINT_CONFIDENCE_THRESHOLD) &&
      isKeypointReliable(knee, KEYPOINT_CONFIDENCE_THRESHOLD) &&
      isKeypointReliable(ankle, KEYPOINT_CONFIDENCE_THRESHOLD)
    ) {
      const angle = computeJointAngle(hip, knee, ankle);
      if (angle < KNEE_VALGUS_THRESHOLD) {
        flaggedFrames.push(i);
      }
    }

    // Vérifier aussi le genou droit
    const hipR = frame.keypoints.right_hip;
    const kneeR = frame.keypoints.right_knee;
    const ankleR = frame.keypoints.right_ankle;

    if (
      isKeypointReliable(hipR, KEYPOINT_CONFIDENCE_THRESHOLD) &&
      isKeypointReliable(kneeR, KEYPOINT_CONFIDENCE_THRESHOLD) &&
      isKeypointReliable(ankleR, KEYPOINT_CONFIDENCE_THRESHOLD)
    ) {
      const angleR = computeJointAngle(hipR, kneeR, ankleR);
      if (angleR < KNEE_VALGUS_THRESHOLD) {
        if (!flaggedFrames.includes(i)) flaggedFrames.push(i);
      }
    }
  }

  const ratioFrames = frames.length > 0 ? flaggedFrames.length / frames.length : 0;
  const flagged = ratioFrames >= KNEE_VALGUS_RATIO_THRESHOLD;

  return { ratioFrames, flagged, frames: flaggedFrames };
}

/**
 * Détecte la flexion lombaire excessive (angle épaule-hanche-genou < seuil)
 */
export function detectLumbarFlexion(frames: PoseFrame[]): {
  ratioFrames: number;
  flagged: boolean;
  frames: number[];
} {
  const flaggedFrames: number[] = [];

  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    const shoulder = frame.keypoints.left_shoulder;
    const hip = frame.keypoints.left_hip;
    const knee = frame.keypoints.left_knee;

    if (
      isKeypointReliable(shoulder, KEYPOINT_CONFIDENCE_THRESHOLD) &&
      isKeypointReliable(hip, KEYPOINT_CONFIDENCE_THRESHOLD) &&
      isKeypointReliable(knee, KEYPOINT_CONFIDENCE_THRESHOLD)
    ) {
      const angle = computeJointAngle(shoulder, hip, knee);
      if (angle < LUMBAR_FLEXION_THRESHOLD) {
        flaggedFrames.push(i);
      }
    }

    // Vérifier aussi côté droit
    const shoulderR = frame.keypoints.right_shoulder;
    const hipR = frame.keypoints.right_hip;
    const kneeR = frame.keypoints.right_knee;

    if (
      isKeypointReliable(shoulderR, KEYPOINT_CONFIDENCE_THRESHOLD) &&
      isKeypointReliable(hipR, KEYPOINT_CONFIDENCE_THRESHOLD) &&
      isKeypointReliable(kneeR, KEYPOINT_CONFIDENCE_THRESHOLD)
    ) {
      const angleR = computeJointAngle(shoulderR, hipR, kneeR);
      if (angleR < LUMBAR_FLEXION_THRESHOLD) {
        if (!flaggedFrames.includes(i)) flaggedFrames.push(i);
      }
    }
  }

  const ratioFrames = frames.length > 0 ? flaggedFrames.length / frames.length : 0;
  const flagged = ratioFrames >= LUMBAR_FLEXION_RATIO_THRESHOLD;

  return { ratioFrames, flagged, frames: flaggedFrames };
}

/**
 * Génère toutes les alertes de santé basées sur les frames et métriques
 */
export function generateHealthAlerts(
  frames: PoseFrame[],
  asymmetry: { [key: string]: number },
  cadenceTrend: number
): Array<{
  level: "info" | "attention" | "risque";
  text: string;
  recommendation: string;
  frames?: number[];
}> {
  const alerts: Array<{
    level: "info" | "attention" | "risque";
    text: string;
    recommendation: string;
    frames?: number[];
  }> = [];

  // Alerte valgus genou
  const kneeValgus = detectKneeValgus(frames);
  if (kneeValgus.flagged) {
    alerts.push({
      level: kneeValgus.ratioFrames > 0.25 ? "risque" : "attention",
      text: "Alignement genou à surveiller",
      recommendation:
        "Surveille l'alignement lors des flexions. Pense à renforcer les muscles stabilisateurs du genou.",
      frames: kneeValgus.frames,
    });
  }

  // Alerte asymétrie
  const maxAsymmetry = Math.max(
    asymmetry.elbow || 0,
    asymmetry.shoulder || 0,
    asymmetry.hip || 0,
    asymmetry.knee || 0,
    asymmetry.ankle || 0
  );
  if (maxAsymmetry > ASYMMETRY_THRESHOLD) {
    const segment = Object.entries(asymmetry).find(
      ([_, v]) => v === maxAsymmetry
    )?.[0];
    alerts.push({
      level: maxAsymmetry > 25 ? "attention" : "info",
      text: `Asymétrie gauche/droite détectée (${segment})`,
      recommendation:
        "Travaille l'équilibre entre gauche et droite pour éviter les déséquilibres musculaires.",
    });
  }

  // Alerte posture lombaire
  const lumbarFlexion = detectLumbarFlexion(frames);
  if (lumbarFlexion.flagged) {
    alerts.push({
      level: lumbarFlexion.ratioFrames > 0.25 ? "attention" : "info",
      text: "Posture lombaire à améliorer",
      recommendation:
        "Garde le dos droit et engage les muscles abdominaux pour protéger le bas du dos.",
      frames: lumbarFlexion.frames,
    });
  }

  // Alerte fatigue
  if (cadenceTrend < FATIGUE_TREND_THRESHOLD) {
    alerts.push({
      level: cadenceTrend < -30 ? "attention" : "info",
      text: "Diminution de cadence détectée",
      recommendation:
        "La cadence diminue en fin de séquence. Pense à ajuster l'intensité ou la durée.",
    });
  }

  return alerts;
}

