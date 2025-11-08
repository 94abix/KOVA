export type Keypoint = {
  x: number;
  y: number;
  score: number;
};

export type PoseKeypointName =
  | "nose"
  | "left_eye"
  | "right_eye"
  | "left_ear"
  | "right_ear"
  | "left_shoulder"
  | "right_shoulder"
  | "left_elbow"
  | "right_elbow"
  | "left_wrist"
  | "right_wrist"
  | "left_hip"
  | "right_hip"
  | "left_knee"
  | "right_knee"
  | "left_ankle"
  | "right_ankle";

export type PoseFrame = {
  keypoints: Record<PoseKeypointName, Keypoint>;
  t: number; // timestamp en secondes
};

export type Metrics = {
  angles: {
    left_elbow: number[];
    right_elbow: number[];
    left_shoulder: number[];
    right_shoulder: number[];
    left_hip: number[];
    right_hip: number[];
    left_knee: number[];
    right_knee: number[];
    left_ankle: number[];
    right_ankle: number[];
  };
  angularVelocities: {
    [key: string]: number[];
  };
  asymmetry: {
    elbow: number;
    shoulder: number;
    hip: number;
    knee: number;
    ankle: number;
  };
  cadence: {
    value: number;
    trend: number; // % de variation entre premier et dernier tiers
  };
};

export type HealthAlert = {
  level: "info" | "attention" | "risque";
  text: string;
  recommendation: string;
  frames?: number[];
};

