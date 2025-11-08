"use client";

import { useState, useEffect, useCallback } from "react";
import type { PoseFrame, Keypoint, PoseKeypointName } from "@/lib/pose/types";

// Import dynamique pour éviter les problèmes SSR
let poseDetection: any = null;

const KEYPOINT_NAMES: PoseKeypointName[] = [
  "nose",
  "left_eye",
  "right_eye",
  "left_ear",
  "right_ear",
  "left_shoulder",
  "right_shoulder",
  "left_elbow",
  "right_elbow",
  "left_wrist",
  "right_wrist",
  "left_hip",
  "right_hip",
  "left_knee",
  "right_knee",
  "left_ankle",
  "right_ankle",
];

/**
 * Mapping MoveNet -> nos noms de keypoints
 */
function mapMoveNetToKeypoints(detection: any): Record<PoseKeypointName, Keypoint> {
  const keypoints: Partial<Record<PoseKeypointName, Keypoint>> = {};
  
  detection.keypoints.forEach((kp) => {
    const name = kp.name as string;
    let mappedName: PoseKeypointName | null = null;
    
    if (name.includes("nose")) mappedName = "nose";
    else if (name.includes("left_eye")) mappedName = "left_eye";
    else if (name.includes("right_eye")) mappedName = "right_eye";
    else if (name.includes("left_ear")) mappedName = "left_ear";
    else if (name.includes("right_ear")) mappedName = "right_ear";
    else if (name.includes("left_shoulder")) mappedName = "left_shoulder";
    else if (name.includes("right_shoulder")) mappedName = "right_shoulder";
    else if (name.includes("left_elbow")) mappedName = "left_elbow";
    else if (name.includes("right_elbow")) mappedName = "right_elbow";
    else if (name.includes("left_wrist")) mappedName = "left_wrist";
    else if (name.includes("right_wrist")) mappedName = "right_wrist";
    else if (name.includes("left_hip")) mappedName = "left_hip";
    else if (name.includes("right_hip")) mappedName = "right_hip";
    else if (name.includes("left_knee")) mappedName = "left_knee";
    else if (name.includes("right_knee")) mappedName = "right_knee";
    else if (name.includes("left_ankle")) mappedName = "left_ankle";
    else if (name.includes("right_ankle")) mappedName = "right_ankle";
    
    if (mappedName) {
      keypoints[mappedName] = {
        x: kp.x,
        y: kp.y,
        score: kp.score || 0,
      };
    }
  });
  
  // Remplir les valeurs manquantes avec des valeurs par défaut
  const result: Record<PoseKeypointName, Keypoint> = {} as Record<PoseKeypointName, Keypoint>;
  KEYPOINT_NAMES.forEach((name) => {
    result[name] = keypoints[name] || { x: 0, y: 0, score: 0 };
  });
  
  return result;
}

export function usePoseModel() {
  const [model, setModel] = useState<poseDetection.PoseDetector | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadModel() {
      try {
        // Charger dynamiquement le module (côté client uniquement)
        if (typeof window === "undefined") {
          throw new Error("usePoseModel doit être utilisé côté client");
        }

        if (!poseDetection) {
          poseDetection = await import("@tensorflow-models/pose-detection");
        }

        // Charger MoveNet (modèle le plus stable côté navigateur)
        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          {
            modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
          }
        );

        if (mounted) {
          setModel(detector);
          setLoading(false);
        }
      } catch (err) {
        console.error("Erreur lors du chargement du modèle de pose:", err);
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Erreur inconnue"
          );
          setLoading(false);
        }
      }
    }

    loadModel();

    return () => {
      mounted = false;
      if (model) {
        model.dispose();
      }
    };
  }, []);

  const analyzeVideo = useCallback(
    async (
      video: HTMLVideoElement,
      onProgress?: (progress: number) => void
    ): Promise<PoseFrame[]> => {
      if (!model) {
        throw new Error("Modèle non chargé");
      }

      const frames: PoseFrame[] = [];
      const fps = 30; // Estimation
      const frameDuration = 1 / fps;
      let currentTime = 0;

      video.currentTime = 0;
      await new Promise((resolve) => {
        video.onseeked = resolve;
      });

      const totalFrames = Math.floor(video.duration * fps);

      while (currentTime < video.duration) {
        video.currentTime = currentTime;
        await new Promise((resolve) => {
          video.onseeked = resolve;
        });

        try {
          const detections = await model.estimatePoses(video);
          
          if (detections.length > 0) {
            const keypoints = mapMoveNetToKeypoints(detections[0]);
            frames.push({
              keypoints,
              t: currentTime,
            });
          } else {
            // Frame sans détection: créer un frame vide
            const emptyKeypoints = {} as Record<PoseKeypointName, Keypoint>;
            KEYPOINT_NAMES.forEach((name) => {
              emptyKeypoints[name] = { x: 0, y: 0, score: 0 };
            });
            frames.push({
              keypoints: emptyKeypoints,
              t: currentTime,
            });
          }

          if (onProgress) {
            const progress = (frames.length / totalFrames) * 100;
            onProgress(progress);
          }
        } catch (err) {
          console.error("Erreur lors de l'analyse d'une frame:", err);
        }

        currentTime += frameDuration;
      }

      return frames;
    },
    [model]
  );

  return { model, loading, error, analyzeVideo };
}

