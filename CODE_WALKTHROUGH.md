# 🔍 Parcours du Code KOVA

## 📚 Guide de Lecture du Code

Ce document explique comment le code fonctionne, section par section.

---

## 🎯 1. Point d'Entrée : App Router Next.js

### `app/layout.tsx`
**Rôle :** Layout racine avec métadonnées et styles globaux

```tsx
export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="dark">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
```

**Points clés :**
- Force le dark mode (`className="dark"`)
- Charge les styles globaux (`globals.css`)
- Métadonnées SEO

---

## 🏠 2. Page d'Accueil

### `app/page.tsx`

**Structure simple :**
```tsx
<header>KOVA</header>
<main>
  <h2>Transforme chaque mouvement en progrès.</h2>
  <Button href="/analyze">Analyser une vidéo</Button>
  <Button href="/demo">🎬 Voir la démonstration</Button>
</main>
```

**Navigation :**
- `/analyze` → Flux d'analyse complet
- `/demo` → Démonstration avec données mock

---

## 🎬 3. Page Analyse (`app/analyze/page.tsx`)

### État du Composant

```tsx
const [step, setStep] = useState<"upload" | "preview" | "analyze" | "results">("upload");
const [videoFile, setVideoFile] = useState<File | null>(null);
const [frames, setFrames] = useState<PoseFrame[]>([]);
const [metrics, setMetrics] = useState<Metrics | null>(null);
const [alerts, setAlerts] = useState<Alert[]>([]);
```

**Flux en 4 étapes :**

#### Step 1: Upload/Capture
```tsx
{step === "upload" && (
  <VideoUploader onVideoSelect={handleVideoSelect} />
  <VideoRecorder onRecordingComplete={handleRecordingComplete} />
)}
```

#### Step 2: Preview
```tsx
{step === "preview" && (
  <video src={videoUrl} controls />
  <PoseAnalyzer video={videoRef.current} onAnalysisComplete={...} />
)}
```

#### Step 3: Analyse
- Appel `PoseAnalyzer` → `usePoseModel` → Analyse MoveNet
- Callback `onAnalysisComplete` reçoit frames + metrics + alerts

#### Step 4: Résultats
```tsx
{step === "results" && (
  <SkeletonOverlay video={video} frames={frames} />
  <MetricsPanel metrics={metrics} />
  <HealthAlerts alerts={alerts} />
)}
```

---

## 🎥 4. Composants Capture Vidéo

### `components/VideoUploader.tsx`

**Fonctionnalités :**
```tsx
// Drag & drop
<div onDrop={handleDrop} onDragOver={...}>
  <Upload icon />
  <input type="file" accept="video/*" />
</div>

// Validation
const video = document.createElement("video");
video.onloadedmetadata = () => {
  if (video.duration > 15) alert("Max 15s");
  else onVideoSelect(file);
};
```

**Points techniques :**
- Validation format vidéo
- Validation durée (max 15s)
- URL.createObjectURL pour preview

### `components/VideoRecorder.tsx`

**Fonctionnalités :**
```tsx
// Accès caméra
const stream = await navigator.mediaDevices.getUserMedia({ video: true });

// MediaRecorder
const mediaRecorder = new MediaRecorder(stream, {
  mimeType: "video/webm;codecs=vp8",
});

mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
mediaRecorder.onstop = () => {
  const blob = new Blob(chunks, { type: "video/webm" });
  onRecordingComplete(blob);
};

// Timer
setInterval(() => setDuration(prev => prev + 0.1), 100);
```

---

## 🤖 5. Analyse de Pose

### `lib/hooks/usePoseModel.ts`

**Chargement modèle :**
```tsx
useEffect(() => {
  async function loadModel() {
    // Import dynamique (évite SSR)
    poseDetection = await import("@tensorflow-models/pose-detection");
    
    // Création détecteur MoveNet
    const detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      { modelType: SINGLEPOSE_LIGHTNING }
    );
    
    setModel(detector);
  }
  loadModel();
}, []);
```

**Analyse vidéo :**
```tsx
const analyzeVideo = async (video, onProgress) => {
  const frames = [];
  const fps = 30;
  let currentTime = 0;
  
  while (currentTime < video.duration) {
    // Seeker à la frame
    video.currentTime = currentTime;
    await waitForSeek();
    
    // Détection pose
    const detections = await model.estimatePoses(video);
    const keypoints = mapMoveNetToKeypoints(detections[0]);
    
    frames.push({ keypoints, t: currentTime });
    onProgress((frames.length / totalFrames) * 100);
    
    currentTime += 1/fps;
  }
  
  return frames;
};
```

**Mapping keypoints :**
```tsx
function mapMoveNetToKeypoints(detection) {
  const keypoints = {};
  detection.keypoints.forEach(kp => {
    // Mapping "left_shoulder" → "left_shoulder"
    if (kp.name.includes("left_shoulder")) {
      keypoints.left_shoulder = { x: kp.x, y: kp.y, score: kp.score };
    }
    // ... tous les keypoints
  });
  return keypoints;
}
```

