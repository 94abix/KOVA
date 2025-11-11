import React from "react";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import type { Metrics } from "@/lib/pose/types";

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottom: "2 solid #C01C27",
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#C01C27",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: "#666",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    paddingVertical: 3,
  },
  metricLabel: {
    color: "#666",
  },
  metricValue: {
    fontWeight: "bold",
    color: "#000",
  },
  alertBox: {
    backgroundColor: "#FFF3CD",
    border: "1 solid #FFC107",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  alertTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#856404",
  },
  alertText: {
    fontSize: 9,
    color: "#856404",
    marginBottom: 3,
  },
  recommendationBox: {
    border: "1 solid #E0E0E0",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  recommendationTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 9,
    color: "#666",
    marginBottom: 2,
  },
  planBox: {
    backgroundColor: "#FFF4E6",
    border: "1 solid #FF9800",
    padding: 10,
    borderRadius: 4,
    marginTop: 10,
  },
  planTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#E65100",
  },
  planRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    paddingVertical: 2,
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTop: "1 solid #E0E0E0",
    fontSize: 8,
    color: "#999",
    textAlign: "center",
  },
});

interface CoachReportPDFProps {
  metrics: Metrics;
  alerts: Array<{
    level: "info" | "attention" | "risque";
    text: string;
    recommendation: string;
  }>;
  duration: number;
  framesCount: number;
}

export function CoachReportPDF({
  metrics,
  alerts,
  duration,
  framesCount,
}: CoachReportPDFProps) {
  const maxAsymmetry = Math.max(
    metrics.asymmetry.elbow,
    metrics.asymmetry.shoulder,
    metrics.asymmetry.hip,
    metrics.asymmetry.knee,
    metrics.asymmetry.ankle
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>KOVA - Rapport d'Analyse</Text>
          <Text style={styles.subtitle}>
            Rapport généré le {new Date().toLocaleDateString("fr-FR")}
          </Text>
        </View>

        {/* Métriques principales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Métriques Clés</Text>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Durée d'analyse:</Text>
            <Text style={styles.metricValue}>{duration.toFixed(1)}s</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Cadence:</Text>
            <Text style={styles.metricValue}>
              {metrics.cadence.value.toFixed(2)} pics/s
            </Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Asymétrie maximale:</Text>
            <Text style={styles.metricValue}>{maxAsymmetry.toFixed(1)}%</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Frames analysées:</Text>
            <Text style={styles.metricValue}>{framesCount}</Text>
          </View>
        </View>

        {/* Détails d'asymétrie */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚖️ Détails Asymétrie</Text>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Épaule:</Text>
            <Text style={styles.metricValue}>
              {metrics.asymmetry.shoulder.toFixed(1)}%
            </Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Coude:</Text>
            <Text style={styles.metricValue}>
              {metrics.asymmetry.elbow.toFixed(1)}%
            </Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Hanche:</Text>
            <Text style={styles.metricValue}>
              {metrics.asymmetry.hip.toFixed(1)}%
            </Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Genou:</Text>
            <Text style={styles.metricValue}>
              {metrics.asymmetry.knee.toFixed(1)}%
            </Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Cheville:</Text>
            <Text style={styles.metricValue}>
              {metrics.asymmetry.ankle.toFixed(1)}%
            </Text>
          </View>
        </View>

        {/* Alertes santé */}
        {alerts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚠️ Alertes Santé</Text>
            {alerts.map((alert, index) => (
              <View key={index} style={styles.alertBox}>
                <Text style={styles.alertTitle}>
                  {alert.level === "risque"
                    ? "🔴 Risque"
                    : alert.level === "attention"
                    ? "🟡 Attention"
                    : "ℹ️ Info"}
                </Text>
                <Text style={styles.alertText}>{alert.text}</Text>
                <Text style={styles.alertText}>
                  💡 {alert.recommendation}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Recommandations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💪 Recommandations</Text>
          
          <View style={styles.recommendationBox}>
            <Text style={styles.recommendationTitle}>🏋️ Renforcer hanche droite</Text>
            <Text style={styles.recommendationText}>10 min (ponts + rotations)</Text>
            <Text style={styles.recommendationText}>Fréquence: 3x/semaine</Text>
          </View>

          <View style={styles.recommendationBox}>
            <Text style={styles.recommendationTitle}>🥊 Corriger séquence jab-cross</Text>
            <Text style={styles.recommendationText}>Travail technique miroir</Text>
            <Text style={styles.recommendationText}>Focus: métrique vitesse</Text>
          </View>

          <View style={styles.recommendationBox}>
            <Text style={styles.recommendationTitle}>🔄 Réduire volume tirages</Text>
            <Text style={styles.recommendationText}>-15% cette semaine</Text>
            <Text style={styles.recommendationText}>Objectif: prévention fatigue</Text>
          </View>
        </View>

        {/* Plan prochaine séance */}
        <View style={styles.planBox}>
          <Text style={styles.planTitle}>📅 Plan Prochaine Séance</Text>
          <View style={styles.planRow}>
            <Text>Échauffement mobilité</Text>
            <Text style={styles.metricValue}>8 min</Text>
          </View>
          <View style={styles.planRow}>
            <Text>Drills asymétrie</Text>
            <Text style={styles.metricValue}>12 min</Text>
          </View>
          <View style={styles.planRow}>
            <Text>Sparring léger</Text>
            <Text style={styles.metricValue}>2×3 min</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>KOVA - Analyse biomécanique pour sports de combat</Text>
          <Text>Rapport généré automatiquement</Text>
        </View>
      </Page>
    </Document>
  );
}

// Fonction utilitaire pour générer et télécharger le PDF
export async function generateCoachPDF(
  metrics: Metrics,
  alerts: Array<{
    level: "info" | "attention" | "risque";
    text: string;
    recommendation: string;
  }>,
  duration: number,
  framesCount: number
): Promise<void> {
  const doc = (
    <CoachReportPDF
      metrics={metrics}
      alerts={alerts}
      duration={duration}
      framesCount={framesCount}
    />
  );

  const blob = await pdf(doc).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `KOVA-Rapport-${new Date().toISOString().split("T")[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

