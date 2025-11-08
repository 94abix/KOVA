/**
 * Mode démonstration - données mock pour tester sans Supabase
 */

import type { PoseFrame, Metrics } from "./pose/types";

/**
 * Génère des frames de démonstration synthétiques avec simulation de coups de poing
 */
export function generateDemoFrames(duration: number = 10, fps: number = 30): PoseFrame[] {
  const frames: PoseFrame[] = [];
  const frameCount = Math.floor(duration * fps);
  const timeStep = duration / frameCount;

  // Séquence de coups : jab gauche, cross droit, uppercut gauche, hook droit
  const punchSequence = [
    { type: "jab", side: "left", start: 0, duration: 0.5 },
    { type: "guard", side: "both", start: 0.5, duration: 0.3 },
    { type: "cross", side: "right", start: 0.8, duration: 0.5 },
    { type: "guard", side: "both", start: 1.3, duration: 0.3 },
    { type: "uppercut", side: "left", start: 1.6, duration: 0.6 },
    { type: "guard", side: "both", start: 2.2, duration: 0.3 },
    { type: "hook", side: "right", start: 2.5, duration: 0.5 },
    { type: "guard", side: "both", start: 3.0, duration: 0.5 },
  ];

  // Répéter la séquence pour la durée totale
  const loopDuration = 3.5;
  const loops = Math.ceil(duration / loopDuration);

  for (let i = 0; i < frameCount; i++) {
    const t = i * timeStep;
    const tInLoop = t % loopDuration;

    // Trouver le coup actuel
    let currentPunch = punchSequence[punchSequence.length - 1];
    for (const punch of punchSequence) {
      if (tInLoop >= punch.start && tInLoop < punch.start + punch.duration) {
        currentPunch = punch;
        break;
      }
    }

    // Position de base (stance de boxe)
    const baseX = 0.5;
    const baseY = 0.4; // Position des épaules

    // Calcul du progrès dans le coup actuel (0 à 1)
    const punchProgress = currentPunch.start > 0 
      ? Math.max(0, Math.min(1, (tInLoop - currentPunch.start) / currentPunch.duration))
      : 0;

    // Fonction d'easing pour mouvement réaliste
    const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const progress = easeInOut(punchProgress);

    // Positions des épaules (légère rotation du tronc)
    let leftShoulderX = baseX - 0.15;
    let rightShoulderX = baseX + 0.15;
    let shoulderY = baseY;

    // Positions des hanches
    let leftHipX = baseX - 0.08;
    let rightHipX = baseX + 0.08;
    let hipY = 0.55;

    // Positions des coudes et poignets selon le type de coup
    let leftElbowX = baseX - 0.12;
    let leftElbowY = baseY + 0.15;
    let leftWristX = baseX - 0.1;
    let leftWristY = baseY + 0.3;

    let rightElbowX = baseX + 0.12;
    let rightElbowY = baseY + 0.15;
    let rightWristX = baseX + 0.1;
    let rightWristY = baseY + 0.3;

    // Simulation des différents types de coups
    if (currentPunch.type === "jab" && currentPunch.side === "left") {
      // Jab gauche : extension rapide du bras gauche
      const extension = progress * 0.4;
      leftWristX = baseX - 0.15 + extension;
      leftWristY = baseY + 0.25 - extension * 0.3;
      leftElbowX = baseX - 0.12 + extension * 0.3;
      leftElbowY = baseY + 0.15;
      
      // Rotation du tronc vers la droite
      const rotation = progress * 0.05;
      leftShoulderX = baseX - 0.15 + rotation;
      rightShoulderX = baseX + 0.15 + rotation;
      
      // Rotation des hanches
      leftHipX = baseX - 0.08 + rotation * 0.5;
      rightHipX = baseX + 0.08 + rotation * 0.5;

    } else if (currentPunch.type === "cross" && currentPunch.side === "right") {
      // Cross droit : extension puissante du bras droit avec rotation
      const extension = progress * 0.45;
      rightWristX = baseX + 0.15 + extension;
      rightWristY = baseY + 0.25 - extension * 0.2;
      rightElbowX = baseX + 0.12 + extension * 0.3;
      rightElbowY = baseY + 0.15;
      
      // Rotation complète du tronc vers la gauche
      const rotation = progress * -0.08;
      leftShoulderX = baseX - 0.15 + rotation;
      rightShoulderX = baseX + 0.15 + rotation;
      
      // Rotation des hanches (plus prononcée)
      leftHipX = baseX - 0.08 + rotation * 0.8;
      rightHipX = baseX + 0.08 + rotation * 0.8;

    } else if (currentPunch.type === "uppercut" && currentPunch.side === "left") {
      // Uppercut gauche : mouvement vertical
      const extension = progress * 0.35;
      leftWristX = baseX - 0.1;
      leftWristY = baseY + 0.3 - extension;
      leftElbowX = baseX - 0.08;
      leftElbowY = baseY + 0.2 - extension * 0.4;
      
      // Légère rotation
      const rotation = progress * 0.04;
      leftShoulderX = baseX - 0.15 + rotation;
      rightShoulderX = baseX + 0.15 + rotation;

    } else if (currentPunch.type === "hook" && currentPunch.side === "right") {
      // Hook droit : mouvement circulaire
      const extension = progress * 0.4;
      const angle = Math.PI * 0.3 * (1 - progress);
      rightWristX = baseX + 0.15 + Math.cos(angle) * extension;
      rightWristY = baseY + 0.2 + Math.sin(angle) * extension * 0.5;
      rightElbowX = baseX + 0.12 + extension * 0.3;
      rightElbowY = baseY + 0.15;
      
      // Rotation du tronc
      const rotation = progress * -0.06;
      leftShoulderX = baseX - 0.15 + rotation;
      rightShoulderX = baseX + 0.15 + rotation;

    } else if (currentPunch.type === "guard") {
      // Garde : position défensive avec légers mouvements
      const idle = Math.sin(t * 4) * 0.02;
      leftElbowX = baseX - 0.12 + idle;
      rightElbowX = baseX + 0.12 - idle;
      leftWristX = baseX - 0.08 + idle;
      rightWristX = baseX + 0.08 - idle;
      leftWristY = baseY + 0.25;
      rightWristY = baseY + 0.25;
    }

    // Légers mouvements des jambes pour réalisme
    const legMovement = Math.sin(t * 2) * 0.02;
    const kneeFlex = Math.abs(Math.sin(t * 3)) * 0.03;

    frames.push({
      keypoints: {
        nose: { x: baseX, y: 0.2, score: 0.95 },
        left_eye: { x: baseX - 0.02, y: 0.18, score: 0.9 },
        right_eye: { x: baseX + 0.02, y: 0.18, score: 0.9 },
        left_ear: { x: baseX - 0.05, y: 0.2, score: 0.85 },
        right_ear: { x: baseX + 0.05, y: 0.2, score: 0.85 },
        left_shoulder: {
          x: leftShoulderX,
          y: shoulderY,
          score: 0.9,
        },
        right_shoulder: {
          x: rightShoulderX,
          y: shoulderY,
          score: 0.9,
        },
        left_elbow: {
          x: leftElbowX,
          y: leftElbowY,
          score: 0.85,
        },
        right_elbow: {
          x: rightElbowX,
          y: rightElbowY,
          score: 0.85,
        },
        left_wrist: {
          x: leftWristX,
          y: leftWristY,
          score: 0.8,
        },
        right_wrist: {
          x: rightWristX,
          y: rightWristY,
          score: 0.8,
        },
        left_hip: { x: leftHipX, y: hipY, score: 0.9 },
        right_hip: { x: rightHipX, y: hipY, score: 0.9 },
        left_knee: {
          x: leftHipX + legMovement,
          y: 0.75 + kneeFlex,
          score: 0.85,
        },
        right_knee: {
          x: rightHipX - legMovement,
          y: 0.75 + kneeFlex,
          score: 0.85,
        },
        left_ankle: { x: leftHipX, y: 0.9, score: 0.8 },
        right_ankle: { x: rightHipX, y: 0.9, score: 0.8 },
      },
      t,
    });
  }

  return frames;
}

