"use client";

import { useEffect, useRef, useCallback } from "react";
import type { PoseFrame, Keypoint, PoseKeypointName } from "@/lib/pose/types";
import { isKeypointReliable } from "@/lib/pose/utils";

interface SkeletonOverlayProps {
  video: HTMLVideoElement | null;
  frames: PoseFrame[];
  currentTime: number;
  showHeat?: boolean;
}

const KEYPOINT_CONNECTIONS: Array<[PoseKeypointName, PoseKeypointName]> = [
  ["left_shoulder", "right_shoulder"],
  ["left_shoulder", "left_elbow"],
  ["left_elbow", "left_wrist"],
  ["right_shoulder", "right_elbow"],
  ["right_elbow", "right_wrist"],
  ["left_shoulder", "left_hip"],
  ["right_shoulder", "right_hip"],
  ["left_hip", "right_hip"],
  ["left_hip", "left_knee"],
  ["left_knee", "left_ankle"],
  ["right_hip", "right_knee"],
  ["right_knee", "right_ankle"],
];

export function SkeletonOverlay({
  video,
  frames,
  currentTime,
  showHeat = true,
}: SkeletonOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const drawSkeleton = useCallback(() => {
    if (!canvasRef.current || frames.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Trouver la frame la plus proche
    const frameIndex = frames.findIndex((f) => f.t >= currentTime);
    const frame = frameIndex >= 0 ? frames[frameIndex] : frames[frames.length - 1];
    if (!frame) return;

    // Ajuster la taille du canvas au conteneur parent ou à la vidéo
    let rect: DOMRect;
    if (video) {
      rect = video.getBoundingClientRect();
    } else {
      // Sans vidéo, utiliser les dimensions du conteneur parent
      const container = canvas.parentElement?.parentElement;
      if (!container) return;
      rect = container.getBoundingClientRect();
    }
    
    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Échelle pour mapper les coordonnées normalisées (0-1) à la taille du canvas
    const scaleX = canvas.width;
    const scaleY = canvas.height;

    // Dessiner les connections
    ctx.strokeStyle = "#C01C27";
    ctx.lineWidth = 2;
    KEYPOINT_CONNECTIONS.forEach(([a, b]) => {
      const kpA = frame.keypoints[a];
      const kpB = frame.keypoints[b];

      if (
        isKeypointReliable(kpA) &&
        isKeypointReliable(kpB)
      ) {
        ctx.beginPath();
        ctx.moveTo(kpA.x * scaleX, kpA.y * scaleY);
        ctx.lineTo(kpB.x * scaleX, kpB.y * scaleY);
        ctx.stroke();
      }
    });

    // Dessiner les keypoints avec heat
    Object.entries(frame.keypoints).forEach(([name, kp]) => {
      if (!isKeypointReliable(kp)) return;

      const x = kp.x * scaleX;
      const y = kp.y * scaleY;

      if (showHeat) {
        // Couleur selon le score (rouge = faible confiance, vert = haute)
        const alpha = kp.score;
        const green = Math.floor(255 * alpha);
        const red = Math.floor(255 * (1 - alpha));
        ctx.fillStyle = `rgb(${red}, ${green}, 0)`;
      } else {
        ctx.fillStyle = "#C01C27";
      }

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [video, frames, currentTime, showHeat]);

  useEffect(() => {
    // Petit délai pour s'assurer que le conteneur est monté
    const timer = setTimeout(() => {
      drawSkeleton();
    }, 10);

    // Redessiner quand la fenêtre change de taille
    const handleResize = () => {
      drawSkeleton();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [drawSkeleton]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      <canvas
        ref={canvasRef}
        className="pointer-events-none w-full h-full"
        style={{ zIndex: 10 }}
      />
    </div>
  );
}

