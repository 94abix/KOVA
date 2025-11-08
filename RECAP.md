# 📋 Récapitulatif MVP KOVA

## ✅ État du projet

Le MVP KOVA est **complet et fonctionnel**. Tous les composants, pages, API routes, utilitaires et tests ont été implémentés.

## 📁 Structure créée

```
kova/
├── app/                    # Pages Next.js (App Router)
│   ├── analyze/           # Page analyse vidéo
│   ├── sessions/          # Liste des sessions
│   ├── session/[id]/      # Détail d'une session
│   ├── coach/[token]/     # Vue coach (lecture seule)
│   └── api/               # Routes API
│       ├── upload/        # Upload vidéo
│       ├── sessions/      # CRUD sessions
│       └── coach-link/    # Génération liens coach
├── components/            # Composants React
│   ├── VideoUploader.tsx
│   ├── VideoRecorder.tsx
│   ├── PoseAnalyzer.tsx
│   ├── SkeletonOverlay.tsx
│   ├── MetricsPanel.tsx
│   ├── HealthAlerts.tsx
│   ├── CoachShareDialog.tsx
│   └── SessionCard.tsx
├── lib/
│   ├── pose/              # Utilitaires calcul biomécanique
│   │   ├── angles.ts
│   │   ├── velocity.ts
│   │   ├── asymmetry.ts
│   │   ├── cadence.ts
│   │   └── alerts.ts
│   ├── hooks/
│   │   └── usePoseModel.ts # Hook analyse pose
│   └── supabase.ts        # Client Supabase
├── tests/                 # Tests unitaires Vitest
├── scripts/
│   └── seed.ts            # Script seed données
└── supabase/
    └── schema.sql         # Schéma base de données
```

## 🚀 Démarrage rapide

### 1. Installation

```bash
cd /Users/bousri/Desktop/kova
npm install
```

### 2. Configuration Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Récupérer les clés API (Settings > API)
3. Créer le fichier `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

### 3. Créer les tables

Dans l'éditeur SQL de Supabase, exécuter le contenu de `supabase/schema.sql`

### 4. Créer le bucket Storage

1. Storage > Créer bucket `videos` (privé)
2. Ajouter policy pour upload (voir README.md)

### 5. Lancer l'application

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 📝 Pages disponibles

- `/` - Page d'accueil avec CTA
- `/analyze` - Analyse vidéo (upload/capture + analyse + résultats)
- `/sessions` - Liste des sessions sauvegardées
- `/session/[id]` - Détail d'une session avec métriques et alertes
- `/coach/[token]` - Vue coach en lecture seule (lien magique)

## 🔑 Fonctionnalités implémentées

✅ **Capture vidéo**
- Upload fichier (drag & drop)
- Enregistrement caméra (MediaRecorder)
- Limite 15s, validation format

✅ **Analyse biomécanique**
- Extraction keypoints (MoveNet/TensorFlow.js)
- Calcul angles articulaires (coude, épaule, hanche, genou, cheville)
- Vélocité angulaire
- Asymétrie gauche/droite
- Cadence (pics de vitesse)

✅ **Alertes santé**
- Valgus genou (angle < 165°)
- Asymétrie (> 15%)
- Flexion lombaire (angle < 160°)
- Fatigue (baisse cadence > 20%)

✅ **Visualisation**
- Overlay squelette sur vidéo
- Graphiques angles vs temps
- Graphiques asymétrie
- Heat map des keypoints

✅ **Partage coach**
- Génération lien magique (token unique)
- Expiration 14 jours
- Lecture seule
- Révocable

✅ **Historique**
- Sauvegarde sessions
- Liste triée par date
- Accès détail complet

✅ **Tests**
- Tests unitaires utilitaires (angles, asymétrie, alertes)
- Couverture fonctions critiques

## ⚠️ Limitations connues

1. **Auth simplifiée** : Pas d'auth complète Supabase implémentée (user_id temporaire pour MVP)
2. **Modèle pose** : MoveNet Lightning (léger mais moins précis que MediaPipe Pose)
3. **Analyse côté client** : Dépend de la puissance du navigateur
4. **Précision limitée** : Qualité vidéo et éclairage impactent les résultats

## 🧪 Tests

```bash
npm run test
```

Tests couvrent :
- `computeJointAngle` : Calcul angles
- `computeAsymmetry` : Calcul asymétrie
- `detectKneeValgus` : Détection valgus
- `detectLumbarFlexion` : Détection flexion lombaire

## 🌱 Seed données

```bash
npm run seed
```

Crée une session de démonstration avec métriques et alertes fictives.

## 📊 Variables d'environnement requises

```env
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

## 🎨 Design

- **Thème** : Dark mode par défaut
- **Couleurs** : Noir/anthracite, blanc, accent rouge (#C01C27)
- **Style** : Minimaliste, inspiré Apple
- **UI** : shadcn/ui + TailwindCSS
- **Charts** : Recharts

## 📚 Documentation

- **README.md** : Documentation complète
- **supabase/schema.sql** : Schéma base de données
- **lib/pose/alerts.ts** : Seuils configurables des alertes

## ✨ Prochaines étapes (hors MVP)

- [ ] Auth Supabase complète (email magic link)
- [ ] Export PDF rapports
- [ ] Miniatures vidéo automatiques
- [ ] Optimisation performance (WebWorker pour analyse)
- [ ] Support MediaPipe Pose (plus précis)
- [ ] Comparaison sessions (évolution dans le temps)

## 🐛 Debug

### Le modèle ne charge pas

- Vérifier console navigateur
- Vérifier connexion internet (téléchargement modèles)
- Essayer vidéo démo

### Erreur Supabase

- Vérifier `.env.local`
- Vérifier tables créées
- Vérifier policies Storage

### Vidéo non visible

- Vérifier bucket `videos` créé
- Vérifier policies storage
- Vérifier URLs signées

---

**✅ MVP prêt à démontrer !**

Toutes les fonctionnalités demandées sont implémentées. Le code est modulaire, typé, testé et documenté.

