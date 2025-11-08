"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SessionCard } from "@/components/SessionCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase";

type Session = Database["public"]["Tables"]["sessions"]["Row"];

export default function SessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
        return;
      }

      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (err) {
      console.error("Erreur lors du chargement des sessions:", err);
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">KOVA</h1>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => router.push("/")}>
              Accueil
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push("/analyze")}
            >
              Nouvelle analyse
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Mes sessions</h2>

        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Aucune session enregistrée
            </p>
            <Button
              onClick={() => router.push("/analyze")}
              className="bg-accent hover:bg-accent-light text-white"
            >
              Créer une analyse
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                id={session.id}
                createdAt={session.created_at}
                duration={session.duration_s}
                alertsCount={(session.alerts_json as any[]).length}
                thumbnailUrl={session.thumbnail_url}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

