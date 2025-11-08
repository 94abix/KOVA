# ❌ Erreur Résolue : npm non trouvé

## 🔍 Problème identifié

Vous avez eu cette erreur :
```
zsh: command not found: npm
```

**Cause** : Node.js/npm n'est pas installé sur votre Mac.

## ✅ Solution : Installer Node.js

### Méthode 1 : Via Homebrew (Recommandé)

**Étape 1 : Vérifier si Homebrew est installé**
```bash
brew --version
```

Si ça affiche une version, Homebrew est installé. Sinon, installez-le d'abord :
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Étape 2 : Installer Node.js**
```bash
brew install node
```

Cela installera Node.js ET npm automatiquement.

**Étape 3 : Vérifier l'installation**
```bash
node --version   # Doit afficher v20.x ou v18.x
npm --version    # Doit afficher 9.x ou 10.x
```

### Méthode 2 : Script automatique

J'ai créé un script pour vous :

```bash
cd ~/Desktop/kova
./INSTALL_NODE.sh
```

Le script vérifie Homebrew et installe Node.js automatiquement.

### Méthode 3 : Téléchargement direct

Si Homebrew ne fonctionne pas :

1. Aller sur https://nodejs.org/
2. Télécharger la version **LTS** (Long Term Support)
3. Installer le fichier `.pkg` téléchargé
4. Redémarrer Terminal

---

## 🎯 Après installation de Node.js

Une fois Node.js installé, lancez KOVA :

```bash
cd ~/Desktop/kova
npm install        # Installation des dépendances (1-2 min)
npm run dev        # Lancement du serveur
```

Puis ouvrez : **http://localhost:3000**

---

## 📝 Note importante

**❌ Mauvaise commande :** `install node`  
**✅ Bonne commande :** `brew install node`

La commande `install` est une commande système Unix, pas pour installer des logiciels. Pour installer des logiciels, utilisez :
- `brew install` (via Homebrew)
- Ou téléchargez depuis le site officiel

---

## ✅ Vérification rapide

Testez si tout fonctionne :

```bash
# Vérifier Node.js
node --version

# Vérifier npm
npm --version

# Si les deux fonctionnent, vous êtes prêt !
```

---

**Une fois Node.js installé, relancez : `./LANCER_MAINTENANT.sh`** 🚀

