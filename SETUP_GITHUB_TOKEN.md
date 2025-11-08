# 🔑 Créer un Token GitHub

Pour utiliser le script automatique, vous devez d'abord créer un token GitHub.

## Étapes pour créer un token GitHub

1. **Allez sur GitHub** : https://github.com/settings/tokens
2. **Cliquez sur "Generate new token"** → **"Generate new token (classic)"**
3. **Donnez un nom** au token (ex: "KOVA Deployment")
4. **Sélectionnez les scopes** :
   - ✅ **repo** (accès complet aux dépôts)
     - Cela inclut : repo:status, repo_deployment, public_repo, repo:invite, security_events
5. **Cliquez sur "Generate token"** en bas de la page
6. **COPIEZ LE TOKEN** (vous ne pourrez plus le voir après !)
   - Il commence par `ghp_` et fait environ 40 caractères

## Utiliser le token

Une fois que vous avez le token, exécutez :

```bash
cd /Users/bousri/Documents/KOVA/kova
python3 create-github-repo.py VOTRE_TOKEN_ICI kova
```

**Exemple** :
```bash
python3 create-github-repo.py ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx kova
```

## Sécurité

⚠️ **Important** : Ne partagez jamais votre token GitHub !
- Le token est comme un mot de passe
- Il vous donne accès à vos dépôts GitHub
- Si vous le commitez par erreur, révoquez-le immédiatement sur GitHub

## Alternative : Utiliser GitHub CLI

Si vous préférez, vous pouvez aussi utiliser GitHub CLI (`gh`) :

```bash
# Installer GitHub CLI
brew install gh

# Se connecter
gh auth login

# Créer le dépôt et pousser (si vous utilisez gh)
gh repo create kova --public --source=. --remote=origin --push
```

