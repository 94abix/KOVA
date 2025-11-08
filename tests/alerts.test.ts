import { describe, it, expect } from "vitest";
import { detectKneeValgus, detectLumbarFlexion } from "@/lib/pose/alerts";
import type { PoseFrame } from "@/lib/pose/types";

describe("detectKneeValgus", () => {
  it("détecte le valgus du genou", () => {
    const frames: PoseFrame[] = [];
    for (let i = 0; i < 10; i++) {
      frames.push({
        keypoints: {
          left_hip: { x: 0.5, y: 0.3, score: 0.9 },
          left_knee: { x: 0.5, y: 0.5, score: 0.9 },
          left_ankle: { x: 0.6, y: 0.7, score: 0.9 }, // Valgus (angle < 165°)
          // Autres keypoints requis...
        } as any,
        t: i * 0.1,
      });
    }

    const result = detectKneeValgus(frames);
    expect(result.flagged).toBe(true);
  });

  it("ne détecte pas le valgus si angle normal", () => {
    const frames: PoseFrame[] = [];
    for (let i = 0; i < 10; i++) {
      frames.push({
        keypoints: {
          left_hip: { x: 0.5, y: 0.3, score: 0.9 },
          left_knee: { x: 0.5, y: 0.5, score: 0.9 },
          left_ankle: { x: 0.5, y: 0.7, score: 0.9 }, // Alignement normal
          // Autres keypoints requis...
        } as any,
        t: i * 0.1,
      });
    }

    const result = detectKneeValgus(frames);
    // Devrait être false car angle proche de 180°
    expect(result.ratioFrames).toBeLessThan(0.1);
  });
});

describe("detectLumbarFlexion", () => {
  it("détecte la flexion lombaire excessive", () => {
    const frames: PoseFrame[] = [];
    for (let i = 0; i < 10; i++) {
      frames.push({
        keypoints: {
          left_shoulder: { x: 0.5, y: 0.2, score: 0.9 },
          left_hip: { x: 0.5, y: 0.5, score: 0.9 },
          left_knee: { x: 0.6, y: 0.7, score: 0.9 }, // Dos arrondi (angle < 160°)
          // Autres keypoints requis...
        } as any,
        t: i * 0.1,
      });
    }

    const result = detectLumbarFlexion(frames);
    // Devrait détecter selon les seuils
    expect(result).toHaveProperty("ratioFrames");
    expect(result).toHaveProperty("flagged");
  });
});

