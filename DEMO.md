# 🎬 Guide de Démonstration KOVA

## 🚀 Démonstration Rapide

### 1. Installation des dépendances

```bash
cd /Users/bousri/Desktop/kova
npm install
```

### 2. Mode Démonstration (sans Supabase)

Pour tester rapidement sans configurer Supabase, l'application fonctionne en mode démonstration avec des données mock.

**Important** : Les fonctionnalités de sauvegarde nécessitent Supabase. Pour une démo complète :

1. Créer un compte Supabase gratuit sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Exécuter le SQL de `supabase/schema.sql`
4. Créer le bucket `videos` dans Storage
5. Copier les clés dans `.env.local`

### 3. Lancer l'application

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 📋 Parcours de Démonstration

### Étape 1 : Page d'accueil (`/`)

- **Hero section** : "Transforme chaque mouvement en progrès"
- **CTA** : Bouton "Analyser une vidéo" → redirige vers `/analyze`

### Étape 2 : Analyse (`/analyze`)

**Option A - Upload vidéo :**
1. Cliquer sur "Sélectionner un fichier" ou drag & drop
2. Sélectionner une vidéo de mouvement (max 15s, MP4/WebM)
3. Prévisualiser la vidéo
4. Cliquer sur "Lancer l'analyse"

**Option B - Filmer :**
1. Cliquer sur "Filmer"
2. Autoriser l'accès caméra
3. Enregistrer un mouvement (max 15s)
4. L'analyse se lance automatiquement

**Pendant l'analyse :**
- Barre de progression affichée
- Le modèle MoveNet charge (~2-3s première fois)
- Extraction des keypoints frame par frame
- Calcul des métriques en temps réel

**Résultats :**
- **Vidéo avec overlay squelette** : Squelette animé sur la vidéo
- **Métriques** : Graphiques angles, asymétrie, cadence
- **Alertes santé** : Liste des points d'attention détectés

### Étape 3 : Partage Coach

1. Cliquer sur "Partager au coach"
2. Générer le lien magique
3. Copier le lien (valide 14 jours)
4. Ouvrir dans navigation privée pour voir la vue coach

### Étape 4 : Historique (`/sessions`)

- Liste de toutes les sessions sauvegardées
- Tri par date (plus récent en premier)
- Badge avec nombre d'alertes
- Clic sur une session → détail complet

## 🎯 Points de Démonstration Clés

### ✅ Fonctionnalités à montrer

1. **Upload/Capture** : Flux intuitif, validation automatique
2. **Analyse en temps réel** : Barre de progression, feedback visuel
3. **Visualisation squelette** : Overlay précis, heat map des keypoints
4. **Graphiques métriques** : Tabs interactifs, données précises
5. **Alertes intelligentes** : Détection automatique, recommandations
6. **Partage sécurisé** : Lien magique, expiration, révocation
7. **Historique** : Sauvegarde persistante, accès rapide

### 🎨 Design Highlights

- **Dark mode** : Interface sobre et professionnelle
- **Palette** : Noir/anthracite + accent rouge (#C01C27)
- **Animations** : Transitions fluides, feedback utilisateur
- **Responsive** : Fonctionne sur mobile, tablette, desktop

### ⚡ Performance

- **Chargement modèle** : ~2-3s (cache ensuite)
- **Analyse 10s vidéo** : ~30-60s selon puissance machine
- **Affichage résultats** : Instantané

## 🧪 Tests à Effectuer

### Test 1 : Upload vidéo
- [ ] Uploader une vidéo de shadow-boxing
- [ ] Vérifier prévisualisation
- [ ] Lancer analyse
- [ ] Vérifier résultats (angles, alertes)

### Test 2 : Capture caméra
- [ ] Autoriser caméra
- [ ] Filmer 5s de mouvement
- [ ] Vérifier analyse automatique
- [ ] Vérifier sauvegarde session

### Test 3 : Métriques
- [ ] Vérifier graphiques angles
- [ ] Vérifier graphique asymétrie
- [ ] Vérifier cadence
- [ ] Vérifier résumé

### Test 4 : Alertes
- [ ] Vérifier détection valgus genou
- [ ] Vérifier détection asymétrie
- [ ] Vérifier détection posture
- [ ] Vérifier recommandations

### Test 5 : Partage
- [ ] Générer lien coach
- [ ] Copier lien
- [ ] Ouvrir en navigation privée
- [ ] Vérifier vue lecture seule

### Test 6 : Historique
- [ ] Accéder à `/sessions`
- [ ] Voir liste sessions
- [ ] Cliquer sur une session
- [ ] Vérifier détails complets

## 📊 Données de Test

Pour tester avec des données réalistes :

```bash
npm run seed
```

Crée une session de démonstration avec :
- Métriques fictives réalistes
- Alertes variées (info, attention, risque)
- Angles et asymétries calculées

## 🐛 Debug Mode

Pour voir les détails d'exécution :

1. Ouvrir DevTools (F12)
2. Console : logs d'analyse, erreurs éventuelles
3. Network : vérifier appels API Supabase
4. Performance : temps d'analyse par frame

## 📝 Script de Démonstration Automatique

Un script de démo automatique pourrait :
1. Charger une vidéo pré-enregistrée
2. Lancer l'analyse automatiquement
3. Afficher les résultats avec explications
4. Montrer le partage coach

## 🎬 Vidéo de Démonstration Recommandée

Pour une démo optimale, utiliser :
- **Durée** : 8-12 secondes
- **Contenu** : Shadow-boxing, frappes, mouvements dynamiques
- **Qualité** : 720p minimum, bon éclairage
- **Format** : MP4 ou WebM
- **Pose claire** : Visibilité complète du corps

## ⚠️ Notes Importantes

- **Première analyse** : Le modèle prend 2-3s à charger
- **Caméra** : Nécessite HTTPS en production (HTTP OK pour localhost)
- **Supabase** : Requis pour sauvegarde et partage
- **Navigateur** : Chrome/Edge recommandés (meilleure compatibilité TensorFlow.js)

---

**Prêt pour la démonstration ! 🚀**