### `components/PoseAnalyzer.tsx`

**Orchestration :**
```tsx
const startAnalysis = async () => {
  // 1. Analyse vidéo
  const frames = await analyzeVideo(video, setProgress);
  
  // 2. Extraction angles
  const angles = extractAllAngles(frames);
  
  // 3. Calcul vélocités
  const angularVelocities = {};
  Object.entries(angles).forEach(([key, values]) => {
    angularVelocities[key] = computeAngularVelocity(values, times);
  });
  
  // 4. Calcul asymétrie
  const asymmetry = {
    elbow: computeAsymmetry(angles.left_elbow, angles.right_elbow),
    // ...
  };
  
  // 5. Calcul cadence
  const cadence = computeCadence(avgVelocities, times);
  
  // 6. Génération alertes
  const alerts = generateHealthAlerts(frames, asymmetry, cadence.trend);
  
  // 7. Callback
  onAnalysisComplete(frames, metrics, alerts);
};
```

---

## 📐 6. Calculs Biomécaniques

### `lib/pose/utils.ts`

**Distance euclidienne :**
```tsx
export function distance(a, b) {
  return Math.sqrt((b.x - a.x)² + (b.y - a.y)²);
}
```

**Angle entre 3 points :**
```tsx
export function computeJointAngle(a, b, c) {
  // b est le sommet de l'angle
  const ab = distance(a, b);
  const bc = distance(b, c);
  const ac = distance(a, c);
  
  // Loi des cosinus: cos(C) = (a² + b² - c²) / (2ab)
  const cosAngle = (ab² + bc² - ac²) / (2 * ab * bc);
  const angleRad = Math.acos(Math.max(-1, Math.min(1, cosAngle)));
  return (angleRad * 180) / Math.PI;
}
```

### `lib/pose/angles.ts`

**Extraction angles :**
```tsx
export function extractAngles(frames, jointA, jointB, jointC) {
  const angles = [];
  
  for (const frame of frames) {
    const a = jointA(frame);  // Ex: left_shoulder
    const b = jointB(frame);   // Ex: left_elbow
    const c = jointC(frame);   // Ex: left_wrist
    
    if (isKeypointReliable(a) && isKeypointReliable(b) && isKeypointReliable(c)) {
      const angle = computeJointAngle(a, b, c);
      angles.push(angle);
    } else {
      // Interpolation: dernière valeur valide
      angles.push(angles[angles.length - 1] || 0);
    }
  }
  
  return smoothArray(angles, 3); // Lissage fenêtre 3
}
```

### `lib/pose/velocity.ts`

**Vélocité angulaire :**
```tsx
export function computeAngularVelocity(angles, times) {
  const velocities = [0]; // Première frame = 0
  
  for (let i = 1; i < angles.length; i++) {
    const dt = times[i] - times[i - 1];
    const dAngle = angles[i] - angles[i - 1];
    velocities.push(dAngle / dt); // degrés/seconde
  }
  
  return smoothArray(velocities, 3);
}
```

### `lib/pose/cadence.ts`

**Détection cadence :**
```tsx
export function computeCadence(angles, times) {
  const velocities = computeAngularVelocity(angles, times);
  const threshold = Math.max(...velocities.map(Math.abs)) * 0.6;
  
  // Détection pics
  let peaks = 0;
  for (let i = 1; i < velocities.length - 1; i++) {
    if (Math.abs(velocities[i]) > threshold &&
        Math.abs(velocities[i]) > Math.abs(velocities[i-1]) &&
        Math.abs(velocities[i]) > Math.abs(velocities[i+1])) {
      peaks++;
    }
  }
  
  const duration = times[times.length - 1] - times[0];
  const cadence = peaks / duration; // pics/seconde
  
  // Trend: premier vs dernier tiers
  const third = Math.floor(velocities.length / 3);
  const firstAvg = velocities.slice(0, third).reduce(...) / third;
  const lastAvg = velocities.slice(-third).reduce(...) / third;
  const trend = ((lastAvg - firstAvg) / firstAvg) * 100;
  
  return { cadence, trend };
}
```

### `lib/pose/alerts.ts`

**Détection valgus genou :**
```tsx
export function detectKneeValgus(frames) {
  const flaggedFrames = [];
  
  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    const angle = computeJointAngle(
      frame.keypoints.left_hip,
      frame.keypoints.left_knee,
      frame.keypoints.left_ankle
    );
    
    if (angle < 165) { // Seuil valgus
      flaggedFrames.push(i);
    }
  }
  
  const ratio = flaggedFrames.length / frames.length;
  return {
    flagged: ratio >= 0.1, // 10% des frames
    frames: flaggedFrames,
  };
}
```

