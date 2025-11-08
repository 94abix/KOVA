import { describe, it, expect } from "vitest";
import { computeJointAngle } from "@/lib/pose/utils";
import type { Keypoint } from "@/lib/pose/types";

describe("computeJointAngle", () => {
  it("calcule un angle de 90 degrés", () => {
    const a: Keypoint = { x: 0, y: 0, score: 1 };
    const b: Keypoint = { x: 0, y: 1, score: 1 };
    const c: Keypoint = { x: 1, y: 1, score: 1 };

    const angle = computeJointAngle(a, b, c);
    expect(angle).toBeCloseTo(90, 1);
  });

  it("calcule un angle de 180 degrés (ligne droite)", () => {
    const a: Keypoint = { x: 0, y: 0, score: 1 };
    const b: Keypoint = { x: 1, y: 0, score: 1 };
    const c: Keypoint = { x: 2, y: 0, score: 1 };

    const angle = computeJointAngle(a, b, c);
    expect(angle).toBeCloseTo(180, 1);
  });

  it("retourne 0 si les points sont identiques", () => {
    const point: Keypoint = { x: 0, y: 0, score: 1 };
    const angle = computeJointAngle(point, point, point);
    expect(angle).toBe(0);
  });
});

