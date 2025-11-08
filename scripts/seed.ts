import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "Variables d'environnement manquantes: NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log("🌱 Démarrage du seed...");

  try {
    // Créer un utilisateur test (simulé)
    const testUserId = "test_user_" + Date.now();

    // Créer une session de démonstration avec métriques fictives réalistes
    const mockMetrics = {
      angles: {
        left_elbow: Array.from({ length: 100 }, () => 150 + Math.random() * 30),
        right_elbow: Array.from({ length: 100 }, () => 150 + Math.random() * 30),
        left_shoulder: Array.from({ length: 100 }, () => 170 + Math.random() * 10),
        right_shoulder: Array.from({ length: 100 }, () => 170 + Math.random() * 10),
        left_hip: Array.from({ length: 100 }, () => 175 + Math.random() * 5),
        right_hip: Array.from({ length: 100 }, () => 175 + Math.random() * 5),
        left_knee: Array.from({ length: 100 }, () => 155 + Math.random() * 25),
        right_knee: Array.from({ length: 100 }, () => 160 + Math.random() * 20),
        left_ankle: Array.from({ length: 100 }, () => 80 + Math.random() * 10),
        right_ankle: Array.from({ length: 100 }, () => 80 + Math.random() * 10),
      },
      angularVelocities: {
        left_elbow: Array.from({ length: 100 }, () => (Math.random() - 0.5) * 50),
        right_elbow: Array.from({ length: 100 }, () => (Math.random() - 0.5) * 50),
      },
      asymmetry: {
        elbow: 8.5,
        shoulder: 5.2,
        hip: 3.1,
        knee: 12.3,
        ankle: 7.8,
      },
      cadence: {
        value: 2.5,
        trend: -15.2,
      },
    };

    const mockAlerts = [
      {
        level: "attention" as const,
        text: "Alignement genou à surveiller",
        recommendation:
          "Surveille l'alignement lors des flexions. Pense à renforcer les muscles stabilisateurs du genou.",
        frames: [10, 11, 12, 45, 46, 47],
      },
      {
        level: "info" as const,
        text: "Diminution de cadence détectée",
        recommendation:
          "La cadence diminue en fin de séquence. Pense à ajuster l'intensité ou la durée.",
      },
    ];

    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .insert({
        user_id: testUserId,
        video_url: null, // À remplacer par une vraie URL si vidéo démo disponible
        thumbnail_url: null,
        duration_s: 10.0,
        metrics_json: mockMetrics,
        alerts_json: mockAlerts,
        report_version: "1.0.0",
      })
      .select()
      .single();

    if (sessionError) {
      console.error("Erreur lors de la création de la session:", sessionError);
      throw sessionError;
    }

    console.log("✅ Session de démonstration créée:", session.id);
    console.log("📊 Métriques:", JSON.stringify(mockMetrics, null, 2));
    console.log("⚠️  Alertes:", mockAlerts.length);

    // Créer un lien coach pour la session
    const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14);

    const { data: link, error: linkError } = await supabase
      .from("coach_links")
      .insert({
        session_id: session.id,
        token,
        expires_at: expiresAt.toISOString(),
        revoked: false,
      })
      .select()
      .single();

    if (linkError) {
      console.error("Erreur lors de la création du lien coach:", linkError);
    } else {
      console.log("🔗 Lien coach créé:", `${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('/rest/v1', '') || 'http://localhost:3000'}/coach/${token}`);
    }

    console.log("✨ Seed terminé avec succès!");
  } catch (err) {
    console.error("❌ Erreur lors du seed:", err);
    process.exit(1);
  }
}

seed();

