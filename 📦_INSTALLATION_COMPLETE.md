# 📦 Installation Complète - KOVA

## 🔍 Diagnostic

Vous n'avez pas :
- ❌ Homebrew (gestionnaire de paquets)
- ❌ Node.js/npm (runtime JavaScript)

## ✅ Solution : Installation en 2 étapes

### ÉTAPE 1 : Installer Homebrew (2 minutes)

Homebrew est nécessaire pour installer Node.js facilement.

**Copiez-collez cette commande dans Terminal :**

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Ce qui va se passer :**
1. Homebrew télécharge et installe
2. Il vous demandera votre mot de passe macOS
3. Installation prend 1-2 minutes
4. À la fin, il affichera des instructions pour ajouter Homebrew au PATH

**⚠️ Important :** Suivez les instructions à la fin de l'installation pour configurer le PATH.

**Vérifier l'installation :**
```bash
brew --version
```

Si ça affiche une version (ex: `Homebrew 4.x.x`), c'est bon ! ✅

---

### ÉTAPE 2 : Installer Node.js (1 minute)

Une fois Homebrew installé :

```bash
brew install node
```

**Vérifier l'installation :**
```bash
node --version   # Doit afficher v20.x ou v18.x
npm --version    # Doit afficher 9.x ou 10.x
```

---

### ÉTAPE 3 : Lancer KOVA

Maintenant que Node.js est installé :

```bash
cd ~/Desktop/kova
npm install      # Installation dépendances (1-2 min)
npm run dev      # Lancement serveur
```

Ouvrez : **http://localhost:3000**

---

## 🚀 Alternative : Installation Node.js SANS Homebrew

Si vous préférez ne pas installer Homebrew :

### Option 1 : Téléchargement direct (Recommandé)

1. Aller sur **https://nodejs.org/**
2. Cliquer sur **"Download Node.js (LTS)"**
3. Installer le fichier `.pkg` téléchargé
4. Redémarrer Terminal
5. Vérifier : `node --version` et `npm --version`

### Option 2 : Via nvm (Node Version Manager)

```bash
# Installer nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Recharger Terminal
source ~/.zshrc

# Installer Node.js LTS
nvm install --lts
nvm use --lts

# Vérifier
node --version
npm --version
```

---

## ✅ Checklist Installation

- [ ] Homebrew installé (`brew --version` fonctionne)
- [ ] Node.js installé (`node --version` fonctionne)
- [ ] npm installé (`npm --version` fonctionne)
- [ ] Dépendances installées (`npm install` dans le projet)
- [ ] Serveur lancé (`npm run dev`)
- [ ] Application accessible sur http://localhost:3000

---

## 🐛 Problèmes courants

### "brew: command not found" après installation

Ajoutez Homebrew au PATH :

```bash
# Pour Mac Intel
echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zshrc
eval "$(/usr/local/bin/brew shellenv)"

# Pour Mac Apple Silicon (M1/M2/M3)
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### "npm: command not found" après installation Node.js

1. Fermer et rouvrir Terminal
2. Vérifier : `echo $PATH`
3. Ajouter Node.js au PATH si nécessaire

### Port 3000 déjà utilisé

```bash
PORT=3001 npm run dev
```

---

## 📝 Résumé des Commandes

```bash
# 1. Installer Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Configurer PATH (selon instructions à la fin de l'install Homebrew)

# 3. Installer Node.js
brew install node

# 4. Lancer KOVA
cd ~/Desktop/kova
npm install
npm run dev
```

---

## 🎉 C'est Prêt !

Une fois tout installé, vous pourrez :
- ✅ Lancer KOVA avec `npm run dev`
- ✅ Tester la démonstration sur http://localhost:3000/demo
- ✅ Analyser des vidéos réelles sur /analyze

**Bon développement ! 🚀**

