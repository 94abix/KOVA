# ⚡ Démarrage Rapide KOVA

## 🎯 Méthode la Plus Simple

### 1. Ouvrir un Terminal

Ouvrez Terminal.app (ou iTerm) sur votre Mac.

### 2. Naviguer vers le projet

```bash
cd ~/Desktop/kova
```

### 3. Installer les dépendances (première fois seulement)

```bash
npm install
```

Si npm n'est pas trouvé, installez Node.js :
```bash
# Via Homebrew (recommandé)
brew install node

# Ou téléchargez depuis https://nodejs.org/
```

### 4. Lancer le serveur

```bash
npm run dev
```

### 5. Ouvrir dans le navigateur

```
http://localhost:3000
```

---

## 🎬 Pages à Visiter

1. **Page d'accueil** : http://localhost:3000
   - Cliquez sur "🎬 Voir la démonstration"

2. **Mode démonstration** : http://localhost:3000/demo
   - Fonctionne sans configuration Supabase
   - Données synthétiques interactives
   - Teste tous les composants

3. **Analyse réelle** : http://localhost:3000/analyze
   - Upload ou filme une vidéo
   - Analyse en temps réel

---

## ✅ Vérification

Si tout fonctionne, vous verrez :
- ✅ Page d'accueil avec 2 boutons
- ✅ Mode démo avec squelette animé
- ✅ Graphiques métriques
- ✅ Alertes santé

---

## 🐛 Si npm n'est pas trouvé

**Installer Node.js :**

```bash
# Option 1: Homebrew (le plus simple)
brew install node

# Option 2: nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.zshrc
nvm install --lts
nvm use --lts

# Option 3: Télécharger depuis https://nodejs.org/
```

**Vérifier l'installation :**

```bash
node --version  # Doit afficher v20.x ou v18.x
npm --version  # Doit afficher 9.x ou 10.x
```

---

## 📝 Commandes Utiles

```bash
npm run dev      # Développement (http://localhost:3000)
npm run build    # Build production
npm run test     # Lancer les tests
npm run seed     # Seed données de démo (nécessite Supabase)
```

---

## 🎉 C'est Prêt !

Une fois `npm run dev` lancé, ouvrez **http://localhost:3000** et explorez :
- `/` → Accueil
- `/demo` → Démonstration (recommandé pour commencer)
- `/analyze` → Analyse réelle

**Bon test ! 🚀**

