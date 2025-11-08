"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";

interface SessionCardProps {
  id: string;
  createdAt: string;
  duration: number;
  alertsCount: number;
  thumbnailUrl?: string | null;
}

export function SessionCard({
  id,
  createdAt,
  duration,
  alertsCount,
  thumbnailUrl,
}: SessionCardProps) {
  return (
    <Link href={`/session/${id}`}>
      <Card className="hover:border-accent transition-colors cursor-pointer">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">
              {format(new Date(createdAt), "d MMM yyyy, HH:mm", { locale: fr })}
            </CardTitle>
            <Badge variant={alertsCount === 0 ? "secondary" : "attention"}>
              {alertsCount} alerte{alertsCount > 1 ? "s" : ""}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt="Miniature"
              className="w-full h-32 object-cover rounded-lg mb-2"
            />
          ) : (
            <div className="w-full h-32 bg-muted rounded-lg mb-2 flex items-center justify-center text-muted-foreground">
              Pas de miniature
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            Durée: {duration.toFixed(1)}s
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

