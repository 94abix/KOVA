#!/bin/bash

echo "🔧 Correction des problèmes KOVA"
echo "================================="
echo ""

cd ~/Desktop/kova

# 1. Nettoyer les installations précédentes
echo "🧹 Nettoyage..."
rm -rf node_modules package-lock.json .next
echo "✅ Nettoyage terminé"
echo ""

# 2. Vérifier npm
if ! command -v npm &> /dev/null; then
  echo "❌ npm non trouvé"
  echo "   Configurez Homebrew :"
  echo "   eval \"\$(/opt/homebrew/bin/brew shellenv)\""
  exit 1
fi

echo "✅ npm disponible"
echo "   Version: $(npm --version)"
echo ""

# 3. Installer les dépendances (sans commentaire)
echo "📦 Installation des dépendances..."
echo "   Cela prend 1-2 minutes..."
npm install

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Erreur lors de l'installation"
  echo ""
  echo "💡 Essayez :"
  echo "   npm cache clean --force"
  echo "   npm install"
  exit 1
fi

echo ""
echo "✅ Dépendances installées !"
echo ""

# 4. Vérifier que Next.js est installé
if [ ! -f "node_modules/.bin/next" ]; then
  echo "❌ Next.js non trouvé après installation"
  exit 1
fi

echo "✅ Next.js installé"
echo ""

# 5. Lancer le serveur
echo "🚀 Lancement du serveur..."
echo "🌐 Ouvrez http://localhost:3000 dans votre navigateur"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter"
echo ""

npm run dev

