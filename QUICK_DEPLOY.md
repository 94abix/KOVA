# ⚡ Déploiement Rapide - Guide Express

## Option 1 : Méthode Automatique (Recommandée)

### Prérequis
- Python 3 installé
- Token GitHub (créer sur https://github.com/settings/tokens avec le scope `repo`)

### Étapes

```bash
cd /Users/bousri/Documents/KOVA/kova

# Installer PyGithub
pip3 install PyGithub

# Créer le dépôt et pousser le code
python3 create-github-repo.py VOTRE_TOKEN_GITHUB kova
```

C'est tout ! Le script créera le dépôt, poussera le code, et vous donnera les prochaines étapes.

## Option 2 : Méthode Manuelle (Simple)

### Étape 1 : Créer le dépôt GitHub
1. Allez sur https://github.com/new
2. Nom: `kova`
3. **Ne cochez PAS** "Initialize with README"
4. Cliquez sur "Create repository"

### Étape 2 : Pousser le code
```bash
cd /Users/bousri/Documents/KOVA/kova
./push-to-github.sh VOTRE_USERNAME kova
```

### Étape 3 : Déployer sur Vercel
1. Allez sur https://vercel.com
2. Cliquez sur "Import Project"
3. Sélectionnez le dépôt `kova`
4. Configurez les variables d'environnement Supabase
5. Cliquez sur "Deploy"

## Variables d'environnement à configurer dans Vercel

```
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anonyme
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service
```

## ✅ C'est tout !

Votre application sera en ligne en quelques minutes avec une URL comme `kova.vercel.app`

Pour plus de détails, consultez [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

