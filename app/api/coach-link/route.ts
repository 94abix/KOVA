import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId requis" },
        { status: 400 }
      );
    }

    // Générer un token unique
    const token = randomBytes(32).toString("hex");

    // Date d'expiration: 14 jours
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14);

    const { data, error } = await supabase
      .from("coach_links")
      .insert({
        session_id: sessionId,
        token,
        expires_at: expiresAt.toISOString(),
        revoked: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur création lien coach:", error);
      return NextResponse.json(
        { error: "Erreur lors de la création du lien" },
        { status: 500 }
      );
    }

    return NextResponse.json({ token });
  } catch (err) {
    console.error("Erreur API coach-link:", err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

