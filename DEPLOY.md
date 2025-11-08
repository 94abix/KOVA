# Instructions de déploiement sur Vercel

## Étape 1: Créer un dépôt GitHub

1. Allez sur [github.com](https://github.com) et connectez-vous (ou créez un compte)
2. Cliquez sur le bouton "+" en haut à droite, puis "New repository"
3. Donnez un nom au dépôt (ex: `kova` ou `kova-mvp`)
4. Choisissez **Public** ou **Private** selon vos préférences
5. **NE PAS** cocher "Initialize this repository with a README" (le repo local existe déjà)
6. Cliquez sur "Create repository"

## Étape 2: Pousser le code sur GitHub

Une fois le dépôt créé, GitHub vous donnera les instructions. Exécutez ces commandes dans le terminal :

```bash
cd /Users/bousri/Documents/KOVA/kova
git remote add origin https://github.com/VOTRE_USERNAME/VOTRE_REPO.git
git branch -M main
git push -u origin main
```

**Remplacez `VOTRE_USERNAME` et `VOTRE_REPO` par vos valeurs réelles.**

## Étape 3: Créer un compte Vercel et déployer

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "Sign Up" et connectez-vous avec votre compte GitHub
3. Cliquez sur "Add New..." puis "Project"
4. Sélectionnez le dépôt GitHub que vous venez de créer
5. Vercel détectera automatiquement que c'est un projet Next.js
6. Cliquez sur "Deploy" (vous pourrez configurer les variables d'environnement après)

## Étape 4: Configurer les variables d'environnement Supabase

1. Dans le dashboard Vercel, allez dans votre projet
2. Cliquez sur "Settings" > "Environment Variables"
3. Ajoutez ces 3 variables (remplacez par vos valeurs réelles de Supabase) :
   - `NEXT_PUBLIC_SUPABASE_URL` = votre URL Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = votre clé anonyme Supabase
   - `SUPABASE_SERVICE_ROLE_KEY` = votre clé de service Supabase
4. Sélectionnez "Production", "Preview", et "Development" pour chaque variable
5. Cliquez sur "Save"
6. Allez dans "Deployments" et cliquez sur "Redeploy" sur le dernier déploiement

## Étape 5: Tester l'application

Une fois le déploiement terminé, vous recevrez une URL (ex: `kova.vercel.app`). 
Testez l'application pour vérifier :
- ✅ La page d'accueil se charge
- ✅ La vidéo de démonstration se charge
- ✅ Les fonctionnalités principales fonctionnent

## Notes importantes

- Le code de base du MVP n'a **pas été modifié**
- La vidéo `public/Demo kova 2.mp4` sera accessible publiquement
- Les variables d'environnement doivent être configurées dans Vercel, pas dans le code
- Chaque push sur la branche `main` déclenchera un nouveau déploiement automatique

