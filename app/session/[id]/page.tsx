"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { SkeletonOverlay } from "@/components/SkeletonOverlay";
import { MetricsPanel } from "@/components/MetricsPanel";
import { HealthAlerts } from "@/components/HealthAlerts";
import { CoachShareDialog } from "@/components/CoachShareDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase";
import type { Metrics, PoseFrame } from "@/lib/pose/types";

type Session = Database["public"]["Tables"]["sessions"]["Row"];

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [coachToken, setCoachToken] = useState<string | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (params.id) {
      loadSession(params.id as string);
    }
  }, [params.id]);

  async function loadSession(id: string) {
    try {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setSession(data);
    } catch (err) {
      console.error("Erreur lors du chargement:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleGenerateCoachLink = async () => {
    if (!session) return;

    try {
      const res = await fetch("/api/coach-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id }),
      });
      const { token } = await res.json();
      setCoachToken(token);
    } catch (err) {
      console.error("Erreur lors de la génération du lien:", err);
      alert("Erreur lors de la génération du lien");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Session introuvable</p>
          <Button variant="outline" onClick={() => router.push("/sessions")}>
            Retour
          </Button>
        </div>
      </div>
    );
  }

  const metrics = session.metrics_json as Metrics;
  const alerts = session.alerts_json as Array<{
    level: "info" | "attention" | "risque";
    text: string;
    recommendation: string;
    frames?: number[];
  }>;
  // Reconstruire les frames depuis les métriques (approximation)
  const frames: PoseFrame[] = [];
  const frameCount = metrics.angles.left_elbow.length;
  for (let i = 0; i < frameCount; i++) {
    frames.push({
      keypoints: {} as any,
      t: (i / frameCount) * session.duration_s,
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">KOVA</h1>
          <Button variant="ghost" onClick={() => router.push("/sessions")}>
            Retour
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  {session.video_url ? (
                    <>
                      <video
                        ref={videoRef}
                        src={session.video_url}
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

