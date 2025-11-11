"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { VideoUploader } from "@/components/VideoUploader";
import { VideoRecorder } from "@/components/VideoRecorder";
import { SkeletonOverlay } from "@/components/SkeletonOverlay";
import { MetricsPanel } from "@/components/MetricsPanel";
import { HealthAlerts } from "@/components/HealthAlerts";
import { CoachShareDialog } from "@/components/CoachShareDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { generateDemoFrames, generateDemoMetrics } from "@/lib/demo";
import { generateHealthAlerts } from "@/lib/pose/alerts";
import type { PoseFrame, Metrics } from "@/lib/pose/types";

type Step = "upload" | "preview" | "analyze" | "results";

export default function AnalyzePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("upload");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
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
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [coachToken, setCoachToken] = useState<string | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [videoMetadata, setVideoMetadata] = useState<{
    duration: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    return () => {
      if (videoUrl && videoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  // Forcer le chargement de la vidéo quand elle est disponible
  useEffect(() => {
    if (videoRef.current && videoUrl && step === "preview") {
      videoRef.current.load();
    }
  }, [videoUrl, step]);

  const handleVideoSelect = (file: File) => {
    try {
      console.log("📹 Fichier sélectionné:", file.name, file.type, file.size);
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      console.log("✅ Blob URL créée:", url);
      setVideoUrl(url);
      setStep("preview");
      setVideoMetadata(null);
      
      // Charger les métadonnées de la vidéo
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        console.log("✅ Métadonnées chargées:", {
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
        });
        setVideoMetadata({
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
        });
        URL.revokeObjectURL(video.src);
      };
      video.onerror = (e) => {
        console.error("❌ Erreur lors du chargement des métadonnées:", e);
      };
      video.src = url;
    } catch (error) {
      console.error("❌ Erreur lors de la sélection de la vidéo:", error);
      alert("Erreur lors de la sélection de la vidéo");
    }
  };

  const handleRecordingComplete = (blob: Blob) => {
    const file = new File([blob], "recording.webm", { type: "video/webm" });
    handleVideoSelect(file);
  };

  const handleAnalysisComplete = async (
    analyzedFrames: PoseFrame[],
    analyzedMetrics: Metrics,
    analyzedAlerts: Array<{
      level: "info" | "attention" | "risque";
      text: string;
      recommendation: string;
      frames?: number[];
    }>
  ) => {
    setFrames(analyzedFrames);
    setMetrics(analyzedMetrics);
    setAlerts(analyzedAlerts);
    setStep("results");

    // Sauvegarder la session
    if (videoFile && videoRef.current) {
      try {
        const formData = new FormData();
        formData.append("video", videoFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const { videoUrl: uploadedUrl } = await uploadRes.json();

        const sessionRes = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            videoUrl: uploadedUrl,
            duration: videoRef.current.duration,
            metrics: analyzedMetrics,
            alerts: analyzedAlerts,
          }),
        });
        const { id } = await sessionRes.json();
        setSessionId(id);
      } catch (err) {
        console.error("Erreur lors de la sauvegarde:", err);
      }
    }
  };

  const handleGenerateCoachLink = async () => {
    if (!sessionId) return;

    try {
      const res = await fetch("/api/coach-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const { token } = await res.json();
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
          <h1 className="text-2xl font-bold">KOVA</h1>
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
          >
            Accueil
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {step === "upload" && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">
                Analyser une vidéo
              </h2>
              <p className="text-muted-foreground">
                Uploade ou filme une séquence de mouvement (max 15s)
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Upload vidéo</h3>
                  <VideoUploader onVideoSelect={handleVideoSelect} />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Filmer</h3>
                  <VideoRecorder onRecordingComplete={handleRecordingComplete} />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {step === "preview" && videoUrl && videoFile && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Aperçu vidéo */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Aperçu</h2>
              <div className="relative w-full bg-black rounded-lg overflow-hidden">
                {videoUrl ? (
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    controls
                    preload="auto"
                    playsInline
                    muted={false}
                    className="w-full h-auto rounded-lg"
                    style={{ 
                      display: 'block',
                      width: '100%',
                      height: 'auto',
                      backgroundColor: 'black'
                    }}
                    onLoadedMetadata={() => {
                      console.log("✅ Vidéo metadata chargée dans le player");
                      if (videoRef.current) {
                        setVideoMetadata({
                          duration: videoRef.current.duration,
                          width: videoRef.current.videoWidth,
                          height: videoRef.current.videoHeight,
                        });
                      }
                    }}
                    onCanPlay={() => {
                      console.log("✅ Vidéo prête à être lue");
                    }}
                    onError={(e) => {
                      console.error("❌ Erreur vidéo dans le player:", e);
                      console.error("❌ Video src:", videoUrl);
                      console.error("❌ Video element:", videoRef.current);
                    }}
                    onLoadStart={() => {
                      console.log("🔄 Début du chargement de la vidéo");
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 text-white">
                    Chargement de la vidéo...
                  </div>
                )}
              </div>
            </div>

            {/* Bouton Retour */}
            <div className="flex justify-start">
              <Button
                variant="outline"
                onClick={() => {
                  setStep("upload");
                  if (videoUrl) URL.revokeObjectURL(videoUrl);
                  setVideoUrl(null);
                  setVideoFile(null);
                  setVideoMetadata(null);
                }}
              >
                Retour
              </Button>
            </div>
          </div>
        )}

        {step === "results" && metrics && videoUrl && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="relative w-full max-w-3xl bg-black rounded-lg overflow-hidden">
                    {videoUrl ? (
                      <>
                        <video
                          ref={videoRef}
                          src={videoUrl}
                          controls
                          preload="auto"
                          playsInline
                          className="w-full h-auto rounded-lg"
                          style={{ 
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            backgroundColor: 'black',
                            position: 'relative',
                            zIndex: 1
                          }}
                          onTimeUpdate={(e) => {
                            // Le SkeletonOverlay écoute le currentTime
                          }}
                          onError={(e) => {
                            console.error("❌ Erreur vidéo dans results:", e);
                          }}
                        />
                        {/* Skeleton overlay uniquement si frames disponibles et ne masque pas la vidéo */}
                        {frames.length > 0 && videoRef.current && (
                          <SkeletonOverlay
                            video={videoRef.current}
                            frames={frames}
                            currentTime={videoRef.current?.currentTime || 0}
                          />
                        )}
                      </>
                    ) : (
                      <div className="text-white p-8">Vidéo non disponible</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <MetricsPanel metrics={metrics} frames={frames} />
            </div>

            <div className="space-y-6">
              <HealthAlerts alerts={alerts} />

              <Card>
                <CardContent className="p-6 space-y-4">
                  <Button
                    onClick={() => setShareDialogOpen(true)}
                    className="w-full bg-accent hover:bg-accent-light text-white"
                  >
                    Partager au coach
                  </Button>
                  {sessionId && (
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/session/${sessionId}`)}
                      className="w-full"
                    >
                      Voir la session
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
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


