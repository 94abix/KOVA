#!/bin/bash

echo "🔧 Installation de Node.js pour KOVA"
echo "====================================="
echo ""

# Vérifier si Homebrew est installé
if ! command -v brew &> /dev/null; then
  echo "❌ Homebrew n'est pas installé"
  echo ""
  echo "📦 Installation de Homebrew..."
  echo "   Copiez-collez cette commande dans Terminal :"
  echo ""
  echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
  echo ""
  echo "   Puis relancez ce script."
  exit 1
fi

echo "✅ Homebrew trouvé"
echo ""

# Vérifier si Node.js est déjà installé
if command -v node &> /dev/null; then
  echo "✅ Node.js est déjà installé"
  echo "   Version: $(node --version)"
  echo "   npm: $(npm --version)"
  echo ""
  echo "🎯 Vous pouvez maintenant lancer KOVA :"
  echo "   npm install"
  echo "   npm run dev"
  exit 0
fi

echo "📦 Installation de Node.js via Homebrew..."
echo "   Cela peut prendre quelques minutes..."
echo ""

# Installer Node.js
brew install node

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Node.js installé avec succès !"
  echo ""
  echo "📋 Versions installées :"
  node --version
  npm --version
  echo ""
  echo "🎯 Vous pouvez maintenant lancer KOVA :"
  echo "   cd ~/Desktop/kova"
  echo "   npm install"
  echo "   npm run dev"
else
  echo ""
  echo "❌ Erreur lors de l'installation"
  echo ""
  echo "💡 Essayez manuellement :"
  echo "   brew install node"
fi

