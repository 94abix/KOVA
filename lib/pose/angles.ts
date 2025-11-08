import type { PoseFrame, Keypoint } from "./types";
import { computeJointAngle, isKeypointReliable, smoothArray } from "./utils";

/**
 * Constantes de seuils pour la fiabilité
 */
const KEYPOINT_CONFIDENCE_THRESHOLD = 0.4;
const SMOOTHING_WINDOW = 3;

/**
 * Extrait les angles d'un segment spécifique pour toutes les frames
 */
export function extractAngles(
  frames: PoseFrame[],
  jointA: (frame: PoseFrame) => Keypoint | null,
  jointB: (frame: PoseFrame) => Keypoint | null,
  jointC: (frame: PoseFrame) => Keypoint | null
): number[] {
  const angles: number[] = [];

  for (const frame of frames) {
    const a = jointA(frame);
    const b = jointB(frame);
    const c = jointC(frame);

    if (
      a &&
      b &&
      c &&
      isKeypointReliable(a, KEYPOINT_CONFIDENCE_THRESHOLD) &&
      isKeypointReliable(b, KEYPOINT_CONFIDENCE_THRESHOLD) &&
      isKeypointReliable(c, KEYPOINT_CONFIDENCE_THRESHOLD)
    ) {
      const angle = computeJointAngle(a, b, c);
      angles.push(angle);
    } else {
      // Interpolation simple: utiliser la dernière valeur valide
      angles.push(angles.length > 0 ? angles[angles.length - 1] : 0);
    }
  }

  return smoothArray(angles, SMOOTHING_WINDOW);
}

/**
 * Extrait tous les angles pertinents pour l'analyse
 */
export function extractAllAngles(frames: PoseFrame[]) {
  return {
    left_elbow: extractAngles(
      frames,
      (f) => f.keypoints.left_shoulder,
      (f) => f.keypoints.left_elbow,
      (f) => f.keypoints.left_wrist
    ),
    right_elbow: extractAngles(
      frames,
      (f) => f.keypoints.right_shoulder,
      (f) => f.keypoints.right_elbow,
      (f) => f.keypoints.right_wrist
    ),
    left_shoulder: extractAngles(
      frames,
      (f) => f.keypoints.left_elbow,
      (f) => f.keypoints.left_shoulder,
      (f) => f.keypoints.left_hip
    ),
    right_shoulder: extractAngles(
      frames,
      (f) => f.keypoints.right_elbow,
      (f) => f.keypoints.right_shoulder,
      (f) => f.keypoints.right_hip
    ),
    left_hip: extractAngles(
      frames,
      (f) => f.keypoints.left_shoulder,
      (f) => f.keypoints.left_hip,
      (f) => f.keypoints.left_knee
    ),
    right_hip: extractAngles(
      frames,
      (f) => f.keypoints.right_shoulder,
      (f) => f.keypoints.right_hip,
      (f) => f.keypoints.right_knee
    ),
    left_knee: extractAngles(
      frames,
      (f) => f.keypoints.left_hip,
      (f) => f.keypoints.left_knee,
      (f) => f.keypoints.left_ankle
    ),
    right_knee: extractAngles(
      frames,
      (f) => f.keypoints.right_hip,
      (f) => f.keypoints.right_knee,
      (f) => f.keypoints.right_ankle
    ),
    left_ankle: extractAngles(
      frames,
      (f) => f.keypoints.left_knee,
      (f) => f.keypoints.left_ankle,
      (f) => ({ x: f.keypoints.left_ankle.x, y: f.keypoints.left_ankle.y + 50, score: 1 }) // Point fictif vers le bas
    ),
    right_ankle: extractAngles(
      frames,
      (f) => f.keypoints.right_knee,
      (f) => f.keypoints.right_ankle,
      (f) => ({ x: f.keypoints.right_ankle.x, y: f.keypoints.right_ankle.y + 50, score: 1 })
    ),
  };
}

