#!/bin/bash
echo "🚀 Tentative de lancement de KOVA..."
echo ""

# Chercher npm
if command -v npm &> /dev/null; then
  echo "✅ npm trouvé"
  cd ~/Desktop/kova
  
  if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
  fi
  
  echo "🎯 Lancement du serveur..."
  echo "🌐 Ouvrez http://localhost:3000 dans votre navigateur"
  echo ""
  npm run dev
else
  echo "❌ npm non trouvé"
  echo ""
  echo "Installez Node.js d'abord :"
  echo "  brew install node"
  echo ""
  echo "Puis relancez ce script."
fi
