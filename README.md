# KOVA - Analyse biomécanique sports de combat

MVP démontrable d'une application d'analyse biomécanique pour les sports de combat. Analyse les mouvements via capture vidéo, détecte les points d'amélioration et génère des alertes de prévention santé.

## 🚀 Fonctionnalités MVP

- **Capture vidéo** : Upload ou enregistrement caméra (max 15s)
- **Analyse de pose** : Extraction des keypoints et calcul d'angles en temps réel
- **Métriques** : Angles articulaires, vélocité angulaire, asymétrie, cadence
- **Alertes santé** : Détection automatique de valgus genou, asymétrie, posture lombaire, fatigue
- **Partage coach** : Génération de liens de partage en lecture seule avec expiration
- **Historique** : Sauvegarde des sessions pour suivi dans le temps

## 🛠️ Stack technique

- **Frontend** : Next.js 14 (App Router) + TypeScript
- **UI** : TailwindCSS + shadcn/ui
- **Charts** : Recharts
- **État** : Zustand
- **Auth & DB** : Supabase (email magic link, PostgreSQL, Storage)
- **Pose estimation** : TensorFlow.js MoveNet (client-side)
- **Tests** : Vitest

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Remplir NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
```

## 🗄️ Configuration Supabase

### 1. Créer un projet Supabase

1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Récupérer l'URL et les clés API depuis Settings > API

### 2. Créer les tables

Exécuter ce SQL dans l'éditeur SQL de Supabase :

```sql
-- Table profiles (gérée par Supabase Auth normalement, mais optionnelle pour MVP)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table sessions
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  video_url TEXT,
  thumbnail_url TEXT,
  duration_s NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metrics_json JSONB NOT NULL,
  alerts_json JSONB NOT NULL,
  report_version TEXT DEFAULT '1.0.0'
);

-- Table coach_links
CREATE TABLE IF NOT EXISTS coach_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  revoked BOOLEAN DEFAULT FALSE
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coach_links_token ON coach_links(token);
```

### 3. Créer le bucket Storage

1. Aller dans Storage
2. Créer un bucket nommé `videos`
3. Définir comme **privé** (Private)
4. Dans Policies, ajouter une policy pour upload (authentifié uniquement) :

```sql
-- Policy pour permettre l'upload aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can upload videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'videos');
```

## 🧪 Tests

```bash
# Lancer les tests unitaires
npm run test
```

Tests couvrent les utilitaires de calcul biomécanique :
- `computeJointAngle` : Calcul d'angles
- `computeAsymmetry` : Calcul d'asymétrie
- `detectKneeValgus` : Détection valgus genou
- `detectLumbarFlexion` : Détection flexion lombaire

## 🌱 Seed

Pour créer des données de démonstration :

```bash
npm run seed
```

Génère une session test avec métriques et alertes fictives réalistes.

## 🎯 Commandes disponibles

```bash
npm run dev      # Développement (http://localhost:3000)
npm run build    # Build production
npm run start    # Démarrer en production
npm run lint     # Linter ESLint
npm run test     # Tests Vitest
npm run seed     # Seed base de données
```

## 📖 Utilisation

### 1. Analyse d'une vidéo

1. Aller sur `/analyze`
2. Uploader ou filmer une vidéo (max 15s)
3. Prévisualiser et ajuster si besoin
4. Cliquer sur "Lancer l'analyse"
5. Consulter les résultats : métriques, graphiques, alertes

### 2. Partage au coach

1. Depuis les résultats, cliquer sur "Partager au coach"
2. Générer le lien magique
3. Copier/coller le lien (valide 14 jours, révocable)

### 3. Historique des sessions

1. Aller sur `/sessions`
2. Voir toutes les analyses sauvegardées
3. Cliquer sur une session pour voir les détails

## ⚙️ Configuration des seuils d'alertes

Les seuils sont définis dans `lib/pose/alerts.ts` :

```typescript
const KNEE_VALGUS_THRESHOLD = 165; // degrés
const KNEE_VALGUS_RATIO_THRESHOLD = 0.1; // 10% des frames
const ASYMMETRY_THRESHOLD = 15; // % de différence
const LUMBAR_FLEXION_THRESHOLD = 160; // degrés
const FATIGUE_TREND_THRESHOLD = -20; // % de baisse
```

Modifier ces valeurs pour ajuster la sensibilité des alertes.

## 🔒 Sécurité & Privacy

- **Vidéos privées** : Stockées dans un bucket Supabase privé
- **Liens coach** : 
  - Token unique signé
  - Expiration automatique (14 jours par défaut)
  - Révocable à tout moment
  - Lecture seule (pas de modification possible)

## 📝 Export PDF (optionnel)

Pour ajouter l'export PDF, installer `@react-pdf/renderer` et créer :

```bash
# Déjà inclus dans package.json, créer la route:
/app/api/report-pdf/route.ts
```

## ⚠️ Limitations connues

1. **Analyse côté client** : Précision limitée par la qualité vidéo et l'éclairage
2. **Modèle MoveNet** : Modèle léger, moins précis que MediaPipe Pose (mais plus stable)
3. **Pas de serveur GPU** : Analyse uniquement dans le navigateur
4. **Auth simplifiée** : Pour le MVP, l'auth complète Supabase n'est pas implémentée (à ajouter en prod)

## 🎨 Design

- **Thème** : Dark mode par défaut
- **Palette** : Noir/anthracite, blanc, accent rouge profond (#C01C27)
- **Style** : Minimaliste, inspiré Apple
- **Accessibilité** : Contrastes AA, tailles de police confortables

## 📂 Structure du projet

```
/app
  /api          # Routes API Next.js
  /analyze      # Page analyse
  /sessions     # Page liste sessions
  /session/[id] # Page détail session
  /coach/[token]# Vue coach (lecture seule)
/components    # Composants React
/lib
  /pose        # Utilitaires calcul biomécanique
  /hooks       # Hooks React (usePoseModel)
/tests         # Tests Vitest
/scripts       # Scripts utilitaires (seed)
```

## 🐛 Troubleshooting

### Le modèle de pose ne charge pas

- Vérifier la connexion internet (téléchargement des modèles TensorFlow.js)
- Vérifier la console navigateur pour erreurs
- Essayer avec une vidéo de démonstration

### Erreur Supabase

- Vérifier les variables d'environnement `.env.local`
- Vérifier que les tables sont créées
- Vérifier les policies Storage

### Vidéo non visible après upload

- Vérifier que le bucket `videos` existe et est configuré
- Vérifier les policies de storage
- Vérifier les URLs signées (expiration)

## 📄 Licence

MVP - Usage interne

## 👥 Comptes de test

Pour le MVP, l'authentification complète n'est pas implémentée. Les sessions sont créées avec un `user_id` temporaire. Pour la production :

1. Activer Supabase Auth (email magic link)
2. Récupérer le `user_id` depuis `supabase.auth.getUser()`
3. Sécuriser les API routes avec middleware d'authentification

---

**Développé avec ❤️ pour les sports de combat**

