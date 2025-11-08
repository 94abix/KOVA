#!/bin/bash
# Script pour pousser le code sur GitHub
# Usage: ./push-to-github.sh GITHUB_USERNAME REPO_NAME

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 GITHUB_USERNAME REPO_NAME"
    echo "Exemple: $0 mon-username kova"
    exit 1
fi

GITHUB_USERNAME=$1
REPO_NAME=$2

echo "🔗 Ajout du remote GitHub..."
git remote add origin https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git 2>/dev/null || git remote set-url origin https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git

echo " branch main..."
git branch -M main

echo "🚀 Poussage du code sur GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Code poussé avec succès sur GitHub!"
    echo "🌐 Vous pouvez maintenant aller sur Vercel et connecter ce dépôt"
else
    echo "❌ Erreur lors du push. Vérifiez que:"
    echo "   1. Le dépôt GitHub existe bien"
    echo "   2. Vous avez les permissions d'écriture"
    echo "   3. Vous êtes authentifié (git config --global user.name et user.email)"
fi
