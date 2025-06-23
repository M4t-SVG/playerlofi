# PlayerLofi - Lecteur de Musique Minimaliste

Un lecteur de musique web simple et élégant qui permet d'écouter des flux audio YouTube sans charger les vidéos.

## 🎵 Fonctionnalités

- **Interface minimaliste** : Design moderne et épuré
- **Lecture audio uniquement** : Pas de vidéo chargée, seulement l'audio
- **Contrôles simples** : Play, pause, stop et contrôle du volume
- **Flux prédéfinis** : Musique relaxante et lofi
- **Responsive** : Compatible mobile et desktop
- **Raccourcis clavier** : Espace pour play/pause, Ctrl+S pour stop

## 🚀 Utilisation

1. Ouvrez `index.html` dans votre navigateur
2. Sélectionnez un flux de musique dans la liste
3. Utilisez les boutons de contrôle pour gérer la lecture
4. Ajustez le volume avec le curseur

## 📁 Structure des fichiers

```
PlayerLofi/
├── index.html      # Page principale
├── styles.css      # Styles CSS
├── script.js       # Logique JavaScript
└── README.md       # Documentation
```

## 🎨 Flux disponibles

- **💤 Sleep Ambient Radio** : Musique relaxante pour s'endormir
- **🏰 Medieval Lofi Radio** : Beats lofi médiévaux
- **📝 POV: It's Monday** : It's Monday and you have an essay due tomorrow
- **☔ Sad Lofi Radio** : Beats for rainy days
- **📚 Study With Me** : Pomodoro
- **🎷 Jazz Lofi Radio** : Beats to chill/study to
- **💤 Lofi Hip Hop Radio** : Beats to sleep/chill to
- **🎹 Peaceful Piano Radio** : Music to focus/study to
- **⛩️ Asian Lofi Radio** : Beats to relax/study to
- **🌃 Dark Ambient Radio** : Music to escape/dream to
- **🌌 Synthwave Radio** : Beats to chill/game to
- **📚 Lofi Hip Hop Radio** : Beats to relax/study to

## ⌨️ Raccourcis clavier

- **Espace** : Play/Pause
- **Ctrl+S** : Stop

## 🔧 Personnalisation

Pour ajouter de nouveaux flux :

1. Modifiez le HTML dans `index.html` en ajoutant un nouvel élément `.track-item`
2. Ajoutez l'URL YouTube dans l'attribut `data-url`
3. Personnalisez le titre et la description

Exemple :
```html
<div class="track-item" data-url="https://www.youtube.com/watch?v=VOTRE_VIDEO_ID">
    <div class="track-info">
        <h4>🎵 Votre Titre</h4>
        <p>Votre description</p>
    </div>
    <button class="select-btn">Sélectionner</button>
</div>
```

## 🌐 Compatibilité

- Chrome, Firefox, Safari, Edge
- Mobile et desktop
- Nécessite une connexion internet pour les flux YouTube

## 📝 Note technique

Ce lecteur utilise l'API YouTube Embed avec une iframe cachée pour lire uniquement l'audio sans afficher la vidéo. Cela permet d'économiser la bande passante et d'avoir une interface plus légère. 