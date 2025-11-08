"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { SkeletonOverlay } from "@/components/SkeletonOverlay";
import { MetricsPanel } from "@/components/MetricsPanel";
import { HealthAlerts } from "@/components/HealthAlerts";
import { Card, CardContent } from "@/components/ui/card";
import type { Metrics, PoseFrame } from "@/lib/pose/types";

interface CoachSessionData {
  videoUrl: string | null;
  duration: number;
  metrics: Metrics;
  alerts: Array<{
    level: "info" | "attention" | "risque";
    text: string;
    recommendation: string;
    frames?: number[];
  }>;
}

export default function CoachViewPage() {
  const params = useParams();
  const [sessionData, setSessionData] = useState<CoachSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (params.token) {
      loadSessionData(params.token as string);
    }
  }, [params.token]);

  async function loadSessionData(token: string) {
    try {
      const res = await fetch(`/api/coach-link/${token}`);
      if (!res.ok) {
        throw new Error("Lien invalide ou expiré");
      }
      const data = await res.json();
      setSessionData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (error || !sessionData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">
            {error || "Session introuvable"}
          </p>
          <p className="text-sm text-muted-foreground">
            Ce lien est invalide, expiré ou révoqué.
          </p>
        </div>
      </div>
    );
  }

  // Reconstruire les frames (approximation)
  const frames: PoseFrame[] = [];
  const frameCount = sessionData.metrics.angles.left_elbow.length;
  for (let i = 0; i < frameCount; i++) {
    frames.push({
      keypoints: {} as any,
      t: (i / frameCount) * sessionData.duration,
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">KOVA - Vue Coach</h1>
          <p className="text-sm text-muted-foreground">
            Vue en lecture seule
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  {sessionData.videoUrl ? (
                    <>
                      <video
                        ref={videoRef}
                        src={sessionData.videoUrl}
                        controls
                        className="w-full"
                      />
                      <SkeletonOverlay
                        video={videoRef.current}
                        frames={frames}
                        currentTime={videoRef.current?.currentTime || 0}
                      />
                    </>
                  ) : (
                    <div className="w-full h-64 flex items-center justify-center text-muted-foreground">
                      Vidéo non disponible
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <MetricsPanel metrics={sessionData.metrics} frames={frames} />
          </div>

          <div className="space-y-6">
            <HealthAlerts alerts={sessionData.alerts} />
          </div>
        </div>
      </main>
    </div>
  );
}