/**
 * Génère des métriques de démonstration à partir de frames
 */
export function generateDemoMetrics(frames: PoseFrame[]): Metrics {
  // Simuler des angles variés
  const frameCount = frames.length;
  const angles = {
    left_elbow: Array.from({ length: frameCount }, (_, i) => {
      const phase = (i / frameCount) * Math.PI * 4;
      return 140 + Math.sin(phase) * 30 + Math.random() * 10;
    }),
    right_elbow: Array.from({ length: frameCount }, (_, i) => {
      const phase = (i / frameCount) * Math.PI * 4;
      return 145 + Math.sin(phase) * 35 + Math.random() * 10;
    }),
    left_shoulder: Array.from({ length: frameCount }, () => 170 + Math.random() * 10),
    right_shoulder: Array.from({ length: frameCount }, () => 175 + Math.random() * 10),
    left_hip: Array.from({ length: frameCount }, () => 175 + Math.random() * 5),
    right_hip: Array.from({ length: frameCount }, () => 175 + Math.random() * 5),
    left_knee: Array.from({ length: frameCount }, (_, i) => {
      const phase = (i / frameCount) * Math.PI * 2;
      return 160 + Math.sin(phase) * 20 + Math.random() * 10;
    }),
    right_knee: Array.from({ length: frameCount }, (_, i) => {
      const phase = (i / frameCount) * Math.PI * 2;
      return 155 + Math.sin(phase) * 25 + Math.random() * 10;
    }),
    left_ankle: Array.from({ length: frameCount }, () => 80 + Math.random() * 10),
    right_ankle: Array.from({ length: frameCount }, () => 85 + Math.random() * 10),
  };

  const times = frames.map((f) => f.t);

  // Calculer vélocités
  const angularVelocities: { [key: string]: number[] } = {};
  Object.entries(angles).forEach(([key, values]) => {
    const velocities = [];
    for (let i = 0; i < values.length; i++) {
      if (i === 0) {
        velocities.push(0);
      } else {
        const dt = times[i] - times[i - 1];
        velocities.push((values[i] - values[i - 1]) / dt);
      }
    }
    angularVelocities[key] = velocities;
  });

  // Calculer asymétrie
  const computeAsym = (left: number[], right: number[]) => {
    const avgLeft = left.reduce((a, b) => a + b, 0) / left.length;
    const avgRight = right.reduce((a, b) => a + b, 0) / right.length;
    const maxAvg = Math.max(Math.abs(avgLeft), Math.abs(avgRight));
    return maxAvg > 0 ? (Math.abs(avgLeft - avgRight) / maxAvg) * 100 : 0;
  };

  // Calculer cadence
  const avgVelocities = times.map((_, i) => {
    const sum = Object.values(angularVelocities).reduce(
      (acc, vel) => acc + Math.abs(vel[i] || 0),
      0
    );
    return sum / Object.keys(angularVelocities).length;
  });

  const third = Math.floor(avgVelocities.length / 3);
  const firstThirdAvg =
    avgVelocities.slice(0, third).reduce((a, b) => a + Math.abs(b), 0) / third;
  const lastThirdAvg =
    avgVelocities.slice(-third).reduce((a, b) => a + Math.abs(b), 0) / third;
  const trend =
    firstThirdAvg > 0 ? ((lastThirdAvg - firstThirdAvg) / firstThirdAvg) * 100 : 0;

  // Compter les pics pour cadence
  const threshold = Math.max(...avgVelocities.map(Math.abs)) * 0.6;
  let peaks = 0;
  for (let i = 1; i < avgVelocities.length - 1; i++) {
    const prev = Math.abs(avgVelocities[i - 1]);
    const curr = Math.abs(avgVelocities[i]);
    const next = Math.abs(avgVelocities[i + 1]);
    if (curr > threshold && curr > prev && curr > next) {
      peaks++;
    }
  }
  const cadence = times.length > 0 ? peaks / (times[times.length - 1] - times[0]) : 0;

  return {
    angles,
    angularVelocities,
    asymmetry: {
      elbow: computeAsym(angles.left_elbow, angles.right_elbow),
      shoulder: computeAsym(angles.left_shoulder, angles.right_shoulder),
      hip: computeAsym(angles.left_hip, angles.right_hip),
      knee: computeAsym(angles.left_knee, angles.right_knee),
      ankle: computeAsym(angles.left_ankle, angles.right_ankle),
    },
    cadence: {
      value: cadence,
      trend,
    },
  };
}

