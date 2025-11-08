# 🔧 Configurer les Variables d'Environnement dans Vercel

Ce guide vous explique comment configurer les variables d'environnement Supabase dans Vercel.

## 📋 Variables à Configurer

Vous devez configurer ces 3 variables dans Vercel :

1. `NEXT_PUBLIC_SUPABASE_URL` - URL de votre projet Supabase
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Clé anonyme Supabase (publique)
3. `SUPABASE_SERVICE_ROLE_KEY` - Clé de service Supabase (privée)

## 🎯 Étapes Détaillées

### Étape 1 : Récupérer vos Variables Supabase

1. **Allez sur votre projet Supabase** : https://supabase.com/dashboard
2. **Sélectionnez votre projet** (ou créez-en un si vous n'en avez pas)
3. **Allez dans Settings** → **API**
4. **Notez ces valeurs** :
   - **Project URL** → C'est votre `NEXT_PUBLIC_SUPABASE_URL`
     - Exemple : `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public** key → C'est votre `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - Exemple : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role secret** key → C'est votre `SUPABASE_SERVICE_ROLE_KEY`
     - ⚠️ **IMPORTANT** : Cette clé est secrète, ne la partagez jamais !
     - Exemple : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Étape 2 : Configurer dans Vercel

1. **Allez sur Vercel** : https://vercel.com
2. **Connectez-vous** avec votre compte GitHub
3. **Sélectionnez votre projet** (ou importez-le si pas encore fait)
4. **Allez dans Settings** (en haut de la page)
5. **Cliquez sur "Environment Variables"** (dans le menu de gauche)
6. **Ajoutez les 3 variables** une par une :

#### Variable 1 : NEXT_PUBLIC_SUPABASE_URL

1. Cliquez sur **"Add New"**
2. **Key** : `NEXT_PUBLIC_SUPABASE_URL`
3. **Value** : Collez votre URL Supabase (ex: `https://xxxxxxxxxxxxx.supabase.co`)
4. **Environments** : Cochez toutes les cases :
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Cliquez sur **"Save"**

#### Variable 2 : NEXT_PUBLIC_SUPABASE_ANON_KEY

1. Cliquez sur **"Add New"**
2. **Key** : `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Value** : Collez votre clé anonyme Supabase
4. **Environments** : Cochez toutes les cases :
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Cliquez sur **"Save"**

#### Variable 3 : SUPABASE_SERVICE_ROLE_KEY

1. Cliquez sur **"Add New"**
2. **Key** : `SUPABASE_SERVICE_ROLE_KEY`
3. **Value** : Collez votre clé de service Supabase
   - ⚠️ **ATTENTION** : Cette clé est secrète, ne la partagez jamais !
4. **Environments** : Cochez toutes les cases :
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Cliquez sur **"Save"**

### Étape 3 : Redéployer l'Application

Une fois toutes les variables configurées :

1. **Allez dans "Deployments"** (dans le menu de gauche)
2. **Trouvez le dernier déploiement**
3. **Cliquez sur les 3 points** (⋯) à droite
4. **Cliquez sur "Redeploy"**
5. **Attendez que le déploiement se termine** (2-3 minutes)

## ✅ Vérification

Après le redéploiement, vérifiez que :

1. ✅ Le déploiement a réussi (statut "Ready")
2. ✅ L'application se charge correctement
3. ✅ Les fonctionnalités Supabase fonctionnent (si testées)

## 🐛 Résolution de Problèmes

### Erreur : "Environment variables missing"

- Vérifiez que vous avez bien ajouté les 3 variables
- Vérifiez que vous avez coché toutes les cases (Production, Preview, Development)
- Redéployez l'application après avoir ajouté les variables

### Erreur : "Invalid Supabase URL"

- Vérifiez que l'URL commence par `https://` et se termine par `.supabase.co`
- Vérifiez qu'il n'y a pas d'espaces avant ou après l'URL
- Vérifiez que l'URL est correcte dans votre dashboard Supabase

### Erreur : "Invalid API key"

- Vérifiez que vous avez copié la clé complète (elles sont très longues)
- Vérifiez que vous n'avez pas d'espaces avant ou après la clé
- Vérifiez que vous utilisez la bonne clé (anon pour NEXT_PUBLIC_SUPABASE_ANON_KEY)

### Les variables ne sont pas prises en compte

- Redéployez l'application après avoir ajouté les variables
- Vérifiez que vous avez bien enregistré les variables (cliquez sur "Save")
- Vérifiez que vous avez coché les bonnes cases (Production, Preview, Development)

## 📝 Exemple de Configuration

Voici à quoi devrait ressembler votre configuration dans Vercel :

```
Environment Variables:
├── NEXT_PUBLIC_SUPABASE_URL
│   └── Value: https://xxxxxxxxxxxxx.supabase.co
│   └── Environments: Production, Preview, Development
├── NEXT_PUBLIC_SUPABASE_ANON_KEY
│   └── Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
│   └── Environments: Production, Preview, Development
└── SUPABASE_SERVICE_ROLE_KEY
    └── Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    └── Environments: Production, Preview, Development
```

## 🔒 Sécurité

⚠️ **Important** :
- Ne partagez jamais vos clés Supabase
- Ne commitez jamais vos clés dans Git (elles sont dans `.gitignore`)
- La clé `SUPABASE_SERVICE_ROLE_KEY` est particulièrement sensible
- Utilisez des variables d'environnement pour stocker vos clés
- Vercel chiffre automatiquement les variables d'environnement

## 📚 Ressources

- Documentation Vercel : https://vercel.com/docs/environment-variables
- Documentation Supabase : https://supabase.com/docs/guides/api
- Support Vercel : https://vercel.com/support

