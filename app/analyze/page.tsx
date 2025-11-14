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

// Style CSS pour garantir la transparence des overlays
const overlayStyles = `
  /* Forcer la transparence de tout overlay Dialog qui pourrait masquer la vidéo */
  [data-radix-dialog-overlay] {
    background: transparent !important;
  }
  
  /* S'assurer que le canvas est transparent */
  #pose-canvas {
    background: transparent !important;
    pointer-events: none !important;
  }
  
  /* Aucun overlay plein écran opaque ne doit masquer la vidéo */
  .video-container > *:not(video) {
    pointer-events: none !important;
  }
`;

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
  const [videoError, setVideoError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (videoUrl && videoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  // Forcer le chargement de la vidéo quand elle est disponible
  useEffect(() => {
    if (videoRef.current && videoUrl && (step === "preview" || step === "results")) {
      try {
        videoRef.current.load();
        console.log(`✅ Vidéo chargée dans le player (step: ${step})`);
      } catch (error) {
        console.error("❌ Erreur lors du chargement de la vidéo:", error);
      }
    }
  }, [videoUrl, step]);

  const handleVideoSelect = (file: File) => {
    try {
      console.log("📹 Fichier sélectionné:", file.name, file.type, file.size);
      setVideoFile(file);
      setVideoError(null);
      setVideoMetadata(null);
      
      // Essayer d'abord avec URL.createObjectURL
      try {
        const url = URL.createObjectURL(file);
        console.log("✅ Blob URL créée:", url);
        setVideoUrl(url);
        setStep("preview");
        
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
      } catch (createObjectURLError) {
        console.error("❌ Erreur createObjectURL :", createObjectURLError);
        // Fallback avec FileReader
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          console.log("✅ DataURL créée via FileReader");
          setVideoUrl(dataUrl);
          setStep("preview");
        };
        reader.onerror = () => {
          console.error("❌ Erreur FileReader");
          setVideoError("Impossible de lire cette vidéo.");
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error("❌ Erreur lors de la sélection de la vidéo:", error);
      setVideoError("Erreur lors de la sélection de la vidéo");
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

  // Injecter les styles CSS pour garantir la transparence
  useEffect(() => {
    const styleId = 'video-overlay-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = overlayStyles;
      document.head.appendChild(style);
    }
    return () => {
      const style = document.getElementById(styleId);
      if (style) {
        style.remove();
      }
    };
  }, []);

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
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Aperçu */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Aperçu</h2>
              {videoError && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
                  <p className="text-red-600 dark:text-red-400">{videoError}</p>
                </div>
              )}
              <div className="relative w-full max-w-3xl bg-black rounded-lg overflow-hidden">
                {videoUrl ? (
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-auto bg-black"
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
                      setVideoError(null);
                    }}
                    onError={(e) => {
                      const error = e.currentTarget.error;
                      console.error("❌ Erreur de lecture vidéo :", error);
                      if (error) {
                        let errorMessage = "Format vidéo non pris en charge";
                        if (error.code === error.MEDIA_ERR_SRC_NOT_SUPPORTED) {
                          errorMessage = "Format vidéo non pris en charge (essayez MP4 H.264)";
                        } else if (error.code === error.MEDIA_ERR_DECODE) {
                          errorMessage = "Erreur de décodage vidéo";
                        } else if (error.code === error.MEDIA_ERR_NETWORK) {
                          errorMessage = "Erreur réseau lors du chargement";
                        }
                        setVideoError(errorMessage);
                      }
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 text-white">
                    Chargement de la vidéo...
                  </div>
                )}
              </div>
            </div>

            {/* Analyse de la vidéo */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">📊</div>
                  <h2 className="text-2xl font-bold">Analyse de la vidéo</h2>
                </div>
                <Button
                  onClick={async () => {
                    if (!videoRef.current) return;
                    
                    // Simuler une analyse avec données de démonstration
                    const duration = videoMetadata?.duration || videoRef.current.duration || 10;
                    const fps = 30;
                    
                    // Générer des frames de démonstration
                    const demoFrames = generateDemoFrames(duration, fps);
                    const demoMetrics = generateDemoMetrics(demoFrames);
                    const demoAlerts = generateHealthAlerts(
                      demoFrames,
                      demoMetrics.asymmetry,
                      demoMetrics.cadence.trend
                    );
                    
                    // Appeler le callback avec les données de démonstration
                    handleAnalysisComplete(demoFrames, demoMetrics, demoAlerts);
                  }}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  Prêt pour l&apos;analyse
                </Button>
              </div>

              {/* Informations vidéo */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Durée</p>
                  <p className="text-xl font-semibold">
                    {videoMetadata
                      ? `${videoMetadata.duration.toFixed(1)}s`
                      : "Calcul..."}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Taille du fichier</p>
                  <p className="text-xl font-semibold">
                    {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Qualité estimée</p>
                  <p className="text-xl font-semibold">
                    {videoMetadata
                      ? `${videoMetadata.width}x${videoMetadata.height}` : "Calcul..."}
                    {videoMetadata && videoMetadata.width >= 1920 && (
                      <span className="ml-2 text-green-500 text-sm">HD</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Recommandations */}
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-green-600 dark:text-green-400">✅</span>
                  <h3 className="font-semibold">Recommandations pour une meilleure analyse</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span>Assure-toi que le combattant est bien visible et centré dans la vidéo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span>La vidéo doit être filmée de profil ou de 3/4 pour une meilleure détection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span>Éclairage uniforme recommandé pour détecter toutes les articulations</span>
                  </li>
                </ul>
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
          </div>
        )}

        {step === "results" && metrics && videoUrl && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="relative w-full max-w-3xl bg-black rounded-lg overflow-hidden video-container">
                    {videoUrl ? (
                      <div className="relative">
                        {/* Vidéo - z-0 : toujours visible en arrière-plan */}
                        <video
                          ref={videoRef}
                          src={videoUrl}
                          controls
                          playsInline
                          preload="auto"
                          className="relative z-0 w-full h-auto bg-black"
                          style={{
                            display: 'block',
                            width: '100%',
                            height: 'auto',
                            minHeight: '300px',
                            backgroundColor: 'black',
                            position: 'relative',
                            zIndex: 0
                          }}
                          onLoadedMetadata={() => {
                            console.log("✅ Vidéo metadata chargée dans results");
                            console.log("Video URL:", videoUrl);
                            console.log("Video src:", videoRef.current?.src);
                            if (videoRef.current) {
                              videoRef.current.style.display = 'block';
                              // Forcer la lecture si nécessaire
                              videoRef.current.load();
                            }
                          }}
                          onCanPlay={() => {
                            console.log("✅ Vidéo prête à être lue dans results");
                            if (videoRef.current) {
                              videoRef.current.style.display = 'block';
                              console.log("Video dimensions:", videoRef.current.videoWidth, "x", videoRef.current.videoHeight);
                            }
                          }}
                          onLoadStart={() => {
                            console.log("🔄 Début du chargement de la vidéo dans results");
                          }}
                          onError={(e) => {
                            const error = e.currentTarget.error;
                            console.error("❌ Erreur vidéo dans results:", error);
                            console.error("Video URL:", videoUrl);
                            console.error("Video src:", videoRef.current?.src);
                            if (error) {
                              console.error("Code d'erreur:", error.code);
                              console.error("Message:", error.message);
                            }
                          }}
                        />
                        {/* Canvas squelette - z-10 : transparent, pointer-events-none */}
                        {frames.length > 0 && videoRef.current && (
                          <canvas
                            id="pose-canvas"
                            className="pointer-events-none absolute inset-0 z-10"
                            style={{
                              background: "transparent",
                              pointerEvents: "none",
                              zIndex: 10,
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%"
                            }}
                          />
                        )}
                        {/* Feedback visuel - z-20 : petit badge non plein écran, pointer-events-none */}
                        {/* Aucun overlay plein écran opaque ici */}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64 text-white">
                        <p>Vidéo non disponible</p>
                        <p className="text-sm text-gray-400 mt-2">videoUrl: {videoUrl ? "présent" : "null"}</p>
                      </div>
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


