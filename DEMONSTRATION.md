# 🎬 Démonstration Interactive KOVA

## 📋 Vue d'ensemble du Code

### 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PAGES NEXT.JS                         │
├─────────────────────────────────────────────────────────┤
│  /              → Page d'accueil (Hero + CTA)           │
│  /analyze       → Flux complet analyse vidéo           │
│  /sessions      → Historique des sessions               │
│  /session/[id]  → Détail d'une session                   │
│  /coach/[token] → Vue coach (lecture seule)              │
│  /demo          → Démonstration avec données mock        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                 COMPOSANTS REACT                         │
├─────────────────────────────────────────────────────────┤
│  VideoUploader    → Upload drag & drop                   │
│  VideoRecorder   → Capture caméra MediaRecorder         │
│  PoseAnalyzer    → Analyse MoveNet avec progress bar     │
│  SkeletonOverlay → Dessin squelette sur canvas           │
│  MetricsPanel    → Graphiques Recharts (tabs)            │
│  HealthAlerts    → Alertes avec badges colorés          │
│  CoachShareDialog → Génération liens magiques            │
│  SessionCard     → Carte session pour liste              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│            UTILITAIRES CALCUL BIOMÉCANIQUE                │
├─────────────────────────────────────────────────────────┤
│  lib/pose/angles.ts      → Extraction angles articulaires│
│  lib/pose/velocity.ts    → Calcul vélocité angulaire    │
│  lib/pose/asymmetry.ts   → Calcul asymétrie G/D          │
│  lib/pose/cadence.ts     → Détection cadence (pics)      │
│  lib/pose/alerts.ts       → Génération alertes santé     │
│  lib/hooks/usePoseModel.ts → Hook TensorFlow.js MoveNet │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    API ROUTES                            │
├─────────────────────────────────────────────────────────┤
│  POST /api/upload           → Upload Supabase Storage   │
│  POST /api/sessions          → Créer session + métriques │
│  POST /api/coach-link        → Générer token coach       │
│  GET  /api/coach-link/[token] → Récupérer données       │
└─────────────────────────────────────────────────────────┘
```

## 🎯 Parcours Utilisateur Complet

### 1️⃣ Page d'Accueil (`/`)

**Code :** `app/page.tsx`

```tsx
// Hero section minimaliste
<h2>Transforme chaque mouvement en progrès.</h2>
<Button href="/analyze">Analyser une vidéo</Button>
<Button href="/demo">🎬 Voir la démonstration</Button>
```

**Fonctionnalités :**
- Hero centré avec message inspirant
- 2 CTA : Analyse réelle ou Démo
- Design sobre, dark mode

### 2️⃣ Page Analyse (`/analyze`)

**Code :** `app/analyze/page.tsx`

**Étapes du flux :**

#### Step 1: Upload/Capture
```tsx
<VideoUploader onVideoSelect={handleVideoSelect} />
<VideoRecorder onRecordingComplete={handleRecordingComplete} />
```

**Composants :**
- `VideoUploader` : Drag & drop + file input
- `VideoRecorder` : MediaRecorder API, timer 15s max

#### Step 2: Preview
```tsx
<video ref={videoRef} src={videoUrl} controls />
<PoseAnalyzer video={videoRef.current} onAnalysisComplete={...} />
```

**Fonctionnalités :**
- Prévisualisation vidéo
- Bouton "Lancer l'analyse"

#### Step 3: Analyse (Progress)
```tsx
// usePoseModel hook charge MoveNet
const { model, loading, analyzeVideo } = usePoseModel();

// Analyse frame par frame
const frames = await analyzeVideo(video, (progress) => {
  setProgress(progress); // Barre de progression
});
```

**Ce qui se passe :**
1. Chargement modèle MoveNet (~2-3s première fois)
2. Extraction keypoints frame par frame
3. Calcul angles via `extractAllAngles()`
4. Calcul vélocités via `computeAngularVelocity()`
5. Calcul asymétrie via `computeAsymmetry()`
6. Calcul cadence via `computeCadence()`
7. Génération alertes via `generateHealthAlerts()`

#### Step 4: Résultats
```tsx
<div className="grid lg:grid-cols-3">
  {/* Colonne 1-2: Vidéo + Métriques */}
  <SkeletonOverlay video={video} frames={frames} currentTime={...} />
  <MetricsPanel metrics={metrics} frames={frames} />
  
  {/* Colonne 3: Alertes + Partage */}
  <HealthAlerts alerts={alerts} />
  <CoachShareDialog ... />