**Génération alertes :**
```tsx
export function generateHealthAlerts(frames, asymmetry, cadenceTrend) {
  const alerts = [];
  
  // Valgus
  const kneeValgus = detectKneeValgus(frames);
  if (kneeValgus.flagged) {
    alerts.push({
      level: kneeValgus.ratioFrames > 0.25 ? "risque" : "attention",
      text: "Alignement genou à surveiller",
      recommendation: "Renforce les muscles stabilisateurs...",
    });
  }
  
  // Asymétrie
  const maxAsymmetry = Math.max(...Object.values(asymmetry));
  if (maxAsymmetry > 15) {
    alerts.push({
      level: maxAsymmetry > 25 ? "attention" : "info",
      text: "Asymétrie gauche/droite détectée",
      recommendation: "Travaille l'équilibre...",
    });
  }
  
  // ... autres alertes
  
  return alerts;
}
```

---

## 🎨 7. Visualisation

### `components/SkeletonOverlay.tsx`

**Canvas overlay :**
```tsx
useEffect(() => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  
  // Taille canvas = taille vidéo
  canvas.width = video.getBoundingClientRect().width;
  canvas.height = video.getBoundingClientRect().height;
  
  // Trouver frame actuelle
  const frame = frames.find(f => f.t >= currentTime);
  
  // Dessiner connections
  KEYPOINT_CONNECTIONS.forEach(([a, b]) => {
    const kpA = frame.keypoints[a];
    const kpB = frame.keypoints[b];
    
    ctx.beginPath();
    ctx.moveTo(kpA.x * scaleX, kpA.y * scaleY);
    ctx.lineTo(kpB.x * scaleX, kpB.y * scaleY);
    ctx.strokeStyle = "#C01C27";
    ctx.lineWidth = 2;
    ctx.stroke();
  });
  
  // Dessiner keypoints avec heat
  Object.entries(frame.keypoints).forEach(([name, kp]) => {
    const alpha = kp.score;
    ctx.fillStyle = `rgb(${255*(1-alpha)}, ${255*alpha}, 0)`;
    ctx.beginPath();
    ctx.arc(kp.x * scaleX, kp.y * scaleY, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}, [video, frames, currentTime]);
```

### `components/MetricsPanel.tsx`

**Graphiques Recharts :**
```tsx
<Tabs>
  <TabsContent value="angles">
    <LineChart data={timeData}>
      <Line dataKey="leftElbow" stroke="#C01C27" />
      <Line dataKey="rightElbow" stroke="#E63946" />
    </LineChart>
  </TabsContent>
  
  <TabsContent value="asymmetry">
    <BarChart data={asymmetryData}>
      <Bar dataKey="value" fill="#C01C27" />
    </BarChart>
  </TabsContent>
</Tabs>
```

---

## 💾 8. API Routes

### `app/api/upload/route.ts`

**Upload Supabase Storage :**
```tsx
export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("video");
  
  // Nom unique
  const fileName = `${Date.now()}_${Math.random()}.${ext}`;
  
  // Upload
  const { data, error } = await supabase.storage
    .from("videos")
    .upload(fileName, buffer, { contentType: file.type });
  
  // URL signée (1 an)
  const { data: urlData } = await supabase.storage
    .from("videos")
    .createSignedUrl(fileName, 31536000);
  
  return NextResponse.json({ videoUrl: urlData.signedUrl });
}
```

### `app/api/sessions/route.ts`

**Création session :**
```tsx
export async function POST(request) {
  const { videoUrl, duration, metrics, alerts } = await request.json();
  
  const { data } = await supabase
    .from("sessions")
    .insert({
      user_id: userId,
      video_url: videoUrl,
      duration_s: duration,
      metrics_json: metrics,
      alerts_json: alerts,
    })
    .select()
    .single();
  
  return NextResponse.json({ id: data.id });
}
```

### `app/api/coach-link/route.ts`

**Génération token :**
```tsx
export async function POST(request) {
  const { sessionId } = await request.json();
  
  // Token unique 32 bytes hex
  const token = randomBytes(32).toString("hex");
  
  // Expiration 14 jours
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 14);
  
  const { data } = await supabase
    .from("coach_links")
    .insert({ session_id: sessionId, token, expires_at: expiresAt })
    .select()
    .single();
  
  return NextResponse.json({ token });
}
```

---

## 🧪 9. Tests

### `tests/angles.test.ts`

```tsx
describe("computeJointAngle", () => {
  it("calcule un angle de 90 degrés", () => {
    const a = { x: 0, y: 0, score: 1 };
    const b = { x: 0, y: 1, score: 1 };
    const c = { x: 1, y: 1, score: 1 };
    
    const angle = computeJointAngle(a, b, c);
    expect(angle).toBeCloseTo(90, 1);
  });
});
```

---

## 🎯 Résumé Architecture

```
User Action
    ↓
Component (UI)
    ↓
Hook (usePoseModel)
    ↓
Utils (calculs)
    ↓
API Route (Supabase)
    ↓
Database (PostgreSQL)
```

**Séparation des responsabilités :**
- **UI** : Composants React (affichage)
- **Logique** : Hooks et utilitaires (calculs)
- **Data** : API routes (persistance)
- **Storage** : Supabase (DB + Storage)

---

**✨ Code propre, modulaire, testé !**

