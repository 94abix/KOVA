"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MetricsPanel } from "@/components/MetricsPanel";
import { HealthAlerts } from "@/components/HealthAlerts";
import { CoachShareDialog } from "@/components/CoachShareDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateDemoFrames, generateDemoMetrics } from "@/lib/demo";
import { generateHealthAlerts } from "@/lib/pose/alerts";
import type { PoseFrame, Metrics } from "@/lib/pose/types";

export default function DemoPage() {
  const router = useRouter();
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
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [coachToken, setCoachToken] = useState<string | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  useEffect(() => {
    const checkVideo = async () => {
      try {
        // Priorité : Demo kova 2.mp4
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
    // Génère des données synthétiques pour les métriques
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

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleReset = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleGenerateCoachLink = async () => {
    try {
      // Générer un token pour la démonstration
      const token = `demo-token-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      setCoachToken(token);
    } catch (err) {
      console.error("Erreur lors de la génération du lien:", err);
      alert("Erreur lors de la génération du lien");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">KOVA - Mode Démonstration</h1>
            <p className="text-sm text-muted-foreground">
              Données synthétiques pour tester l&apos;interface
            </p>
          </div>
          <Button variant="ghost" onClick={() => router.push("/")}>
            Retour
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 space-y-2">
          <h2 className="text-3xl font-bold">🎬 Démonstration Interactive</h2>
          <p className="text-muted-foreground">
            Vidéo de démonstration avec analyse biomécanique
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vidéo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {videoUrl ? (
                  <>
                    <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                      <video
                        ref={videoRef}
                        src={videoUrl}
                        className="w-full h-full object-contain"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onEnded={() => setIsPlaying(false)}
                      />
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
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
                    <p className="text-muted-foreground">Chargement de la vidéo...</p>
                  </div>
                )}
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
                <CardTitle>Recommandations — prochaine séance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Cartes de recommandations */}
                <div className="space-y-4">
                  {/* Recommandation 1 */}
                  <div className="flex items-start gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="text-2xl">🏋️</div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Renforcer hanche droite</p>
                      <p className="text-sm text-muted-foreground">10 min (ponts + rotations)</p>
                      <p className="text-sm text-accent font-medium mt-1">3x/sem</p>
                    </div>
                  </div>

                  {/* Recommandation 2 */}
                  <div className="flex items-start gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="text-2xl">🥊</div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Corriger séquence jab-cross</p>
                      <p className="text-sm text-muted-foreground">Travail technique miroir</p>
                      <p className="text-sm text-accent font-medium mt-1">métrique vitesse</p>
                    </div>
                  </div>

                  {/* Recommandation 3 */}
                  <div className="flex items-start gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="text-2xl">🔄</div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Réduire volume tirages</p>
                      <p className="text-sm text-muted-foreground">-15% cette semaine</p>
                      <p className="text-sm text-accent font-medium mt-1">prévention fatigue</p>
                    </div>
                  </div>
                </div>

                {/* Plan de la prochaine séance */}
                <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-lg p-4">
                  <p className="font-semibold text-foreground mb-3">Plan de la prochaine séance</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-orange-200 dark:border-orange-900">
                      <span className="text-muted-foreground">Échauffement mobilité</span>
                      <span className="font-semibold">8 min</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-orange-200 dark:border-orange-900">
                      <span className="text-muted-foreground">Drills asymétrie</span>
                      <span className="font-semibold">12 min</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground">Sparring léger</span>
                      <span className="font-semibold">2×3 min</span>
                    </div>
                  </div>
                </div>

                {/* Bouton Exporter vers coach */}
                <Button
                  onClick={() => setShareDialogOpen(true)}
                  className="w-full bg-accent hover:bg-accent-light text-white py-3 px-6 rounded-lg font-medium text-base"
                >
                  Exporter vers coach
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <CoachShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        token={coachToken}
        onGenerateLink={handleGenerateCoachLink}
      />
    </div>
  );
}
