"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, AlertCircle } from "lucide-react";

interface HealthAlertsProps {
  alerts: Array<{
    level: "info" | "attention" | "risque";
    text: string;
    recommendation: string;
    frames?: number[];
  }>;
}

export function HealthAlerts({ alerts }: HealthAlertsProps) {
  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alertes santé</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Aucune alerte détectée ✅</p>
        </CardContent>
      </Card>
    );
  }

  const getIcon = (level: string) => {
    switch (level) {
      case "risque":
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      case "attention":
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      default:
        return <Info className="h-5 w-5 text-blue-400" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertes santé</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert, idx) => (
          <div
            key={idx}
            className="border border-border rounded-lg p-4 space-y-2"
          >
            <div className="flex items-center gap-2">
              {getIcon(alert.level)}
              <Badge variant={alert.level}>{alert.level}</Badge>
              <span className="font-medium">{alert.text}</span>
            </div>
            <p className="text-sm text-muted-foreground ml-7">
              {alert.recommendation}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

