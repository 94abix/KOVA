import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Configuration Supabase manquante" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { videoUrl, duration, metrics, alerts } = body;

    // Vérifier l'authentification (simplifié - en prod, utiliser un vrai token)
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      // Pour le MVP, on accepte sans auth stricte (à sécuriser en prod)
      console.warn("Session créée sans auth - à sécuriser");
    }

    // Récupérer l'utilisateur actuel (via Supabase client-side normalement)
    // Pour le MVP, on génère un ID temporaire
    const userId = "temp_user_" + Date.now();

    const { data, error } = await supabase
      .from("sessions")
      .insert({
        user_id: userId,
        video_url: videoUrl,
        duration_s: duration,
        metrics_json: metrics,
        alerts_json: alerts,
        report_version: "1.0.0",
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur création session:", error);
      return NextResponse.json(
        { error: "Erreur lors de la création de la session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error("Erreur API sessions:", err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

