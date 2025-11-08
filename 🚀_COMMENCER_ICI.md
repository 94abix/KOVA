# 🚀 Lancer KOVA - Instructions Finales

## ⚠️ Node.js/npm n'est pas installé ou non accessible

Pour lancer KOVA, vous devez d'abord installer Node.js sur votre Mac.

---

## 📦 Installation de Node.js (2 minutes)

### Option 1 : Homebrew (Recommandé - le plus simple)

```bash
# Si vous avez Homebrew installé
brew install node

# Vérifier l'installation
node --version   # Doit afficher v20.x ou v18.x
npm --version    # Doit afficher 9.x ou 10.x
```

### Option 2 : nvm (Node Version Manager)

```bash
# Installer nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Recharger le terminal
source ~/.zshrc

# Installer Node.js LTS
nvm install --lts
nvm use --lts

# Vérifier
node --version
npm --version
```

### Option 3 : Téléchargement direct

1. Aller sur https://nodejs.org/
2. Télécharger la version LTS (Long Term Support)
3. Installer le .pkg téléchargé
4. Redémarrer le Terminal

---

## 🎯 Une fois Node.js installé

### 1. Ouvrir Terminal.app

### 2. Aller dans le projet

```bash
cd ~/Desktop/kova
```

### 3. Installer les dépendances (première fois seulement)

```bash
npm install
```

Cela prendra 1-2 minutes la première fois.

### 4. Lancer le serveur

```bash
npm run dev
```

Vous verrez :
```
▲ Next.js 14.1.0
- Local:        http://localhost:3000
- Ready in 2.3s
```

### 5. Ouvrir dans le navigateur

```
http://localhost:3000
```

---

## 🎬 Parcours de Démonstration

### Étape 1 : Page d'accueil
- Vous verrez "Transforme chaque mouvement en progrès"
- **Cliquez sur "🎬 Voir la démonstration"**

### Étape 2 : Mode démonstration (`/demo`)
- Squelette animé interactif
- Boutons play/pause fonctionnels
- Graphiques métriques avec tabs
- Alertes santé affichées
- **Pas besoin de Supabase configuré !**

### Étape 3 : Analyse réelle (`/analyze`)
- Upload ou filme une vidéo
- Analyse en temps réel
- Résultats complets

---

## ✅ Vérification

Si tout fonctionne correctement, vous verrez :

- ✅ Page d'accueil avec design dark mode
- ✅ Mode démo avec squelette animé
- ✅ Graphiques Recharts fonctionnels
- ✅ Alertes santé colorées
- ✅ Interface responsive

---

## 🐛 Dépannage

### Port 3000 déjà utilisé
```bash
PORT=3001 npm run dev
```

### Erreurs lors de npm install
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### npm toujours non trouvé après installation
```bash
# Vérifier le PATH
echo $PATH

# Ajouter Node.js au PATH si nécessaire
export PATH="/usr/local/bin:$PATH"
# Ou pour Homebrew
export PATH="/opt/homebrew/bin:$PATH"
```

---

## 📝 Commandes Utiles

```bash
npm run dev      # Développement (http://localhost:3000)
npm run build    # Build production
npm run test     # Lancer les tests
npm run lint     # Vérifier le code
```

---

## 🎉 C'est Prêt !

Une fois Node.js installé et `npm run dev` lancé, l'application sera accessible sur **http://localhost:3000**.

**Bon développement ! 🚀**

