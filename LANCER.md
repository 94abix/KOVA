# 🚀 Lancer KOVA

## Méthode 1 : Script automatique (recommandé)

```bash
cd /Users/bousri/Desktop/kova
./start.sh
```

Le script détecte automatiquement npm et lance le serveur.

## Méthode 2 : Manuel

### 1. Installer les dépendances (si pas déjà fait)

```bash
cd /Users/bousri/Desktop/kova
npm install
```

### 2. Lancer le serveur

```bash
npm run dev
```

### 3. Ouvrir dans le navigateur

```
http://localhost:3000
```

## Si npm n'est pas trouvé

### Installation Node.js/npm

**Option A : Via Homebrew**
```bash
brew install node
```

**Option B : Via nvm (Node Version Manager)**
```bash
# Installer nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Recharger le shell
source ~/.zshrc  # ou ~/.bashrc

# Installer Node.js
nvm install --lts
nvm use --lts
```

**Option C : Téléchargement direct**
- Aller sur https://nodejs.org/
- Télécharger et installer Node.js LTS

## Vérification

```bash
node --version   # Doit afficher v20.x ou v18.x
npm --version    # Doit afficher 9.x ou 10.x
```

## Pages disponibles

- **/** - Page d'accueil
- **/demo** - Démonstration interactive (pas besoin de Supabase)
- **/analyze** - Analyse réelle (nécessite vidéo)
- **/sessions** - Historique (nécessite Supabase configuré)

## Dépannage

### Port 3000 déjà utilisé
```bash
# Changer le port dans package.json ou utiliser:
PORT=3001 npm run dev
```

### Erreurs TypeScript
Les erreurs de type avant `npm install` sont normales. Installer d'abord les dépendances.

### Erreurs Supabase
Pour tester sans Supabase, utilisez la page `/demo` qui fonctionne avec des données mock.

---

**Bon démarrage ! 🎉**

