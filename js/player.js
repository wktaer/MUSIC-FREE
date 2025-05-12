/**
 * Módulo del Reproductor de Audio
 * Maneja la reproducción de música y el estado del reproductor
 */

const Player = {
    // Elementos DOM del reproductor
    elements: {
        audioPlayer: null,
        playBtn: null,
        prevBtn: null,
        nextBtn: null,
        progress: null,
        progressBar: null,
        currentTime: null,
        duration: null,
        currentArtwork: null,
        currentTitle: null,
        currentArtist: null,
        playIcon: null,
        volumeSlider: null,
        volumeLevel: null,
        volumeIcon: null,
        progressHandle: null,
        forwardBtn: null,
        backwardBtn: null,
        player: null
    },

    // Estado del reproductor
    state: {
        currentAlbum: null,
        tracks: [],
        currentTrackIndex: 0,
        isPlaying: false,
        isDragging: false,
        lastVolume: 1,
        isMuted: false
    },

    /**
     * Inicializa el reproductor
     */
    init() {
        this.initElements();
        this.setupEventListeners();
        this.setInitialVolume();
    },

    /**
     * Inicializa referencias a elementos DOM
     */
    initElements() {
        try {
            this.elements.audioPlayer = document.getElementById('audio-player');
            this.elements.playBtn = document.getElementById('play-pause-btn');
            this.elements.prevBtn = document.getElementById('prev-btn');
            this.elements.nextBtn = document.getElementById('next-btn');
            this.elements.progress = document.getElementById('progress-bar');
            this.elements.progressBar = document.getElementById('progress-container');
            this.elements.currentTime = document.getElementById('current-time');
            this.elements.duration = document.getElementById('total-time');
            this.elements.currentArtwork = document.getElementById('current-artwork');
            this.elements.currentTitle = document.getElementById('current-song-title');
            this.elements.currentArtist = document.getElementById('current-song-artist');
            this.elements.playIcon = document.getElementById('play-icon');
            this.elements.volumeSlider = document.getElementById('volume-slider');
            this.elements.volumeLevel = document.getElementById('volume-level');
            this.elements.volumeIcon = document.getElementById('volume-icon');
            this.elements.progressHandle = document.getElementById('progress-handle');
            this.elements.forwardBtn = document.getElementById('forward-btn');
            this.elements.backwardBtn = document.getElementById('backward-btn');
            this.elements.player = document.getElementById('player');
            
            // Verificar elementos críticos
            if (!this.elements.audioPlayer) {
                throw new Error('Elemento de audio no encontrado');
            }
        } catch (error) {
            console.error('Error al inicializar elementos del reproductor:', error);
            throw error;
        }
    },

    /**
     * Configura los eventos del reproductor
     */
    setupEventListeners() {
        try {
            // Botones de control
            this.elements.playBtn.addEventListener('click', () => this.togglePlay());
            this.elements.prevBtn.addEventListener('click', () => this.playPrevious());
            this.elements.nextBtn.addEventListener('click', () => this.playNext());
            
            // Botones de adelantar/retroceder
            if (this.elements.forwardBtn) {
                this.elements.forwardBtn.addEventListener('click', () => this.skipForward());
            }
            if (this.elements.backwardBtn) {
                this.elements.backwardBtn.addEventListener('click', () => this.skipBackward());
            }
            
            // Eventos del audio
            this.elements.audioPlayer.addEventListener('timeupdate', () => this.updateProgress());
            this.elements.audioPlayer.addEventListener('ended', () => this.handleTrackEnd());
            this.elements.audioPlayer.addEventListener('loadedmetadata', () => this.updateDuration());
            this.elements.audioPlayer.addEventListener('play', () => this.onPlayStarted());
            this.elements.audioPlayer.addEventListener('pause', () => this.onPaused());
            
            // Control de la barra de progreso
            this.elements.progressBar.addEventListener('click', (e) => this.seek(e));
            
            // Mouse events para drag & drop en la barra de progreso
            this.elements.progressBar.addEventListener('mousedown', (e) => {
                this.state.isDragging = true;
                this.seek(e);
            });
            
            document.addEventListener('mousemove', (e) => {
                if (this.state.isDragging) {
                    this.seek(e);
                }
            });
            
            document.addEventListener('mouseup', () => {
                this.state.isDragging = false;
            });
            
            // Control de volumen
            this.elements.volumeSlider.addEventListener('click', (e) => this.adjustVolume(e));
            this.elements.volumeIcon.addEventListener('click', () => this.toggleMute());
            
            // Escuchar teclas de control
            document.addEventListener('keydown', (e) => {
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                    if (e.code === 'Space') {
                        e.preventDefault();
                        this.togglePlay();
                    } else if (e.code === 'ArrowLeft') {
                        if (e.shiftKey) {
                            this.skipBackward();
                        } else {
                            this.playPrevious();
                        }
                    } else if (e.code === 'ArrowRight') {
                        if (e.shiftKey) {
                            this.skipForward();
                        } else {
                            this.playNext();
                        }
                    } else if (e.code === 'ArrowUp') {
                        e.preventDefault();
                        this.increaseVolume();
                    } else if (e.code === 'ArrowDown') {
                        e.preventDefault();
                        this.decreaseVolume();
                    } else if (e.code === 'KeyM') {
                        e.preventDefault();
                        this.toggleMute();
                    }
                }
            });
        } catch (error) {
            console.error('Error al configurar event listeners:', error);
            throw error;
        }
    },

    /**
     * Establece el volumen inicial
     */
    setInitialVolume() {
        // Cargar volumen del almacenamiento local o usar valor predeterminado
        const savedVolume = localStorage.getItem('playerVolume');
        const initialVolume = savedVolume ? parseFloat(savedVolume) : 0.7;
        
        this.elements.audioPlayer.volume = initialVolume;
        this.elements.volumeLevel.style.width = `${initialVolume * 100}%`;
        this.updateVolumeIcon(initialVolume);
    },

    /**
     * Ajusta el volumen según la posición del clic
     */
    adjustVolume(e) {
        const volumeRect = this.elements.volumeSlider.getBoundingClientRect();
        const clickPosition = e.clientX - volumeRect.left;
        const volume = Math.max(0, Math.min(1, clickPosition / volumeRect.width));
        
        this.setVolume(volume);
    },
    
    /**
     * Establece el nivel de volumen
     */
    setVolume(volume) {
        this.elements.audioPlayer.volume = volume;
        this.elements.volumeLevel.style.width = `${volume * 100}%`;
        this.state.lastVolume = volume;
        this.state.isMuted = volume === 0;
        
        // Guardar en localStorage
        localStorage.setItem('playerVolume', volume);
        
        this.updateVolumeIcon(volume);
    },
    
    /**
     * Actualiza el icono de volumen según el nivel
     */
    updateVolumeIcon(volume) {
        const volumeIcon = this.elements.volumeIcon;
        volumeIcon.className = 'fas volume-icon';
        
        if (volume === 0) {
            volumeIcon.classList.add('fa-volume-mute');
        } else if (volume < 0.5) {
            volumeIcon.classList.add('fa-volume-down');
        } else {
            volumeIcon.classList.add('fa-volume-up');
        }
    },
    
    /**
     * Alterna entre silenciar y restaurar el volumen
     */
    toggleMute() {
        if (this.state.isMuted) {
            // Restaurar volumen
            this.setVolume(this.state.lastVolume || 0.7);
            UI.showNotification('Sonido activado', 'info', 500);
        } else {
            // Silenciar
            this.setVolume(0);
            UI.showNotification('Silenciado', 'info', 500);
        }
    },
    
    /**
     * Aumenta el volumen en un 10%
     */
    increaseVolume() {
        const newVolume = Math.min(1, this.elements.audioPlayer.volume + 0.1);
        this.setVolume(newVolume);
    },
    
    /**
     * Disminuye el volumen en un 10%
     */
    decreaseVolume() {
        const newVolume = Math.max(0, this.elements.audioPlayer.volume - 0.1);
        this.setVolume(newVolume);
    },

    /**
     * Carga un álbum para reproducción
     * @param {number} albumId - ID del álbum a cargar
     * @param {number} startTrackIndex - Índice opcional de la pista inicial a reproducir (por defecto: 0)
     */
    async loadAlbum(albumId, startTrackIndex = 0) {
        try {
            // Obtener información del álbum y pistas
            const album = await DB.getAlbumById(albumId);
            const tracks = await DB.getTracksByAlbumId(albumId);
            
            if (!tracks || tracks.length === 0) {
                throw new Error('No se encontraron pistas para este álbum');
            }
            
            // Almacenar datos en el estado
            this.state.currentAlbum = album;
            this.state.tracks = tracks;
            this.state.currentTrackIndex = startTrackIndex;
            
            // Habilitar controles
            this.enableControls();
            
            // Cargar la primera pista
            this.loadTrack(startTrackIndex);
            
            // Iniciar reproducción
            this.play();
            
            // Actualizar UI
            UI.highlightCurrentTrack();
        } catch (error) {
            console.error('Error al cargar el álbum:', error);
            UI.showNotification('Error al cargar el álbum', 'error');
        }
    },

    /**
     * Habilita los controles de reproducción
     */
    enableControls() {
        this.elements.playBtn.disabled = false;
        this.elements.prevBtn.disabled = false;
        this.elements.nextBtn.disabled = false;
        if (this.elements.forwardBtn) this.elements.forwardBtn.disabled = false;
        if (this.elements.backwardBtn) this.elements.backwardBtn.disabled = false;
    },

    /**
     * Carga una pista específica
     * @param {number} index - Índice de la pista a cargar
     */
    loadTrack(index) {
        try {
            // Validar índice
            if (index < 0 || index >= this.state.tracks.length) {
                console.warn('Índice de pista fuera de rango:', index);
                return;
            }
            
            // Obtener datos de la pista
            const track = this.state.tracks[index];
            
            // Actualizar estado
            this.state.currentTrackIndex = index;
            
            // Actualizar elemento de audio
            if (track.audioFile) {
                // Si hay un URL directo, usarlo
                this.elements.audioPlayer.src = track.audioFile;
            } else if (track.data instanceof Blob) {
                // Si hay datos blob, crear un URL de objeto
                const url = URL.createObjectURL(track.data);
                this.elements.audioPlayer.src = url;
            } else {
                console.error('Formato de audio no soportado:', track);
                this.elements.audioPlayer.src = '';
                UI.showNotification('Formato de audio no soportado', 'error');
                return;
            }
            
            // Actualizar información visualizada
            this.elements.currentTitle.textContent = track.title || 'Pista sin título';
            this.elements.currentArtist.textContent = this.state.currentAlbum ? this.state.currentAlbum.artist : 'Artista desconocido';
            
            // Actualizar imagen del álbum
            if (this.state.currentAlbum && this.state.currentAlbum.artwork) {
                this.elements.currentArtwork.src = URL.createObjectURL(this.state.currentAlbum.artwork);
            } else if (this.state.currentAlbum && this.state.currentAlbum.coverImage) {
                this.elements.currentArtwork.src = this.state.currentAlbum.coverImage;
            } else {
                this.elements.currentArtwork.src = 'images/placeholder.jpg';
            }
            
            // Actualizar UI
            UI.highlightCurrentTrack();
            
            // Resetear progreso
            this.elements.progress.style.width = '0%';
            this.elements.progressHandle.style.left = '0%';
            this.elements.currentTime.textContent = '0:00';
        } catch (error) {
            console.error('Error al cargar la pista:', error);
            UI.showNotification('Error al cargar la pista', 'error');
        }
    },

    /**
     * Inicia la reproducción
     */
    play() {
        try {
            this.elements.audioPlayer.play()
                .then(() => {
                    this.state.isPlaying = true;
                    this.updatePlayButton();
                })
                .catch(error => {
                    console.error('Error al iniciar reproducción:', error);
                    UI.showNotification('Error al reproducir', 'error');
                });
        } catch (error) {
            console.error('Error en play():', error);
        }
    },

    /**
     * Pausa la reproducción
     */
    pause() {
        try {
            this.elements.audioPlayer.pause();
            this.state.isPlaying = false;
            this.updatePlayButton();
        } catch (error) {
            console.error('Error en pause():', error);
        }
    },

    /**
     * Alterna entre reproducir y pausar
     */
    togglePlay() {
        if (this.elements.audioPlayer.src) {
            if (this.state.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        } else if (this.state.tracks.length > 0) {
            this.loadTrack(0);
            this.play();
        }
    },

    /**
     * Actualiza el botón de reproducción según el estado
     */
    updatePlayButton() {
        if (this.state.isPlaying) {
            this.elements.playIcon.classList.remove('fa-play');
            this.elements.playIcon.classList.add('fa-pause');
        } else {
            this.elements.playIcon.classList.remove('fa-pause');
            this.elements.playIcon.classList.add('fa-play');
        }
    },

    /**
     * Callback cuando inicia la reproducción
     */
    onPlayStarted() {
        // Añade clase para animación
        this.elements.playBtn.classList.add('animate');
        
        // Elimina la clase después de la animación
        setTimeout(() => {
            this.elements.playBtn.classList.remove('animate');
        }, 500);
    },
    
    /**
     * Callback cuando se pausa la reproducción
     */
    onPaused() {
        // Aquí puedes añadir efectos visuales al pausar
    },

    /**
     * Reproduce la pista anterior
     */
    playPrevious() {
        if (this.state.tracks.length === 0) return;
        
        // Si la pista actual ha sido reproducida por más de 3 segundos,
        // reiniciar la pista actual en lugar de ir a la anterior
        if (this.elements.audioPlayer.currentTime > 3) {
            this.elements.audioPlayer.currentTime = 0;
            return;
        }
        
        let prevIndex = this.state.currentTrackIndex - 1;
        
        // Ciclo: ir a la última pista si estamos en la primera
        if (prevIndex < 0) {
            prevIndex = this.state.tracks.length - 1;
        }
        
        this.loadTrack(prevIndex);
        this.play();
    },

    /**
     * Reproduce la siguiente pista
     */
    playNext() {
        if (this.state.tracks.length === 0) return;
        
        let nextIndex = this.state.currentTrackIndex + 1;
        
        // Ciclo: volver a la primera pista si estamos en la última
        if (nextIndex >= this.state.tracks.length) {
            nextIndex = 0;
        }
        
        this.loadTrack(nextIndex);
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
        
        if (duration > 0 && !this.state.isDragging) {
            // Actualizar barra de progreso
            const progressPercent = (currentTime / duration) * 100;
            this.elements.progress.style.width = `${progressPercent}%`;
            this.elements.progressHandle.style.left = `${progressPercent}%`;
            
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
     * @param {Event} e - Evento de clic o mousemove
     */
    seek(e) {
        const progressBarRect = this.elements.progressBar.getBoundingClientRect();
        const clickPosition = Math.max(0, Math.min(e.clientX - progressBarRect.left, progressBarRect.width));
        const percentClicked = clickPosition / progressBarRect.width;
        
        // Establecer nueva posición
        const { duration } = this.elements.audioPlayer;
        if (duration) {
            this.elements.audioPlayer.currentTime = percentClicked * duration;
            
            // Actualizar visualmente la barra mientras arrastramos
            const progressPercent = percentClicked * 100;
            this.elements.progress.style.width = `${progressPercent}%`;
            this.elements.progressHandle.style.left = `${progressPercent}%`;
        }
    },

    /**
     * Adelanta 10 segundos en la pista actual
     */
    skipForward() {
        const audioPlayer = this.elements.audioPlayer;
        if (audioPlayer.duration) {
            // Avanzar 10 segundos, pero no más allá de la duración
            const newTime = Math.min(audioPlayer.currentTime + 10, audioPlayer.duration);
            audioPlayer.currentTime = newTime;
            
            // Añadir animación al botón
            this.elements.forwardBtn.classList.add('animate');
            setTimeout(() => {
                this.elements.forwardBtn.classList.remove('animate');
            }, 300);
            
            UI.showNotification('Adelantado 10 segundos', 'info', 500);
        }
    },

    /**
     * Retrocede 10 segundos en la pista actual
     */
    skipBackward() {
        const audioPlayer = this.elements.audioPlayer;
        if (audioPlayer.duration) {
            // Retroceder 10 segundos, pero no menos de 0
            const newTime = Math.max(audioPlayer.currentTime - 10, 0);
            audioPlayer.currentTime = newTime;
            
            // Añadir animación al botón
            this.elements.backwardBtn.classList.add('animate');
            setTimeout(() => {
                this.elements.backwardBtn.classList.remove('animate');
            }, 300);
            
            UI.showNotification('Retrocedido 10 segundos', 'info', 500);
        }
    },

    /**
     * Reproduce una lista personalizada de pistas
     * @param {Array} trackList - Lista de pistas a reproducir
     * @param {number} albumId - ID del álbum al que pertenecen las pistas (opcional)
     */
    async playCustomTrackList(trackList, albumId = null) {
        try {
            if (!trackList || trackList.length === 0) {
                throw new Error('Lista de reproducción vacía');
            }
            
            // Si se proporciona un ID de álbum, cargar los datos del álbum
            let album = null;
            if (albumId) {
                album = await DB.getAlbumById(albumId);
            }
            
            // Actualizar estado
            this.state.currentAlbum = album;
            this.state.tracks = trackList;
            this.state.currentTrackIndex = 0;
            
            // Habilitar controles
            this.enableControls();
            
            // Cargar la primera pista de la lista personalizada
            this.loadTrack(0);
            
            // Iniciar reproducción
            this.play();
        } catch (error) {
            console.error('Error al reproducir lista personalizada:', error);
            UI.showNotification('Error al reproducir la lista personalizada', 'error');
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
