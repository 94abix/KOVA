# 🔐 Créer un Compte et Projet Supabase

Ce guide vous explique comment créer un compte Supabase et récupérer vos identifiants pour le projet KOVA.

## 🎯 Étape 1 : Créer un Compte Supabase

1. **Allez sur** : https://supabase.com
2. **Cliquez sur "Start your project"** ou **"Sign up"**
3. **Choisissez votre méthode de connexion** :
   - Avec GitHub (recommandé)
   - Avec email
   - Avec Google
4. **Suivez les instructions** pour créer votre compte

## 🎯 Étape 2 : Créer un Nouveau Projet

Une fois connecté :

1. **Cliquez sur "New Project"** ou **"Create a new project"**
2. **Remplissez les informations** :
   - **Name** : Donnez un nom à votre projet (ex: `kova` ou `kova-mvp`)
   - **Database Password** : Choisissez un mot de passe fort pour la base de données
     - ⚠️ **IMPORTANT** : Notez ce mot de passe, vous en aurez besoin !
   - **Region** : Choisissez la région la plus proche de vous
     - Europe (ex: `West Europe (Paris)`) si vous êtes en France
   - **Pricing Plan** : Sélectionnez **Free** (gratuit)
3. **Cliquez sur "Create new project"**
4. **Attendez 2-3 minutes** que le projet soit créé (vous verrez une barre de progression)

## 🎯 Étape 3 : Récupérer vos Identifiants (Variables d'Environnement)

Une fois le projet créé :

1. **Allez dans "Settings"** (⚙️ icône en bas à gauche)
2. **Cliquez sur "API"** (dans le menu de gauche)
3. **Vous verrez 3 informations importantes** :

### 📍 Project URL
- **C'est votre** `NEXT_PUBLIC_SUPABASE_URL`
- Format : `https://xxxxxxxxxxxxx.supabase.co`
- **Copiez cette URL** (vous en aurez besoin pour Vercel)

### 🔑 anon public key
- **C'est votre** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- C'est une longue chaîne de caractères (JWT token)
- **Copiez cette clé** (vous en aurez besoin pour Vercel)

### 🔐 service_role secret key
- **C'est votre** `SUPABASE_SERVICE_ROLE_KEY`
- ⚠️ **ATTENTION** : Cette clé est **SECRÈTE**, ne la partagez jamais !
- C'est aussi une longue chaîne de caractères (JWT token)
- **Copiez cette clé** (vous en aurez besoin pour Vercel)
- Pour la voir, cliquez sur l'icône 👁️ (œil) ou "Reveal"

## 🎯 Étape 4 : Configurer la Base de Données

1. **Allez dans "SQL Editor"** (dans le menu de gauche)
2. **Cliquez sur "New query"**
3. **Copiez et collez ce SQL** (depuis le README.md du projet) :

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

4. **Cliquez sur "Run"** (ou appuyez sur Ctrl+Enter / Cmd+Enter)
5. **Vérifiez que les tables sont créées** (vous devriez voir "Success")

## 🎯 Étape 5 : Configurer le Storage (pour les vidéos)

1. **Allez dans "Storage"** (dans le menu de gauche)
2. **Cliquez sur "Create a new bucket"**
3. **Remplissez les informations** :
   - **Name** : `videos`
   - **Public bucket** : **DÉCOCHÉ** (privé)
4. **Cliquez sur "Create bucket"**
5. **Allez dans "Policies"** (onglet en haut)
6. **Cliquez sur "New Policy"** → **"For full customization"**
7. **Ajoutez cette policy** :

```sql
-- Policy pour permettre l'upload aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can upload videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'videos');
```

8. **Cliquez sur "Review"** puis **"Save policy"**

## ✅ Résumé : Ce que vous devez récupérer

Une fois tout configuré, vous devez avoir :

1. ✅ **NEXT_PUBLIC_SUPABASE_URL** : `https://xxxxxxxxxxxxx.supabase.co`
2. ✅ **NEXT_PUBLIC_SUPABASE_ANON_KEY** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. ✅ **SUPABASE_SERVICE_ROLE_KEY** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

Ces 3 valeurs sont dans : **Settings → API**

## 📝 Où stocker ces identifiants ?

### Pour le développement local :
Créez un fichier `.env.local` dans `/Users/bousri/Documents/KOVA/kova/` :

```bash
cd /Users/bousri/Documents/KOVA/kova
cp .env.example .env.local
```

Puis éditez `.env.local` et remplacez les valeurs :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anonyme_ici
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_ici
```

### Pour Vercel (production) :
Suivez le guide : `CONFIGURER_VERCEL_ENV.md`

## 🔒 Sécurité

⚠️ **IMPORTANT** :
- Ne partagez **JAMAIS** vos clés Supabase
- Ne commitez **JAMAIS** le fichier `.env.local` dans Git
- Le fichier `.env.local` est déjà dans `.gitignore`
- La clé `SUPABASE_SERVICE_ROLE_KEY` est particulièrement sensible

## 🆘 Besoin d'Aide ?

- Documentation Supabase : https://supabase.com/docs
- Support Supabase : https://supabase.com/support
- Guide de déploiement : `DEPLOYMENT_GUIDE.md`

## 📚 Prochaines Étapes

Une fois votre compte Supabase configuré :

1. ✅ Récupérez vos 3 identifiants (Settings → API)
2. ✅ Configurez les tables (SQL Editor)
3. ✅ Configurez le storage (Storage → Create bucket)
4. ✅ Configurez les variables dans Vercel (voir `CONFIGURER_VERCEL_ENV.md`)

