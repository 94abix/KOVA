#!/bin/bash
# Script interactif pour créer un dépôt GitHub et pousser le code

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║     🚀 Création Automatique du Dépôt GitHub pour KOVA           ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Vérifier que Python3 et PyGithub sont installés
if ! python3 -c "import github" 2>/dev/null; then
    echo "❌ PyGithub n'est pas installé."
    echo "📦 Installation de PyGithub..."
    pip3 install PyGithub --user
    if [ $? -ne 0 ]; then
        echo "❌ Erreur lors de l'installation de PyGithub"
        exit 1
    fi
fi

echo "✅ PyGithub est installé"
echo ""

# Demander le token GitHub
echo "📝 Pour créer un token GitHub :"
echo "   1. Allez sur : https://github.com/settings/tokens"
echo "   2. Cliquez sur 'Generate new token (classic)'"
echo "   3. Cochez le scope 'repo'"
echo "   4. Copiez le token (commence par ghp_)"
echo ""
read -sp "🔑 Entrez votre token GitHub: " GITHUB_TOKEN
echo ""

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Token non fourni. Abandon."
    exit 1
fi

# Demander le nom du dépôt
read -p "📦 Nom du dépôt (défaut: kova): " REPO_NAME
REPO_NAME=${REPO_NAME:-kova}

# Demander si le dépôt doit être privé
read -p "🔒 Dépôt privé ? (o/N): " IS_PRIVATE
PRIVATE_FLAG=""
if [[ "$IS_PRIVATE" =~ ^[Oo]$ ]]; then
    PRIVATE_FLAG="--private"
fi

# Demander la description
read -p "📝 Description (optionnel): " DESCRIPTION
if [ -z "$DESCRIPTION" ]; then
    DESCRIPTION="KOVA MVP - Application d'analyse biomécanique pour sports de combat"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Création du dépôt GitHub..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Exécuter le script Python
cd /Users/bousri/Documents/KOVA/kova

if [ -n "$DESCRIPTION" ] && [ "$DESCRIPTION" != "KOVA MVP - Application d'analyse biomécanique pour sports de combat" ]; then
    python3 create-github-repo.py "$GITHUB_TOKEN" "$REPO_NAME" "$DESCRIPTION" $PRIVATE_FLAG
else
    python3 create-github-repo.py "$GITHUB_TOKEN" "$REPO_NAME" $PRIVATE_FLAG
fi

if [ $? -eq 0 ]; then
    echo ""
    echo "╔══════════════════════════════════════════════════════════════════╗"
    echo "║                    ✅ DÉPLOIEMENT RÉUSSI !                        ║"
    echo "╚══════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "📝 Prochaines étapes :"
    echo "   1. Allez sur https://vercel.com"
    echo "   2. Connectez votre compte GitHub"
    echo "   3. Importez le dépôt '$REPO_NAME'"
    echo "   4. Configurez les variables d'environnement Supabase"
    echo "   5. Déployez !"
    echo ""
else
    echo ""
    echo "❌ Erreur lors de la création du dépôt"
    echo "💡 Vérifiez :"
    echo "   - Que votre token GitHub est valide"
    echo "   - Que le token a le scope 'repo'"
    echo "   - Que le nom du dépôt n'existe pas déjà"
    exit 1
fi

