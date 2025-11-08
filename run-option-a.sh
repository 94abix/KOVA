#!/bin/bash
# Script pour exécuter l'Option A automatiquement

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║           🚀 OPTION A - Création Automatique GitHub              ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Vérifier PyGithub
if ! python3 -c "import github" 2>/dev/null; then
    echo "📦 Installation de PyGithub..."
    pip3 install PyGithub --user
fi

echo "✅ PyGithub est installé"
echo ""

# Ouvrir la page GitHub pour créer un token
echo "📝 Étape 1 : Créer un token GitHub"
echo "   Une page va s'ouvrir dans votre navigateur..."
echo ""

# Détecter le système d'exploitation et ouvrir le navigateur
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "https://github.com/settings/tokens/new?scopes=repo&description=KOVA%20Deployment" 2>/dev/null || echo "⚠️  Ouvrez manuellement : https://github.com/settings/tokens/new?scopes=repo&description=KOVA%20Deployment"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open "https://github.com/settings/tokens/new?scopes=repo&description=KOVA%20Deployment" 2>/dev/null || echo "⚠️  Ouvrez manuellement : https://github.com/settings/tokens/new?scopes=repo&description=KOVA%20Deployment"
else
    echo "⚠️  Ouvrez manuellement : https://github.com/settings/tokens/new?scopes=repo&description=KOVA%20Deployment"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Instructions :"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Donnez un nom au token (ex: 'KOVA Deployment')"
echo "2. Cochez le scope 'repo' (accès complet aux dépôts)"
echo "3. Faites défiler et cliquez sur 'Generate token'"
echo "4. COPIEZ LE TOKEN (il commence par 'ghp_' et fait ~40 caractères)"
echo "   ⚠️  Vous ne pourrez plus le voir après !"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Attendre que l'utilisateur entre le token
read -sp "🔑 Collez votre token GitHub ici: " GITHUB_TOKEN
echo ""

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Token non fourni. Abandon."
    exit 1
fi

# Demander le nom du dépôt
echo ""
read -p "📦 Nom du dépôt (défaut: kova): " REPO_NAME
REPO_NAME=${REPO_NAME:-kova}

# Demander si privé
read -p "🔒 Dépôt privé ? (o/N): " IS_PRIVATE
PRIVATE_FLAG=""
if [[ "$IS_PRIVATE" =~ ^[Oo]$ ]]; then
    PRIVATE_FLAG="--private"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Création du dépôt GitHub et poussage du code..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Aller dans le répertoire du projet
cd /Users/bousri/Documents/KOVA/kova

# Exécuter le script Python
python3 create-github-repo.py "$GITHUB_TOKEN" "$REPO_NAME" "KOVA MVP - Application d'analyse biomécanique pour sports de combat" $PRIVATE_FLAG

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo ""
    echo "╔══════════════════════════════════════════════════════════════════╗"
    echo "║                    ✅ SUCCÈS !                                    ║"
    echo "╚══════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "🎉 Votre dépôt GitHub a été créé et le code a été poussé !"
    echo ""
    echo "📝 Prochaines étapes :"
    echo "   1. Allez sur https://vercel.com"
    echo "   2. Connectez votre compte GitHub"
    echo "   3. Importez le dépôt '$REPO_NAME'"
    echo "   4. Configurez les variables d'environnement Supabase :"
    echo "      - NEXT_PUBLIC_SUPABASE_URL"
    echo "      - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "      - SUPABASE_SERVICE_ROLE_KEY"
    echo "   5. Cliquez sur 'Deploy'"
    echo ""
    echo "🌐 Votre application sera en ligne en quelques minutes !"
    echo ""
else
    echo ""
    echo "❌ Erreur lors de la création du dépôt"
    echo ""
    echo "💡 Vérifiez :"
    echo "   - Que votre token GitHub est valide et commence par 'ghp_'"
    echo "   - Que le token a le scope 'repo'"
    echo "   - Que le nom du dépôt '$REPO_NAME' n'existe pas déjà"
    echo "   - Que vous êtes connecté à Internet"
    echo ""
    exit 1
fi

