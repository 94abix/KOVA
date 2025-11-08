# 🚀 Guide de Déploiement KOVA sur Vercel

Ce guide vous explique comment mettre votre application KOVA en ligne sur Vercel de manière simple, **sans modifier le code de base**.

## 📋 Prérequis

- ✅ Un compte GitHub (gratuit) : [github.com/signup](https://github.com/signup)
- ✅ Un compte Vercel (gratuit) : [vercel.com/signup](https://vercel.com/signup)
- ✅ Un projet Supabase configuré (pour les variables d'environnement)

## 🎯 Étapes de Déploiement

### Étape 1 : Créer un dépôt GitHub

1. **Connectez-vous à GitHub** : [github.com/login](https://github.com/login)

2. **Créez un nouveau dépôt** :
   - Cliquez sur le bouton **"+"** en haut à droite
   - Sélectionnez **"New repository"**
   - Donnez un nom au dépôt (ex: `kova` ou `kova-mvp`)
   - Choisissez **Public** ou **Private** selon vos préférences
   - **⚠️ IMPORTANT** : Ne cochez **PAS** "Initialize this repository with a README"
   - Cliquez sur **"Create repository"**

3. **Copiez l'URL du dépôt** : GitHub vous donnera une URL comme :
   ```
   https://github.com/VOTRE_USERNAME/VOTRE_REPO.git
   ```

### Étape 2 : Pousser le code sur GitHub

**Option A : Utiliser le script automatique**

```bash
cd /Users/bousri/Documents/KOVA/kova
./push-to-github.sh VOTRE_USERNAME VOTRE_REPO
```

**Option B : Commandes manuelles**

```bash
cd /Users/bousri/Documents/KOVA/kova

# Remplacez par votre URL GitHub
git remote add origin https://github.com/VOTRE_USERNAME/VOTRE_REPO.git
git branch -M main
git push -u origin main
```

**Si vous avez besoin d'authentification** :
- GitHub utilise maintenant des tokens personnels (Personal Access Tokens)
- Créez un token : GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
- Utilisez le token comme mot de passe lors du push

### Étape 3 : Déployer sur Vercel

1. **Connectez-vous à Vercel** : [vercel.com/login](https://vercel.com/login)
   - Cliquez sur **"Continue with GitHub"** pour une connexion facile

2. **Importez votre projet** :
   - Cliquez sur **"Add New..."** puis **"Project"**
   - Sélectionnez le dépôt GitHub que vous venez de créer
   - Vercel détectera automatiquement que c'est un projet Next.js ✅

3. **Configuration du projet** :
   - **Framework Preset** : Next.js (détecté automatiquement)
   - **Root Directory** : `./` (par défaut)
   - **Build Command** : `npm run build` (par défaut)
   - **Output Directory** : `.next` (par défaut)
   - **Install Command** : `npm install` (par défaut)

4. **Variables d'environnement** (⚠️ IMPORTANT) :
   - Avant de cliquer sur "Deploy", allez dans **"Environment Variables"**
   - Ajoutez ces 3 variables :

   | Nom | Valeur | Description |
   |-----|--------|-------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Votre URL Supabase | Ex: `https://xxxxx.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Votre clé anonyme | Clé publique Supabase |
   | `SUPABASE_SERVICE_ROLE_KEY` | Votre clé de service | Clé privée Supabase (pour API routes) |

   - Sélectionnez **Production**, **Preview**, et **Development** pour chaque variable
   - Cliquez sur **"Save"**

5. **Déployer** :
   - Cliquez sur **"Deploy"**
   - Vercel va automatiquement :
     - Installer les dépendances (`npm install`)
     - Builder le projet (`npm run build`)
     - Déployer l'application
   - Attendez 2-3 minutes pour le premier déploiement

### Étape 4 : Vérifier le déploiement

1. **Une fois le déploiement terminé** :
   - Vercel vous donnera une URL (ex: `kova.vercel.app`)
   - Cliquez sur l'URL pour voir votre application en ligne

2. **Testez l'application** :
   - ✅ La page d'accueil se charge
   - ✅ La vidéo de démonstration (`public/Demo kova 2.mp4`) se charge
   - ✅ Les fonctionnalités principales fonctionnent
   - ✅ Les API routes fonctionnent (si configurées)

3. **Si vous avez des erreurs** :
   - Allez dans **"Deployments"** → Cliquez sur le dernier déploiement
   - Consultez les **"Build Logs"** pour voir les erreurs
   - Vérifiez que les variables d'environnement sont correctement configurées

## 🔧 Configuration Supplémentaire (Optionnel)

### Nom de domaine personnalisé

1. Dans Vercel, allez dans **Settings** → **Domains**
2. Ajoutez votre domaine personnalisé
3. Suivez les instructions pour configurer les DNS

### Déploiements automatiques

- ✅ Par défaut, chaque push sur la branche `main` déclenche un nouveau déploiement
- ✅ Les autres branches créent des "Preview Deployments"
- ✅ Vous pouvez désactiver cela dans **Settings** → **Git**

## 📝 Notes Importantes

- ✅ **Le code de base du MVP n'a PAS été modifié**
- ✅ La vidéo `public/Demo kova 2.mp4` est accessible publiquement
- ✅ Les variables d'environnement sont configurées dans Vercel, pas dans le code
- ✅ Le déploiement est automatique à chaque push sur `main`
- ✅ Vercel utilise HTTPS automatiquement

## 🐛 Résolution de Problèmes

### Erreur : "Build failed"

- Vérifiez les **Build Logs** dans Vercel
- Assurez-vous que `npm run build` fonctionne en local
- Vérifiez que toutes les dépendances sont dans `package.json`

### Erreur : "Environment variables missing"

- Allez dans **Settings** → **Environment Variables**
- Vérifiez que toutes les variables Supabase sont configurées
- Cliquez sur **"Redeploy"** après avoir ajouté les variables

### La vidéo ne se charge pas

- Vérifiez que `public/Demo kova 2.mp4` est bien dans le dépôt GitHub
- Vérifiez la taille du fichier (Vercel a une limite de 100MB pour les fichiers statiques)
- Si la vidéo est trop grande, considérez utiliser Supabase Storage

### Erreur Supabase

- Vérifiez que les variables d'environnement sont correctes
- Vérifiez que votre projet Supabase est actif
- Vérifiez que les tables sont créées dans Supabase

## 🎉 Félicitations !

Votre application KOVA est maintenant en ligne et accessible publiquement ! Partagez le lien avec vos utilisateurs.

## 📞 Support

- Documentation Vercel : [vercel.com/docs](https://vercel.com/docs)
- Documentation Next.js : [nextjs.org/docs](https://nextjs.org/docs)
- Support Vercel : [vercel.com/support](https://vercel.com/support)

