#!/bin/bash

echo "🔍 Diagnostic KOVA - Recherche de Node.js/npm"
echo "=============================================="
echo ""

# Méthode 1: command -v
echo "1. Recherche avec 'command -v':"
if command -v npm &> /dev/null; then
  echo "   ✅ npm trouvé: $(which npm)"
  echo "   Version: $(npm --version)"
  echo "   Node: $(node --version)"
  exit 0
else
  echo "   ❌ npm non trouvé"
fi
echo ""

# Méthode 2: Chemins standards
echo "2. Recherche dans chemins standards:"
PATHS=(
  "/usr/local/bin/npm"
  "/opt/homebrew/bin/npm"
  "$HOME/.local/bin/npm"
  "/usr/bin/npm"
  "/bin/npm"
)

for path in "${PATHS[@]}"; do
  if [ -f "$path" ] && [ -x "$path" ]; then
    echo "   ✅ Trouvé: $path"
    $path --version
    exit 0
  fi
done
echo "   ❌ Aucun npm trouvé dans les chemins standards"
echo ""

# Méthode 3: nvm
echo "3. Recherche nvm (Node Version Manager):"
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  echo "   ✅ nvm.sh trouvé"
  source "$HOME/.nvm/nvm.sh"
  if command -v npm &> /dev/null; then
    echo "   ✅ npm trouvé via nvm: $(which npm)"
    npm --version
    node --version
    exit 0
  else
    echo "   ⚠️  nvm installé mais npm non chargé"
    echo "   💡 Essayez: source ~/.nvm/nvm.sh && nvm use node"
  fi
else
  echo "   ❌ nvm non trouvé"
fi
echo ""

# Méthode 4: fnm
echo "4. Recherche fnm (Fast Node Manager):"
if [ -s "$HOME/.fnm/env" ]; then
  echo "   ✅ fnm trouvé"
  eval "$($HOME/.fnm/env)"
  if command -v npm &> /dev/null; then
    echo "   ✅ npm trouvé via fnm: $(which npm)"
    npm --version
    exit 0
  fi
else
  echo "   ❌ fnm non trouvé"
fi
echo ""

# Méthode 5: Recherche récursive (limité)
echo "5. Recherche dans dossiers communs (premières occurrences):"
find ~ -name "npm" -type f 2>/dev/null | head -3 | while read path; do
  if [ -x "$path" ]; then
    echo "   📍 Trouvé: $path"
    "$path" --version 2>/dev/null && exit 0
  fi
done
echo ""

echo "════════════════════════════════════════════════"
echo "❌ Node.js/npm non trouvé automatiquement"
echo ""
echo "💡 Solutions:"
echo ""
echo "Option 1: Installer via Homebrew"
echo "   brew install node"
echo ""
echo "Option 2: Installer via nvm"
echo "   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
echo "   source ~/.zshrc"
echo "   nvm install --lts"
echo ""
echo "Option 3: Télécharger depuis nodejs.org"
echo "   https://nodejs.org/"
echo ""
echo "Après installation, relancez: ./start.sh"
echo "════════════════════════════════════════════════"

