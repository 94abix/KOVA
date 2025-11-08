#!/bin/bash

echo "🔧 Configuration de Homebrew dans le PATH"
echo "=========================================="
echo ""

# Ajouter Homebrew au PATH pour cette session
export PATH="/opt/homebrew/bin:$PATH"

# Vérifier si brew fonctionne maintenant
if command -v brew &> /dev/null; then
  echo "✅ Homebrew est maintenant disponible !"
  echo "   Version: $(brew --version | head -1)"
  echo ""
  
  # Ajouter au fichier de configuration pour les sessions futures
  echo "📝 Ajout de Homebrew au PATH permanent..."
  
  if ! grep -q 'eval "$(/opt/homebrew/bin/brew shellenv)"' ~/.zprofile 2>/dev/null; then
    echo >> ~/.zprofile
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
    echo "✅ Ajouté à ~/.zprofile"
  else
    echo "✅ Déjà configuré dans ~/.zprofile"
  fi
  
  echo ""
  echo "📦 Installation de Node.js..."
  brew install node
  
  if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Node.js installé avec succès !"
    echo ""
    echo "📋 Versions :"
    node --version
    npm --version
    echo ""
    echo "🎯 Vous pouvez maintenant lancer KOVA :"
    echo "   cd ~/Desktop/kova"
    echo "   npm install"
    echo "   npm run dev"
  else
    echo "❌ Erreur lors de l'installation de Node.js"
  fi
else
  echo "❌ Homebrew non trouvé dans /opt/homebrew/bin"
  echo ""
  echo "💡 Essayez manuellement :"
  echo "   export PATH=\"/opt/homebrew/bin:\$PATH\""
  echo "   brew install node"
fi

