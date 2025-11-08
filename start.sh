#!/bin/bash

# Script de démarrage KOVA
# Détecte automatiquement npm et lance le serveur

echo "🚀 Démarrage de KOVA..."

# Chercher npm dans les chemins communs
NPM_PATHS=(
  "/usr/local/bin/npm"
  "/opt/homebrew/bin/npm"
  "$HOME/.nvm/versions/node/*/bin/npm"
  "$HOME/.fnm/node-versions/*/installation/bin/npm"
)

NPM_CMD=""

# Essayer avec nvm
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  echo "📦 Détection de nvm..."
  source "$HOME/.nvm/nvm.sh"
  nvm use default 2>/dev/null || nvm use node 2>/dev/null
  if command -v npm &> /dev/null; then
    NPM_CMD=$(which npm)
    echo "✅ npm trouvé via nvm: $NPM_CMD"
  fi
fi

# Essayer avec fnm
if [ -z "$NPM_CMD" ] && [ -s "$HOME/.fnm/env" ]; then
  echo "📦 Détection de fnm..."
  eval "$($HOME/.fnm/env)"
  if command -v npm &> /dev/null; then
    NPM_CMD=$(which npm)
    echo "✅ npm trouvé via fnm: $NPM_CMD"
  fi
fi

# Chercher dans les chemins standards
if [ -z "$NPM_CMD" ]; then
  for path in "${NPM_PATHS[@]}"; do
    if [ -f "$path" ]; then
      NPM_CMD="$path"
      echo "✅ npm trouvé: $NPM_CMD"
      break
    fi
  done
fi

# Essayer avec command -v en dernier recours
if [ -z "$NPM_CMD" ] && command -v npm &> /dev/null; then
  NPM_CMD=$(which npm)
  echo "✅ npm trouvé: $NPM_CMD"
fi

if [ -z "$NPM_CMD" ]; then
  echo "❌ npm non trouvé !"
  echo ""
  echo "Veuillez installer Node.js et npm :"
  echo "  - Via Homebrew: brew install node"
  echo "  - Via nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
  echo "  - Télécharger depuis: https://nodejs.org/"
  exit 1
fi

# Vérifier version
echo ""
echo "📋 Version npm: $($NPM_CMD --version)"
echo "📋 Version node: $($NPM_CMD exec -- node --version)"
echo ""

# Aller dans le répertoire
cd "$(dirname "$0")"

# Vérifier si node_modules existe
if [ ! -d "node_modules" ]; then
  echo "📦 Installation des dépendances..."
  $NPM_CMD install
  if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation"
    exit 1
  fi
  echo "✅ Dépendances installées"
  echo ""
fi

# Lancer le serveur
echo "🎯 Lancement du serveur de développement..."
echo "🌐 Ouvrez http://localhost:3000 dans votre navigateur"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

$NPM_CMD run dev

