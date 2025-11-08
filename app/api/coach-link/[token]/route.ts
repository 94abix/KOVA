import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    // Récupérer le lien coach
    const { data: link, error: linkError } = await supabase
      .from("coach_links")
      .select("*")
      .eq("token", token)
      .single();

    if (linkError || !link) {
      return NextResponse.json(
        { error: "Lien introuvable" },
        { status: 404 }
      );
    }

    // Vérifier expiration et révocation
    const expiresAt = new Date(link.expires_at);
    if (expiresAt < new Date() || link.revoked) {
      return NextResponse.json(
        { error: "Lien expiré ou révoqué" },
        { status: 403 }
      );
    }

    // Récupérer la session associée
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("*")
      .eq("id", link.session_id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Session introuvable" },
        { status: 404 }
      );
    }

    // Retourner les données en lecture seule
    return NextResponse.json({
      videoUrl: session.video_url,
      duration: session.duration_s,
      metrics: session.metrics_json,
      alerts: session.alerts_json,
    });
  } catch (err) {
    console.error("Erreur API coach-link GET:", err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

