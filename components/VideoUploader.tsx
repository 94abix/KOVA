"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface VideoUploaderProps {
  onVideoSelect: (file: File) => void;
  maxDuration?: number; // en secondes
}

export function VideoUploader({
  onVideoSelect,
  maxDuration = 15,
}: VideoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("video/")) {
      alert("Veuillez sélectionner un fichier vidéo");
      return;
    }

    // Vérifier la durée après chargement
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const duration = video.duration;
      if (duration > maxDuration) {
        alert(
          `La vidéo doit faire moins de ${maxDuration} secondes (actuellement ${duration.toFixed(1)}s)`
        );
        return;
      }
      onVideoSelect(file);
    };
    video.src = URL.createObjectURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
        isDragging
          ? "border-accent bg-accent/10"
          : "border-border bg-muted/30"
      }`}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
    >
      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-lg font-medium mb-2">
        Glisse une vidéo ici ou clique pour sélectionner
      </p>
      <p className="text-sm text-muted-foreground mb-4">
        Format MP4 ou WebM, max {maxDuration}s
      </p>
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
      >
        Sélectionner un fichier
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}

