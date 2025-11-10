# 🚀 Obtenir un Lien Partageable sur Vercel

Ce guide vous explique comment obtenir un lien partageable pour votre application KOVA sur Vercel.

## ✅ Étape 1 : Vérifier que le code est sur GitHub

Le code a été poussé sur GitHub. Vérifiez sur : https://github.com/94abix/KOVA

## 🎯 Étape 2 : Déployer sur Vercel

### Option A : Déploiement Automatique (Recommandé)

1. **Allez sur** : https://vercel.com
2. **Connectez-vous** avec votre compte GitHub
   - Cliquez sur "Continue with GitHub"
   - Autorisez Vercel à accéder à vos dépôts
3. **Importez votre projet** :
   - Cliquez sur "Add New..." → "Project"
   - Sélectionnez le dépôt `94abix/KOVA`
   - Vercel détectera automatiquement que c'est un projet Next.js ✅
4. **Configurez le projet** :
   - **Framework Preset** : Next.js (détecté automatiquement)
   - **Root Directory** : `./` (par défaut)
   - **Build Command** : `npm run build` (par défaut)
   - **Output Directory** : `.next` (par défaut)
   - **Install Command** : `npm install` (par défaut)
5. **Variables d'environnement** (⚠️ IMPORTANT) :
   - Avant de cliquer sur "Deploy", allez dans **"Environment Variables"**
   - Ajoutez ces 3 variables :
     - `NEXT_PUBLIC_SUPABASE_URL` = votre URL Supabase
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = votre clé anonyme Supabase
     - `SUPABASE_SERVICE_ROLE_KEY` = votre clé de service Supabase
   - Cochez **Production**, **Preview**, et **Development** pour chaque variable
   - Cliquez sur **"Save"**
6. **Déployez** :
   - Cliquez sur **"Deploy"**
   - Attendez 2-3 minutes pour le premier déploiement

### Option B : Déploiement via CLI Vercel

Si vous préférez utiliser la ligne de commande :

```bash
cd /Users/bousri/Documents/KOVA/kova

# Installer Vercel CLI
npm install -g vercel

# Se connecter à Vercel
vercel login

# Déployer
vercel

# Suivez les instructions
# - Link to existing project? No
# - Project name: kova
# - Directory: ./
# - Override settings? No
```

## ✅ Étape 3 : Obtenir le Lien Partageable

Une fois le déploiement terminé :

1. **Vercel vous donnera automatiquement une URL** :
   - Format : `kova-xxxxx.vercel.app` ou `kova.vercel.app`
   - Cette URL est **publique** et **partageable** ✅

2. **Pour trouver votre lien** :
   - Allez dans votre dashboard Vercel : https://vercel.com/dashboard
   - Cliquez sur votre projet `KOVA`
   - L'URL est affichée en haut de la page
   - Exemple : `https://kova-xxxxx.vercel.app`

3. **Partager le lien** :
   - Copiez l'URL
   - Partagez-la avec qui vous voulez
   - L'application est accessible publiquement

## 🔧 Configuration Optionnelle

### Nom de domaine personnalisé

1. Dans Vercel, allez dans **Settings** → **Domains**
2. Ajoutez votre domaine personnalisé (ex: `kova.com`)
3. Suivez les instructions pour configurer les DNS

### Déploiements automatiques

- ✅ Par défaut, chaque push sur `main` déclenche un nouveau déploiement
- ✅ Les autres branches créent des "Preview Deployments"
- ✅ Vous pouvez désactiver cela dans **Settings** → **Git**

## 📝 Variables d'Environnement

⚠️ **IMPORTANT** : N'oubliez pas de configurer les variables d'environnement Supabase dans Vercel !

1. Allez dans **Settings** → **Environment Variables**
2. Ajoutez :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Cochez **Production**, **Preview**, et **Development**
4. Cliquez sur **"Save"**
5. **Redéployez** après avoir ajouté les variables

Pour plus de détails, consultez : `CONFIGURER_VERCEL_ENV.md`

## ✅ Résumé

1. ✅ Code poussé sur GitHub
2. ⏳ Déployer sur Vercel (voir ci-dessus)
3. ⏳ Obtenir le lien partageable
4. ⏳ Configurer les variables d'environnement Supabase

## 🎉 C'est tout !

Une fois déployé, vous aurez un lien comme :
- `https://kova-xxxxx.vercel.app`

Ce lien est **public** et **partageable** avec n'importe qui !

