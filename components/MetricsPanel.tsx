"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Metrics } from "@/lib/pose/types";

interface MetricsPanelProps {
  metrics: Metrics;
  frames: Array<{ t: number }>;
}

export function MetricsPanel({ metrics, frames }: MetricsPanelProps) {
  const [activeTab, setActiveTab] = useState("angles");
  const timeData = frames.map((f, i) => ({
    time: f.t.toFixed(1),
    leftElbow: metrics.angles.left_elbow[i] || 0,
    rightElbow: metrics.angles.right_elbow[i] || 0,
    leftKnee: metrics.angles.left_knee[i] || 0,
    rightKnee: metrics.angles.right_knee[i] || 0,
  }));

  const asymmetryData = [
    { segment: "Coude", value: metrics.asymmetry.elbow },
    { segment: "Épaule", value: metrics.asymmetry.shoulder },
    { segment: "Hanche", value: metrics.asymmetry.hip },
    { segment: "Genou", value: metrics.asymmetry.knee },
    { segment: "Cheville", value: metrics.asymmetry.ankle },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Métriques</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="angles">Angles</TabsTrigger>
            <TabsTrigger value="asymmetry">Asymétrie</TabsTrigger>
            <TabsTrigger value="cadence">Cadence</TabsTrigger>
            <TabsTrigger value="summary">Résumé</TabsTrigger>
          </TabsList>

          <TabsContent value="angles" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="time" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #444" }} />
                <Line
                  type="monotone"
                  dataKey="leftElbow"
                  stroke="#C01C27"
                  name="Coude G"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="rightElbow"
                  stroke="#E63946"
                  name="Coude D"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="leftKnee"
                  stroke="#4CAF50"
                  name="Genou G"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="rightKnee"
                  stroke="#81C784"
                  name="Genou D"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="asymmetry" className="mt-4">
            <div className="space-y-6">
              {/* Titre et dominance */}
              <div>
                <h3 className="text-xl font-bold mb-2">Analyse technique — Asymétrie</h3>
                {(() => {
                  // Calculer la dominance des bras
                  const leftArmAvg = metrics.angles.left_elbow.reduce((a, b) => a + b, 0) / metrics.angles.left_elbow.length;
                  const rightArmAvg = metrics.angles.right_elbow.reduce((a, b) => a + b, 0) / metrics.angles.right_elbow.length;
                  const totalArm = leftArmAvg + rightArmAvg;
                  const rightArmPercent = totalArm > 0 ? (rightArmAvg / totalArm) * 100 : 50;
                  const leftArmPercent = totalArm > 0 ? (leftArmAvg / totalArm) * 100 : 50;
                  const dominantSide = rightArmPercent > leftArmPercent ? "droit" : "gauche";
                  const dominantPercent = Math.max(rightArmPercent, leftArmPercent);

                  return (
                    <p className="text-sm text-muted-foreground">
                      Dominance bras {dominantSide} : {dominantPercent.toFixed(0)}%
                    </p>
                  );
                })()}
              </div>

              {/* Barres de performance */}
              <div className="space-y-4">
                {(() => {
                  // Calculer les pourcentages pour bras
                  const leftArmAvg = metrics.angles.left_elbow.reduce((a, b) => a + b, 0) / metrics.angles.left_elbow.length;
                  const rightArmAvg = metrics.angles.right_elbow.reduce((a, b) => a + b, 0) / metrics.angles.right_elbow.length;
                  const totalArm = leftArmAvg + rightArmAvg;
                  const rightArmPercent = totalArm > 0 ? (rightArmAvg / totalArm) * 100 : 50;
                  const leftArmPercent = totalArm > 0 ? (leftArmAvg / totalArm) * 100 : 50;

                  // Calculer les pourcentages pour jambes
                  const leftLegAvg = metrics.angles.left_knee.reduce((a, b) => a + b, 0) / metrics.angles.left_knee.length;
                  const rightLegAvg = metrics.angles.right_knee.reduce((a, b) => a + b, 0) / metrics.angles.right_knee.length;
                  const totalLeg = leftLegAvg + rightLegAvg;
                  const rightLegPercent = totalLeg > 0 ? (rightLegAvg / totalLeg) * 100 : 50;
                  const leftLegPercent = totalLeg > 0 ? (leftLegAvg / totalLeg) * 100 : 50;

                  return (
                    <>
                      {/* Bras D */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Bras D</span>
                          <span className={`font-semibold ${rightArmPercent > leftArmPercent ? "text-orange-500" : "text-gray-400"}`}>
                            {rightArmPercent.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                          <div
                            className={`h-4 rounded-full ${rightArmPercent > leftArmPercent ? "bg-orange-500" : "bg-gray-400"}`}
                            style={{ width: `${rightArmPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Bras G */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Bras G</span>
                          <span className={`font-semibold ${leftArmPercent > rightArmPercent ? "text-orange-500" : "text-gray-400"}`}>
                            {leftArmPercent.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                          <div
                            className={`h-4 rounded-full ${leftArmPercent > rightArmPercent ? "bg-orange-500" : "bg-gray-400"}`}
                            style={{ width: `${leftArmPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Séparateur */}
                      <div className="border-t border-border my-2" />

                      {/* Jambe D */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Jambe D</span>
                          <span className={`font-semibold ${rightLegPercent > leftLegPercent ? "text-orange-500" : "text-gray-400"}`}>
                            {rightLegPercent.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                          <div
                            className={`h-4 rounded-full ${rightLegPercent > leftLegPercent ? "bg-orange-500" : "bg-gray-400"}`}
                            style={{ width: `${rightLegPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Jambe G */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Jambe G</span>
                          <span className={`font-semibold ${leftLegPercent > rightLegPercent ? "text-orange-500" : "text-gray-400"}`}>
                            {leftLegPercent.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                          <div
                            className={`h-4 rounded-full ${leftLegPercent > rightLegPercent ? "bg-orange-500" : "bg-gray-400"}`}
                            style={{ width: `${leftLegPercent}%` }}
                          />
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Section Angle */}
              <div className="border-t border-border pt-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm text-muted-foreground">
                    Angle hanche droite (moy.)
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {Math.round(
                        metrics.angles.right_hip.reduce((a, b) => a + b, 0) /
                          metrics.angles.right_hip.length
                      )}
                      °
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground text-right">
                    Plage :{" "}
                    {Math.min(...metrics.angles.right_hip).toFixed(0)}-
                    {Math.max(...metrics.angles.right_hip).toFixed(0)}°
                  </div>
                </div>
              </div>

              {/* Section Alerte */}
              {(() => {
                const maxAsymmetry = Math.max(
                  metrics.asymmetry.elbow,
                  metrics.asymmetry.shoulder,
                  metrics.asymmetry.hip,
                  metrics.asymmetry.knee,
                  metrics.asymmetry.ankle
                );

                if (maxAsymmetry > 15) {
                  const leftArmAvg = metrics.angles.left_elbow.reduce((a, b) => a + b, 0) / metrics.angles.left_elbow.length;
                  const rightArmAvg = metrics.angles.right_elbow.reduce((a, b) => a + b, 0) / metrics.angles.right_elbow.length;
                  const dominantSide = rightArmAvg > leftArmAvg ? "droit" : "gauche";

                  return (
                    <div className="border-t border-border pt-4">
                      <h4 className="text-orange-500 font-semibold mb-2">ALERTE</h4>
                      <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-lg p-4 space-y-2">
                        <div>
                          <span className="font-semibold">Asymétrie :</span>{" "}
                          <span>détectée côté {dominantSide} sur les phases offensives.</span>
                        </div>
                        <div>
                          <span className="font-semibold">Impact potentiel :</span>{" "}
                          <span>perte d'efficacité + risque lombaire.</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </TabsContent>

          <TabsContent value="cadence" className="mt-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Cadence</p>
                <p className="text-2xl font-bold">{metrics.cadence.value.toFixed(2)} pics/s</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tendance</p>
                <p className={`text-xl font-semibold ${metrics.cadence.trend < 0 ? "text-yellow-400" : "text-green-400"}`}>
                  {metrics.cadence.trend > 0 ? "+" : ""}
                  {metrics.cadence.trend.toFixed(1)}%
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="summary" className="mt-4">
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">Angles moyens</p>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p>Coude G: {metrics.angles.left_elbow.reduce((a, b) => a + b, 0) / metrics.angles.left_elbow.length || 0}</p>
                    <p>Coude D: {metrics.angles.right_elbow.reduce((a, b) => a + b, 0) / metrics.angles.right_elbow.length || 0}</p>
                  </div>
                  <div>
                    <p>Genou G: {metrics.angles.left_knee.reduce((a, b) => a + b, 0) / metrics.angles.left_knee.length || 0}</p>
                    <p>Genou D: {metrics.angles.right_knee.reduce((a, b) => a + b, 0) / metrics.angles.right_knee.length || 0}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">Asymétrie maximale</p>
                <p className="font-semibold">
                  {Math.max(
                    metrics.asymmetry.elbow,
                    metrics.asymmetry.shoulder,
                    metrics.asymmetry.hip,
                    metrics.asymmetry.knee,
                    metrics.asymmetry.ankle
                  ).toFixed(1)}%
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

