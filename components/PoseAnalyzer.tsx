"use client";

import { useState, useCallback } from "react";
import { usePoseModel } from "@/lib/hooks/usePoseModel";
import { extractAllAngles } from "@/lib/pose/angles";
import { computeAngularVelocity } from "@/lib/pose/velocity";
import { computeAsymmetry } from "@/lib/pose/asymmetry";
import { computeCadence } from "@/lib/pose/cadence";
import { generateHealthAlerts } from "@/lib/pose/alerts";
import type { PoseFrame, Metrics } from "@/lib/pose/types";

interface PoseAnalyzerProps {
  video: HTMLVideoElement | null;
  onAnalysisComplete: (frames: PoseFrame[], metrics: Metrics, alerts: Array<{
    level: "info" | "attention" | "risque";
    text: string;
    recommendation: string;
    frames?: number[];
  }>) => void;
}

export function PoseAnalyzer({
  video,
  onAnalysisComplete,
}: PoseAnalyzerProps) {
  const { model, loading, error, analyzeVideo } = usePoseModel();
  const [progress, setProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const startAnalysis = useCallback(async () => {
    if (!video || !model || loading) return;

    setIsAnalyzing(true);
    setProgress(0);

    try {
      // Analyser la vidéo
      const frames = await analyzeVideo(video, (prog) => setProgress(prog));

      // Extraire les angles
      const angles = extractAllAngles(frames);
      const times = frames.map((f) => f.t);

      // Calculer les vélocités angulaires
      const angularVelocities: { [key: string]: number[] } = {};
      Object.entries(angles).forEach(([key, values]) => {
        angularVelocities[key] = computeAngularVelocity(values, times);
      });

      // Calculer l'asymétrie
      const asymmetry = {
        elbow: computeAsymmetry(angles.left_elbow, angles.right_elbow),
        shoulder: computeAsymmetry(angles.left_shoulder, angles.right_shoulder),
        hip: computeAsymmetry(angles.left_hip, angles.right_hip),
        knee: computeAsymmetry(angles.left_knee, angles.right_knee),
        ankle: computeAsymmetry(angles.left_ankle, angles.right_ankle),
      };

      // Calculer la cadence (sur les vélocités moyennes)
      const avgVelocities = times.map((_, i) => {
        const sum = Object.values(angularVelocities).reduce(
          (acc, vel) => acc + Math.abs(vel[i] || 0),
          0
        );
        return sum / Object.keys(angularVelocities).length;
      });
      const cadence = computeCadence(avgVelocities, times);

      const metrics: Metrics = {
        angles,
        angularVelocities,
        asymmetry,
        cadence,
      };

      // Générer les alertes
      const alerts = generateHealthAlerts(frames, asymmetry, cadence.trend);

      onAnalysisComplete(frames, metrics, alerts);
    } catch (err) {
      console.error("Erreur lors de l'analyse:", err);
      alert("Erreur lors de l'analyse. Réessaye.");
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  }, [video, model, loading, analyzeVideo, onAnalysisComplete]);

  if (error) {
    return (
      <div className="border border-border rounded-lg p-8 text-center">
        <p className="text-red-400 mb-4">
          Erreur lors du chargement du modèle: {error}
        </p>
        <p className="text-sm text-muted-foreground">
          Utilise la vidéo de démonstration ou réessaye plus tard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        onClick={startAnalysis}
        disabled={!video || loading || isAnalyzing}
        className="w-full bg-accent hover:bg-accent-light text-white py-3 px-6 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading
          ? "Chargement du modèle..."
          : isAnalyzing
          ? `Analyse en cours... ${Math.round(progress)}%`
          : "Lancer l'analyse"}
      </button>

      {isAnalyzing && (
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