</div>
```

### 3️⃣ Composant SkeletonOverlay

**Code :** `components/SkeletonOverlay.tsx`

**Fonctionnement :**
```tsx
// Canvas overlay sur la vidéo
<canvas ref={canvasRef} className="absolute inset-0" />

// Dessin du squelette
ctx.strokeStyle = "#C01C27";
KEYPOINT_CONNECTIONS.forEach(([a, b]) => {
  ctx.beginPath();
  ctx.moveTo(keypoints[a].x * scaleX, keypoints[a].y * scaleY);
  ctx.lineTo(keypoints[b].x * scaleX, keypoints[b].y * scaleY);
  ctx.stroke();
});

// Heat map des keypoints
ctx.fillStyle = `rgb(${red}, ${green}, 0)`; // Selon score
```

**Caractéristiques :**
- Overlay synchronisé avec la vidéo
- Heat map selon confiance (score 0-1)
- Connections anatomiques (17 keypoints)
- Mise à jour en temps réel

### 4️⃣ Composant MetricsPanel

**Code :** `components/MetricsPanel.tsx`

**Graphiques Recharts :**
```tsx
<Tabs>
  <TabsContent value="angles">
    <LineChart data={timeData}>
      <Line dataKey="leftElbow" stroke="#C01C27" />
      <Line dataKey="rightElbow" stroke="#E63946" />
      <Line dataKey="leftKnee" stroke="#4CAF50" />
      <Line dataKey="rightKnee" stroke="#81C784" />
    </LineChart>
  </TabsContent>
  
  <TabsContent value="asymmetry">
    <BarChart data={asymmetryData}>
      <Bar dataKey="value" fill="#C01C27" />
    </BarChart>
  </TabsContent>
</Tabs>
```

**Métriques affichées :**
- **Angles** : Coude, épaule, hanche, genou, cheville (G/D)
- **Asymétrie** : % de différence par segment
- **Cadence** : Pics de vitesse par seconde
- **Résumé** : Angles moyens, asymétrie max

### 5️⃣ Composant HealthAlerts

**Code :** `components/HealthAlerts.tsx`

**Génération d'alertes :**
```tsx
// lib/pose/alerts.ts
export function generateHealthAlerts(frames, asymmetry, cadenceTrend) {
  const alerts = [];
  
  // Valgus genou
  const kneeValgus = detectKneeValgus(frames);
  if (kneeValgus.flagged) {
    alerts.push({
      level: kneeValgus.ratioFrames > 0.25 ? "risque" : "attention",
      text: "Alignement genou à surveiller",
      recommendation: "Renforce les muscles stabilisateurs...",
    });
  }
  
  // Asymétrie
  if (maxAsymmetry > 15) {
    alerts.push({
      level: "attention",
      text: "Asymétrie gauche/droite détectée",
      recommendation: "Travaille l'équilibre...",
    });
  }
  
  // ... autres alertes
}
```

**Affichage :**
```tsx
<Badge variant={alert.level}>  // info/attention/risque
  {alert.level}
</Badge>
{alert.text}
{alert.recommendation}
```

### 6️⃣ Partage Coach

**Code :** `components/CoachShareDialog.tsx`

**Flux :**
```tsx
// 1. Génération token
POST /api/coach-link
{ sessionId }
→ { token: "abc123..." }

// 2. Création lien
const shareUrl = `${origin}/coach/${token}`;

// 3. Vue coach (lecture seule)
GET /api/coach-link/[token]
→ { videoUrl, metrics, alerts } // Données uniquement
```

**Sécurité :**
- Token unique (32 bytes hex)
- Expiration 14 jours
- Révocable (revoked: true)
- Lecture seule (pas de modification)

### 7️⃣ Page Démonstration (`/demo`)

**Code :** `app/demo/page.tsx`

**Fonctionnement :**
```tsx
// Génération données synthétiques
const frames = generateDemoFrames(10, 30); // 10s, 30fps
const metrics = generateDemoMetrics(frames);
const alerts = generateHealthAlerts(frames, metrics.asymmetry, ...);

