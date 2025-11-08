import { describe, it, expect } from "vitest";
import { computeAsymmetry } from "@/lib/pose/asymmetry";

describe("computeAsymmetry", () => {
  it("retourne 0 pour des angles identiques", () => {
    const left = [90, 90, 90];
    const right = [90, 90, 90];
    const asymmetry = computeAsymmetry(left, right);
    expect(asymmetry).toBe(0);
  });

  it("calcule l'asymétrie correctement", () => {
    const left = [90, 90, 90]; // moyenne 90
    const right = [100, 100, 100]; // moyenne 100
    const asymmetry = computeAsymmetry(left, right);
    // |90 - 100| / 100 * 100 = 10%
    expect(asymmetry).toBeCloseTo(10, 1);
  });

  it("retourne 0 pour des tableaux vides", () => {
    const asymmetry = computeAsymmetry([], []);
    expect(asymmetry).toBe(0);
  });
});

