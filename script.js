class PlayerLofi {
    constructor() {
        this.currentTrack = null;
        this.isPlaying = false;
        this.volume = 0.5;
        this.iframe = null;
        
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.playBtn = document.getElementById('play-btn');
        this.stopBtn = document.getElementById('stop-btn');
        this.volumeSlider = document.getElementById('volume');
        this.volumeValue = document.getElementById('volume-value');
        this.trackTitle = document.getElementById('track-title');
        this.trackDescription = document.getElementById('track-description');
        this.trackItems = document.querySelectorAll('.track-item');
        this.selectBtns = document.querySelectorAll('.select-btn');
    }

    bindEvents() {
        // Boutons de contrôle
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.stopBtn.addEventListener('click', () => this.stop());
        
        // Contrôle du volume
        this.volumeSlider.addEventListener('input', (e) => {
            this.volume = e.target.value / 100;
            this.volumeValue.textContent = `${e.target.value}%`;
            if (this.iframe) {
                this.iframe.contentWindow.postMessage(JSON.stringify({
                    event: 'command',
                    func: 'setVolume',
                    args: [this.volume * 100]
                }), '*');
            }
        });

        // Sélection des pistes
        this.selectBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => this.selectTrack(index));
        });

        // Clic sur les éléments de piste
        this.trackItems.forEach((item, index) => {
            item.addEventListener('click', () => this.selectTrack(index));
        });
    }

    selectTrack(index) {
        // Retirer la sélection précédente
        this.trackItems.forEach(item => item.classList.remove('active'));
        this.selectBtns.forEach(btn => btn.classList.remove('selected'));

        // Ajouter la sélection actuelle
        this.trackItems[index].classList.add('active');
        this.selectBtns[index].classList.add('selected');

        // Mettre à jour les informations de la piste
        const trackInfo = this.trackItems[index].querySelector('.track-info');
        const title = trackInfo.querySelector('h4').textContent;
        const description = trackInfo.querySelector('p').textContent;
        
        this.trackTitle.textContent = title;
        this.trackDescription.textContent = description;

        // Obtenir l'URL YouTube
        const youtubeUrl = this.trackItems[index].dataset.url;
        this.currentTrack = this.extractVideoId(youtubeUrl);

        // Activer les boutons de contrôle
        this.playBtn.disabled = false;
        this.stopBtn.disabled = false;

        // Créer l'iframe pour la lecture audio (autoplay activé)
        this.createAudioIframe();
        
        // Mettre à jour le bouton play pour indiquer que la musique est en cours de lecture
        this.isPlaying = true;
        this.updatePlayButton(true);
    }

    extractVideoId(url) {
        const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    createAudioIframe() {
        // Supprimer l'ancienne iframe si elle existe
        if (this.iframe) {
            this.iframe.remove();
        }

        // Créer une nouvelle iframe cachée avec autoplay activé
        this.iframe = document.createElement('iframe');
        this.iframe.style.display = 'none';
        this.iframe.width = '0';
        this.iframe.height = '0';
        this.iframe.src = `https://www.youtube.com/embed/${this.currentTrack}?autoplay=1&controls=0&disablekb=1&enablejsapi=1&fs=0&iv_load_policy=3&modestbranding=1&playsinline=1&rel=0&showinfo=0&loop=1&playlist=${this.currentTrack}&mute=0`;
        this.iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        this.iframe.allowFullscreen = false;

        document.body.appendChild(this.iframe);

        // Écouter les messages de l'iframe
        window.addEventListener('message', (event) => {
            if (event.origin !== 'https://www.youtube.com') return;
            
            try {
                const data = JSON.parse(event.data);
                if (data.event === 'onStateChange') {
                    this.handleStateChange(data.info);
                }
            } catch (e) {
                // Ignorer les erreurs de parsing
            }
        });

        // Définir le volume après un court délai pour s'assurer que l'iframe est chargée
        setTimeout(() => {
            if (this.iframe) {
                this.iframe.contentWindow.postMessage(JSON.stringify({
                    event: 'command',
                    func: 'setVolume',
                    args: [this.volume * 100]
                }), '*');
            }
        }, 1000);
    }

    handleStateChange(state) {
        // YouTube states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
        if (state === 1) {
            this.isPlaying = true;
            this.updatePlayButton(true);
        } else if (state === 2) {
            this.isPlaying = false;
            this.updatePlayButton(false);
        }
    }

    togglePlay() {
        if (!this.currentTrack) return;

        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        if (!this.iframe) return;

        this.iframe.contentWindow.postMessage(JSON.stringify({
            event: 'command',
            func: 'playVideo'
        }), '*');

        this.isPlaying = true;
        this.updatePlayButton(true);
    }

    pause() {
        if (!this.iframe) return;

        this.iframe.contentWindow.postMessage(JSON.stringify({
            event: 'command',
            func: 'pauseVideo'
        }), '*');

        this.isPlaying = false;
        this.updatePlayButton(false);
    }

    stop() {
        if (!this.iframe) return;

        this.iframe.contentWindow.postMessage(JSON.stringify({
            event: 'command',
            func: 'stopVideo'
        }), '*');

        this.isPlaying = false;
        this.updatePlayButton(false);
    }

    updatePlayButton(playing) {
        const playIcon = this.playBtn.querySelector('.play-icon');
        const pauseIcon = this.playBtn.querySelector('.pause-icon');

        if (playing) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline';
        } else {
            playIcon.style.display = 'inline';
            pauseIcon.style.display = 'none';
        }
    }
}

// Initialiser le lecteur quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    new PlayerLofi();
});

// Gestion des raccourcis clavier
document.addEventListener('keydown', (e) => {
    const player = window.playerLofi;
    if (!player) return;

    switch(e.code) {
        case 'Space':
            e.preventDefault();
            player.togglePlay();
            break;
        case 'KeyS':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                player.stop();
            }
            break;
    }
}); 