// Affichage interactif
<SkeletonOverlay frames={frames} currentTime={currentTime} />
<MetricsPanel metrics={metrics} frames={frames} />
<HealthAlerts alerts={alerts} />
```

**Avantages :**
- Test sans vidéo réelle
- Pas besoin de Supabase
- Démonstration immédiate
- Données réalistes

## 💻 Exemples de Code Clés

### Hook usePoseModel

```typescript
// lib/hooks/usePoseModel.ts
export function usePoseModel() {
  const [model, setModel] = useState<PoseDetector | null>(null);
  
  useEffect(() => {
    // Chargement dynamique côté client
    const detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      { modelType: SINGLEPOSE_LIGHTNING }
    );
    setModel(detector);
  }, []);
  
  const analyzeVideo = async (video, onProgress) => {
    // Frame par frame
    while (currentTime < video.duration) {
      const detections = await model.estimatePoses(video);
      const keypoints = mapMoveNetToKeypoints(detections[0]);
      frames.push({ keypoints, t: currentTime });
      
      onProgress((frames.length / totalFrames) * 100);
      currentTime += frameDuration;
    }
  };
}
```

### Calcul d'Angle

```typescript
// lib/pose/utils.ts
export function computeJointAngle(a, b, c) {
  // Loi des cosinus
  const ab = distance(a, b);
  const bc = distance(b, c);
  const ac = distance(a, c);
  
  const cosAngle = (ab² + bc² - ac²) / (2 * ab * bc);
  const angleRad = Math.acos(Math.max(-1, Math.min(1, cosAngle)));
  return (angleRad * 180) / Math.PI;
}
```

### Détection Valgus

```typescript
// lib/pose/alerts.ts
export function detectKneeValgus(frames) {
  const flaggedFrames = [];
  
  for (const frame of frames) {
    const angle = computeJointAngle(
      frame.keypoints.left_hip,
      frame.keypoints.left_knee,
      frame.keypoints.left_ankle
    );
    
    if (angle < 165) { // Seuil valgus
      flaggedFrames.push(frameIndex);
    }
  }
  
  const ratio = flaggedFrames.length / frames.length;
  return {
    flagged: ratio >= 0.1, // 10% des frames
    frames: flaggedFrames,
  };
}
```

## 🎨 Design System

### Palette
```css
--background: 0 0% 3.9%;        /* Noir anthracite */
--foreground: 0 0% 98%;          /* Blanc */
--accent: #C01C27;               /* Rouge profond */
--muted: 0 0% 14.9%;             /* Gris foncé */
```

### Composants shadcn/ui
- `Button` : Variants (default, outline, ghost)
- `Card` : Container avec header/content
- `Tabs` : Navigation onglets
- `Badge` : Tags colorés (info, attention, risque)
- `Dialog` : Modales partage

## 📊 Structure Données

### Session (Supabase)
```typescript
{
  id: uuid,
  user_id: uuid,
  video_url: string,
  duration_s: number,
  metrics_json: {
    angles: { left_elbow: number[], ... },
    angularVelocities: { ... },
    asymmetry: { elbow: number, ... },
    cadence: { value: number, trend: number },
  },
  alerts_json: Array<{
    level: "info" | "attention" | "risque",
    text: string,
    recommendation: string,
    frames?: number[],
  }>,
}
```

## 🧪 Tests Unitaires

```typescript
// tests/angles.test.ts
describe("computeJointAngle", () => {
  it("calcule un angle de 90 degrés", () => {
    const angle = computeJointAngle(a, b, c);
    expect(angle).toBeCloseTo(90, 1);
  });
});

// tests/alerts.test.ts
describe("detectKneeValgus", () => {
  it("détecte le valgus du genou", () => {
    const result = detectKneeValgus(frames);
    expect(result.flagged).toBe(true);
  });
});
```

## 🚀 Commandes

```bash
npm run dev      # Développement (localhost:3000)
npm run build    # Build production
npm run test     # Tests Vitest
npm run seed     # Seed données démo
```

## 📝 Checklist Démonstration

- [ ] Page d'accueil chargée
- [ ] Clic "Voir la démonstration"
- [ ] Squelette animé visible
- [ ] Graphiques métriques fonctionnels
- [ ] Alertes affichées
- [ ] Boutons play/pause fonctionnent
- [ ] Slider temps fonctionne
- [ ] Retour à `/analyze` pour test réel
- [ ] Upload vidéo test
- [ ] Analyse lance correctement
- [ ] Résultats s'affichent

---

**🎬 Prêt pour la démonstration !**

Le code est modulaire, typé, et toutes les fonctionnalités sont implémentées.

