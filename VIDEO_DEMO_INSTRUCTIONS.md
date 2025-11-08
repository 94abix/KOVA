# 📹 Instructions pour ajouter votre vidéo personnelle

## Méthode 1 : Ajouter directement dans le projet (Recommandé)

### Étape 1 : Placer la vidéo dans le projet

1. **Copiez votre vidéo** dans le dossier `public` du projet :
   ```
   /Users/bousri/Desktop/kova/public/demo-video.mp4
   ```

2. **Formats supportés** : MP4, WebM, MOV

3. **Nom de fichier** : Utilisez exactement `demo-video.mp4` (ou modifiez le code si vous voulez un autre nom)

### Étape 2 : Redémarrer le serveur

Le serveur Next.js devrait détecter automatiquement le nouveau fichier. Sinon :
```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez :
npm run dev
```

---

## Méthode 2 : Utiliser l'interface d'upload (Analyse réelle)

Au lieu de modifier la démo, vous pouvez utiliser la page d'analyse réelle :

1. Allez sur **http://localhost:3000/analyze**
2. Cliquez sur **"Sélectionner un fichier"** ou drag & drop
3. Sélectionnez votre vidéo (max 15s)
4. L'analyse se lancera automatiquement avec votre vidéo

---

## Méthode 3 : Me donner le chemin de votre vidéo

Si votre vidéo est déjà sur votre Mac, donnez-moi le chemin complet et je modifierai le code pour l'utiliser.

Exemple : `/Users/bousri/Desktop/ma-video.mp4`

---

## 📝 Notes importantes

- **Durée recommandée** : 5-15 secondes pour une analyse rapide
- **Qualité** : 720p minimum, bon éclairage
- **Contenu** : Personne visible en entier (corps complet)
- **Format** : MP4 est le plus compatible

---

**Une fois la vidéo ajoutée dans `public/demo-video.mp4`, je peux modifier le code pour l'utiliser automatiquement !**

