"use client";

import { useState, useRef, useEffect } from "react";
import { SkeletonOverlay } from "@/components/SkeletonOverlay";
import { MetricsPanel } from "@/components/MetricsPanel";
import { HealthAlerts } from "@/components/HealthAlerts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateDemoFrames, generateDemoMetrics } from "@/lib/demo";
import { generateHealthAlerts } from "@/lib/pose/alerts";
import type { PoseFrame, Metrics } from "@/lib/pose/types";

/**
 * Page de démonstration avec données synthétiques
 * Permet de tester l'application sans vidéo réelle ni Supabase
 */
export default function DemoPage() {
  const [frames, setFrames] = useState<PoseFrame[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [alerts, setAlerts] = useState<
    Array<{
      level: "info" | "attention" | "risque";
      text: string;
      recommendation: string;
      frames?: number[];
    }>
  >([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Charger la vidéo de démo si elle existe (même logique que MVP2.tsx)
  useEffect(() => {
    const checkVideo = async () => {
      try {
        // Priorité : Demo kova 2.mp4 (même que localhost)
        const priorityVideo = "/Demo kova 2.mp4";
        try {
          const response = await fetch(encodeURI(priorityVideo), { method: "HEAD" });
          if (response.ok) {
            setVideoUrl(priorityVideo);
            console.log("✅ Vidéo chargée:", priorityVideo);
            return;
          }
        } catch (e) {
          console.log("⚠️ Vidéo prioritaire non trouvée, recherche alternative...");
        }
        
        // Fallback : essaie de récupérer la liste des vidéos via l'API
        try {
          const apiResponse = await fetch("/api/videos");
          if (apiResponse.ok) {
            const data = await apiResponse.json();
            if (data.videos && data.videos.length > 0) {
              // Prend la première vidéo trouvée
              const videoName = data.videos[0];
              const videoPath = `/${videoName}`;
              setVideoUrl(videoPath);
              console.log("✅ Vidéo chargée depuis API:", videoPath);
              return;
            }
          }
        } catch (apiError) {
          console.log("API non disponible, recherche directe...");
        }
        
        // Fallback : essaie des noms de vidéos courants
        const videoPaths = [
          "/demo-video.mp4",
          "/video.mp4",
          "/demo.mp4",
        ];
        
        for (const videoPath of videoPaths) {
          try {
            const response = await fetch(encodeURI(videoPath), { method: "HEAD" });
            if (response.ok) {
              setVideoUrl(videoPath);
              console.log("✅ Vidéo chargée:", videoPath);
              return;
            }
          } catch (e) {
            continue;
          }
        }
        
        console.log("⚠️ Aucune vidéo trouvée");
      } catch (e) {
        console.log("⚠️ Erreur lors de la vérification de la vidéo");
      }
    };
    
    checkVideo();
  }, []);

  useEffect(() => {
    // Générer des données de démonstration
    const demoFrames = generateDemoFrames(10, 30);
    setFrames(demoFrames);

    const demoMetrics = generateDemoMetrics(demoFrames);
    setMetrics(demoMetrics);

    const demoAlerts = generateHealthAlerts(
      demoFrames,
      demoMetrics.asymmetry,
      demoMetrics.cadence.trend
    );
    setAlerts(demoAlerts);
  }, []);

  useEffect(() => {
    if (videoRef.current && videoUrl) {
      // Si vidéo réelle, utiliser les contrôles vidéo
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
      videoRef.current.currentTime = currentTime;
      return;
    }

    // Sinon, utiliser l'animation des frames synthétiques
    if (isPlaying && frames.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const duration = frames[frames.length - 1]?.t || 10;
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 0.033; // ~30 fps
        });
      }, 33);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, frames, videoUrl, currentTime]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const currentFrame = frames.find((f) => f.t >= currentTime) || frames[0];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">KOVA - Mode Démonstration</h1>
          <p className="text-sm text-muted-foreground">
            Données synthétiques pour tester l'interface
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 space-y-2">
          <h2 className="text-3xl font-bold">🎬 Démonstration Interactive</h2>
          <p className="text-muted-foreground">
            Cette page montre les fonctionnalités avec des données synthétiques.
            Pas besoin de vidéo réelle ni de Supabase configuré.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vidéo avec Overlay Squelette</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  {videoUrl ? (
                    <>
                      {/* Vidéo réelle */}
                      <video
                        ref={videoRef}
                        src={videoUrl}
                        className="w-full h-full object-contain"
                        onTimeUpdate={(e) => {
                          const video = e.target as HTMLVideoElement;
                          setCurrentTime(video.currentTime);
                        }}
                        onLoadedMetadata={(e) => {
                          const video = e.target as HTMLVideoElement;
                          // Générer les frames à partir de la vidéo si nécessaire
                          if (frames.length === 0) {
                            const demoFrames = generateDemoFrames(video.duration || 10, 30);
                            setFrames(demoFrames);
                            const demoMetrics = generateDemoMetrics(demoFrames);
                            setMetrics(demoMetrics);
                            const demoAlerts = generateHealthAlerts(
                              demoFrames,
                              demoMetrics.asymmetry,
                              demoMetrics.cadence.trend
                            );
                            setAlerts(demoAlerts);
                          }
                        }}
                      />
                      {frames.length > 0 && (
                        <SkeletonOverlay
                          video={videoRef.current}
                          frames={frames}
                          currentTime={currentTime}
                          showHeat={true}
                        />
                      )}
                    </>
                  ) : frames.length > 0 ? (
                    <>
                      {/* Données synthétiques uniquement */}
                      <SkeletonOverlay
                        video={null}
                        frames={frames}
                        currentTime={currentTime}
                        showHeat={true}
                      />
                      {/* Indicateur de coup */}
                      <div className="absolute top-4 left-4 z-20 bg-accent/90 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                        {(() => {
                          const loopDuration = 3.5;
                          const tInLoop = currentTime % loopDuration;
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
                          let current = punchSequence[punchSequence.length - 1];
                          for (const punch of punchSequence) {
                            if (tInLoop >= punch.start && tInLoop < punch.start + punch.duration) {
                              current = punch;
                              break;
                            }
                          }
                          if (current.type === "jab") return "🥊 Jab gauche";
                          if (current.type === "cross") return "💥 Cross droit";
                          if (current.type === "uppercut") return "⬆️ Uppercut gauche";
                          if (current.type === "hook") return "🌀 Hook droit";
                          return "🛡️ Garde";
                        })()}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">Chargement...</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 items-center">
                  <Button
                    onClick={handlePlayPause}
                    className="bg-accent hover:bg-accent-light text-white"
                  >
                    {isPlaying ? "⏸ Pause" : "▶ Play"}
                  </Button>
                  <Button onClick={handleReset} variant="outline">
                    🔄 Reset
                  </Button>
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max={
                        videoRef.current?.duration ||
                        (frames.length > 0 ? frames[frames.length - 1].t : 10)
                      }
                      value={currentTime}
                      onChange={(e) => {
                        const newTime = Number(e.target.value);
                        setCurrentTime(newTime);
                        if (videoRef.current) {
                          videoRef.current.currentTime = newTime;
                        }
                      }}
                      className="w-full"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {currentTime.toFixed(1)}s /{" "}
                    {videoRef.current?.duration?.toFixed(1) ||
                      (frames.length > 0 ? frames[frames.length - 1].t.toFixed(1) : "10.0")}
                    s
                  </span>
                </div>
              </CardContent>
            </Card>

            {metrics && (
              <MetricsPanel metrics={metrics} frames={frames} />
            )}
          </div>

          <div className="space-y-6">
            <HealthAlerts alerts={alerts} />

            <Card>
              <CardHeader>
                <CardTitle>📊 Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold">Frames:</span> {frames.length}
                </div>
                <div>
                  <span className="font-semibold">Durée:</span>{" "}
                  {frames.length > 0 ? frames[frames.length - 1].t.toFixed(1) : "0"}s
                </div>
                {metrics && (
                  <>
                    <div>
                      <span className="font-semibold">Cadence:</span>{" "}
                      {metrics.cadence.value.toFixed(2)} pics/s
                    </div>
                    <div>
                      <span className="font-semibold">Asymétrie max:</span>{" "}
                      {Math.max(
                        metrics.asymmetry.elbow,
                        metrics.asymmetry.shoulder,
                        metrics.asymmetry.hip,
                        metrics.asymmetry.knee,
                        metrics.asymmetry.ankle
                      ).toFixed(1)}
                      %
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ℹ️ Mode Démonstration</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Ces données sont générées synthétiquement pour tester
                  l'interface.
                </p>
                <p>
                  Pour une analyse réelle, utilisez la page{" "}
                  <a href="/analyze" className="text-accent hover:underline">
                    /analyze
                  </a>
                  .
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

