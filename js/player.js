/**
 * Módulo del Reproductor de Audio
 * Maneja la reproducción de música y el estado del reproductor
 */

const Player = {
    // Elementos DOM del reproductor
    elements: {
        audioPlayer: document.getElementById('audio-player'),
        playBtn: document.getElementById('play-pause-btn'),
        prevBtn: document.getElementById('prev-btn'),
        nextBtn: document.getElementById('next-btn'),
        progress: document.getElementById('progress-bar'),
        progressBar: document.getElementById('progress-container'),
        currentTime: document.getElementById('current-time'),
        duration: document.getElementById('total-time'),
        currentArtwork: document.getElementById('current-artwork'),
        currentTitle: document.getElementById('current-song-title'),
        currentArtist: document.getElementById('current-song-artist'),
        playIcon: document.getElementById('play-icon'),
        volumeSlider: document.getElementById('volume-slider'),
        volumeLevel: document.getElementById('volume-level'),
        volumeIcon: document.getElementById('volume-icon'),
        progressHandle: document.getElementById('progress-handle')
    },

    // Estado del reproductor
    state: {
        currentAlbum: null,
        tracks: [],
        currentTrackIndex: 0,
        isPlaying: false,
    },

    /**
     * Inicializa el reproductor
     */
    init() {
        this.setupEventListeners();
    },

    /**
     * Configura los eventos del reproductor
     */
    setupEventListeners() {
        // Botones de control
        this.elements.playBtn.addEventListener('click', () => this.togglePlay());
        this.elements.prevBtn.addEventListener('click', () => this.playPrevious());
        this.elements.nextBtn.addEventListener('click', () => this.playNext());
        
        // Eventos del audio
        this.elements.audioPlayer.addEventListener('timeupdate', () => this.updateProgress());
        this.elements.audioPlayer.addEventListener('ended', () => this.handleTrackEnd());
        this.elements.audioPlayer.addEventListener('loadedmetadata', () => this.updateDuration());
        
        // Control de la barra de progreso
        this.elements.progressBar.addEventListener('click', (e) => this.seek(e));
        
        // Escuchar teclas de control (espacio para pausar/reproducir, flechas para anterior/siguiente)
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                if (e.code === 'Space') {
                    e.preventDefault();
                    this.togglePlay();
                } else if (e.code === 'ArrowLeft') {
                    this.playPrevious();
                } else if (e.code === 'ArrowRight') {
                    this.playNext();
                }
            }
        });
    },

    /**
     * Carga un álbum para reproducción
     * @param {number} albumId - ID del álbum a cargar
     */
    async loadAlbum(albumId) {
        try {
            // Obtener datos del álbum y sus pistas
            const album = await DB.getAlbumById(albumId);
            const tracks = await DB.getTracksByAlbumId(albumId);
            
            if (!album || tracks.length === 0) {
                throw new Error('Álbum no encontrado o sin pistas');
            }
            
            // Actualizar estado
            this.state.currentAlbum = album;
            this.state.tracks = tracks;
            this.state.currentTrackIndex = 0;
            
            // Habilitar controles
            this.enableControls();
            
            // Cargar primera pista
            this.loadTrack(0);
            
            // Iniciar reproducción
            this.play();
        } catch (error) {
            console.error('Error al cargar álbum:', error);
            UI.showNotification('Error al cargar el álbum', 'error');
        }
    },

    /**
     * Habilita los controles de reproducción
     */
    enableControls() {
        this.elements.playBtn.disabled = false;
        this.elements.prevBtn.disabled = this.state.tracks.length <= 1;
        this.elements.nextBtn.disabled = this.state.tracks.length <= 1;
    },

    /**
     * Carga una pista específica
     * @param {number} index - Índice de la pista a cargar
     */
    loadTrack(index) {
        if (index < 0 || index >= this.state.tracks.length) {
            return;
        }
        
        // Actualizar índice actual
        this.state.currentTrackIndex = index;
        
        // Obtener datos de la pista
        const track = this.state.tracks[index];
        const album = this.state.currentAlbum;
        
        // Actualizar audio source
        this.elements.audioPlayer.src = track.audioFile;
        
        // Actualizar interfaz
        this.elements.currentTitle.textContent = track.title;
        this.elements.currentArtist.textContent = album.artist;
        this.elements.currentArtwork.src = album.coverImage;
        
        // Resetear progreso
        this.elements.progress.style.width = '0%';
        this.elements.currentTime.textContent = '0:00';
        this.elements.duration.textContent = '0:00';
    },

    /**
     * Inicia la reproducción
     */
    play() {
        this.elements.audioPlayer.play()
            .then(() => {
                this.state.isPlaying = true;
                this.updatePlayButton();
            })
            .catch(error => {
                console.error('Error al reproducir:', error);
                UI.showNotification('Error al reproducir la pista', 'error');
            });
    },

    /**
     * Pausa la reproducción
     */
    pause() {
        this.elements.audioPlayer.pause();
        this.state.isPlaying = false;
        this.updatePlayButton();
    },

    /**
     * Alterna entre reproducir y pausar
     */
    togglePlay() {
        if (this.state.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    },

    /**
     * Actualiza el botón de reproducción según el estado
     */
    updatePlayButton() {
        if (this.state.isPlaying) {
            this.elements.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            this.elements.playBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    },

    /**
     * Reproduce la pista anterior
     */
    playPrevious() {
        // Si ha pasado más de 3 segundos, volver al inicio de la pista actual
        if (this.elements.audioPlayer.currentTime > 3) {
            this.elements.audioPlayer.currentTime = 0;
            return;
        }
        
        let newIndex = this.state.currentTrackIndex - 1;
        
        // Volver al final si estamos en la primera pista
        if (newIndex < 0) {
            newIndex = this.state.tracks.length - 1;
        }
        
        this.loadTrack(newIndex);
        this.play();
    },

    /**
     * Reproduce la siguiente pista
     */
    playNext() {
        let newIndex = this.state.currentTrackIndex + 1;
        
        // Volver al inicio si llegamos al final
        if (newIndex >= this.state.tracks.length) {
            newIndex = 0;
        }
        
        this.loadTrack(newIndex);
        this.play();
    },

    /**
     * Maneja el final de una pista
     */
    handleTrackEnd() {
        this.playNext();
    },

    /**
     * Actualiza la barra de progreso durante la reproducción
     */
    updateProgress() {
        const { currentTime, duration } = this.elements.audioPlayer;
        
        if (duration > 0) {
            // Actualizar barra de progreso
            const progressPercent = (currentTime / duration) * 100;
            this.elements.progress.style.width = `${progressPercent}%`;
            
            // Actualizar tiempo actual
            this.elements.currentTime.textContent = this.formatTime(currentTime);
        }
    },

    /**
     * Actualiza la duración total mostrada
     */
    updateDuration() {
        const duration = this.elements.audioPlayer.duration || 0;
        this.elements.duration.textContent = this.formatTime(duration);
    },

    /**
     * Cambia la posición de reproducción al hacer clic en la barra de progreso
     * @param {Event} e - Evento de clic
     */
    seek(e) {
        const progressBarRect = this.elements.progressBar.getBoundingClientRect();
        const clickPosition = e.clientX - progressBarRect.left;
        const percentClicked = clickPosition / progressBarRect.width;
        
        // Establecer nueva posición
        const { duration } = this.elements.audioPlayer;
        if (duration) {
            this.elements.audioPlayer.currentTime = percentClicked * duration;
        }
    },

    /**
     * Formatea segundos en formato mm:ss
     * @param {number} seconds - Segundos a formatear
     * @returns {string} Tiempo formateado
     */
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
};
