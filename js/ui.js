/**
 * Módulo de Interfaz de Usuario (UI)
 * Maneja la interacción con el DOM y eventos de la interfaz
 */

// Definir el objeto UI global
const UI = {
    // Elementos DOM principales
    elements: {
        albumsGrid: document.getElementById('albums-grid'),
        searchInput: document.getElementById('search'),
        addAlbumBtn: document.getElementById('add-album-btn'),
        themeToggle: document.getElementById('theme-toggle'),
        detailThemeToggle: document.getElementById('detail-theme-toggle'),
        storageThemeToggle: document.getElementById('storage-theme-toggle'),
        modal: document.getElementById('add-album-modal'),
        modalClose: document.querySelector('#add-album-modal .close'),
        albumForm: document.getElementById('album-form'),
        addTrackBtn: document.getElementById('add-track-btn'),
        tracksContainer: document.getElementById('tracks-container'),
        coverPreview: document.getElementById('cover-preview'),
        albumCover: document.getElementById('album-cover'),
        // Elementos para vista detallada
        albumDetailView: document.getElementById('album-detail-view'),
        mainView: document.getElementById('main-view'),
        backToGridBtn: document.getElementById('back-to-grid'),
        detailCover: document.getElementById('detail-cover'),
        detailTitle: document.getElementById('detail-title'),
        detailArtist: document.getElementById('detail-artist'),
        detailYear: document.getElementById('detail-year'),
        detailTracksList: document.getElementById('detail-tracks-list'),
        playAlbumBtn: document.getElementById('play-album-btn'),
        editAlbumBtn: document.getElementById('edit-album-btn'),
        deleteAlbumBtn: document.getElementById('delete-album-btn'),
        // Elementos para almacenamiento local
        storageView: document.getElementById('storage-view'),
        backFromStorageBtn: document.getElementById('back-from-storage'),
        totalTracksCount: document.getElementById('total-tracks-count'),
        totalAlbumsCount: document.getElementById('total-albums-count'),
        storageUsed: document.getElementById('storage-used'),
        clearStorageBtn: document.getElementById('clear-storage-btn'),
        // Elementos para edición de álbum
        editAlbumModal: document.getElementById('edit-album-modal'),
        editAlbumForm: document.getElementById('edit-album-form'),
        editAlbumId: document.getElementById('edit-album-id'),
        editAlbumTitle: document.getElementById('edit-album-title'),
        editAlbumArtist: document.getElementById('edit-album-artist'),
        editAlbumYear: document.getElementById('edit-album-year'),
        editAlbumCover: document.getElementById('edit-album-cover'),
        editCoverPreview: document.getElementById('edit-cover-preview'),
        // Elementos para edición de pista
        editTrackModal: document.getElementById('edit-track-modal'),
        editTrackForm: document.getElementById('edit-track-form'),
        editTrackId: document.getElementById('edit-track-id'),
        editTrackAlbumId: document.getElementById('edit-track-album-id'),
        editTrackTitle: document.getElementById('edit-track-title'),
        editTrackFile: document.getElementById('edit-track-file'),
        // Elementos para añadir pista
        addTrackModal: document.getElementById('add-track-modal'),
        addTrackForm: document.getElementById('add-track-form'),
        addTrackAlbumId: document.getElementById('add-track-album-id'),
        addTrackTitle: document.getElementById('add-track-title'),
        addTrackFile: document.getElementById('add-track-file'),
        // Elementos para confirmación de eliminación
        confirmDeleteModal: document.getElementById('confirm-delete-modal'),
        confirmDeleteMessage: document.getElementById('confirm-delete-message'),
        confirmDeleteCancel: document.getElementById('confirm-delete-cancel'),
        confirmDeleteConfirm: document.getElementById('confirm-delete-confirm'),
        // Elementos de configuración
        settingsBtn: document.getElementById('settings-btn'),
        settingsModal: document.getElementById('settings-modal'),
        settingsModalClose: document.querySelector('#settings-modal .close'),
        autoplaySetting: document.getElementById('autoplay-setting'),
        skipSecondsSetting: document.getElementById('skip-seconds'),
        notificationsPositionSetting: document.getElementById('notifications-position'),
        notificationDurationSetting: document.getElementById('notification-duration'),
        compactModeSetting: document.getElementById('compact-mode-setting'),
        animationsSetting: document.getElementById('animations-setting'),
        themeMode: document.getElementById('theme-mode'),
        accentColor: document.getElementById('accent-color'),
        visualizerEnabled: document.getElementById('visualizer-enabled'),
        visualizerType: document.getElementById('visualizer-type'),
        transitionEffect: document.getElementById('transition-effect'),
        // Elementos para perfil de usuario
        albumUploader: document.getElementById('album-uploader'),
        viewProfileBtn: document.getElementById('view-profile-btn'),
        userProfileModal: document.getElementById('user-profile-modal'),
        closeProfileModal: document.getElementById('close-profile-modal'),
        profileUsername: document.getElementById('profile-username'),
        profileBio: document.getElementById('profile-bio'),
        profileAvatar: document.getElementById('profile-avatar'),
        profileAlbumsCount: document.getElementById('profile-albums-count'),
        profileTracksCount: document.getElementById('profile-tracks-count'),
        editProfileBtn: document.getElementById('edit-profile-btn'),
        profileView: document.getElementById('profile-view'),
        profileEdit: document.getElementById('profile-edit'),
        profileEditForm: document.getElementById('profile-edit-form'),
        editUsername: document.getElementById('edit-username'),
        editBio: document.getElementById('edit-bio'),
        editAvatar: document.getElementById('edit-avatar'),
        avatarPreview: document.getElementById('avatar-preview'),
        cancelProfileEdit: document.getElementById('cancel-profile-edit'),
        // Elementos para el ecualizador
        eqBassSlider: document.getElementById('eq-bass'),
        eqMidSlider: document.getElementById('eq-mid'),
        eqTrebleSlider: document.getElementById('eq-treble'),
        eqBassValue: document.getElementById('eq-bass-value'),
        eqMidValue: document.getElementById('eq-mid-value'),
        eqTrebleValue: document.getElementById('eq-treble-value'),
        eqPresetButtons: document.querySelectorAll('.eq-preset-btn')
    },

    // Variables de estado
    state: {
        currentAlbumId: null,
        currentTrackId: null,
        deleteItemType: null, // 'album' o 'track'
        confirmCallback: null,
        // Configuración predeterminada
        settings: {
            autoplay: true,
            skipSeconds: 10,
            notificationsPosition: 'bottom-right',
            notificationDuration: 3000,
            compactMode: false,
            animations: true,
            themeMode: 'light', // 'light', 'dark', 'auto'
            accentColor: '#0d6efd',
            visualizerEnabled: true,
            visualizerType: 'bars',
            transitionEffect: 'fade', // 'fade', 'slide', 'zoom', 'none'
            equalizer: {
                bass: 0,
                mid: 0,
                treble: 0,
                preset: 'flat'
            }
        },
        visualizer: null,
        audioContext: null,
        analyser: null,
        visualData: null,
        animationFrame: null,
        // Ecualizador
        equalizer: {
            bass: 0,      // -12 a 12 dB
            mid: 0,       // -12 a 12 dB
            treble: 0,    // -12 a 12 dB
            bassFilter: null,
            midFilter: null,
            trebleFilter: null,
            currentPreset: 'flat'
        },
        // Información del usuario
        currentUser: {
            username: 'Usuario',
            bio: 'Sin biografía',
            avatar: 'images/placeholder.jpg',
            albums: 0,
            tracks: 0
        },
        uploadedAvatar: null // Avatar subido temporalmente
    },

    /**
     * Inicializa todos los eventos de la UI
     */
    init() {
        this.setupEventListeners();
        this.loadThemePreference();
        this.loadSettings();
        this.applyCompactMode();
        this.initEqualizer();
    },

    /**
     * Configura todos los event listeners
     */
    setupEventListeners() {
        // Toggle del tema (claro/oscuro)
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.elements.detailThemeToggle.addEventListener('click', () => this.toggleTheme());
        this.elements.storageThemeToggle.addEventListener('click', () => this.toggleTheme());

        // Búsqueda de álbumes
        this.elements.searchInput.addEventListener('input', debounce((e) => {
            this.handleSearch(e.target.value);
        }, 300));

        // Abrir modal para añadir álbum
        this.elements.addAlbumBtn.addEventListener('click', () => {
            this.openModal();
        });

        // Cerrar modales
        document.querySelectorAll('.modal .close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.closeModal(modal);
            });
        });

        // Cerrar modal al hacer clic fuera
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });

        // Vista previa de la portada del álbum
        this.elements.albumCover.addEventListener('change', (e) => {
            this.handleImagePreview(e.target, this.elements.coverPreview);
        });

        // Vista previa de la portada al editar álbum
        this.elements.editAlbumCover.addEventListener('change', (e) => {
            this.handleImagePreview(e.target, this.elements.editCoverPreview);
        });

        // Añadir nueva pista al formulario
        this.elements.addTrackBtn.addEventListener('click', () => {
            this.addTrackField();
        });

        // Enviar formulario de nuevo álbum
        this.elements.albumForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAlbumSubmit();
        });

        // Enviar formulario de edición de álbum
        this.elements.editAlbumForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEditAlbumSubmit();
        });

        // Enviar formulario de edición de pista
        this.elements.editTrackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEditTrackSubmit();
        });

        // Enviar formulario para añadir pista a álbum existente
        this.elements.addTrackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddTrackToAlbumSubmit();
        });

        // Botones en la vista detallada del álbum
        this.elements.playAlbumBtn.addEventListener('click', () => {
            if (this.state.currentAlbumId) {
                Player.loadAlbum(this.state.currentAlbumId);
            }
        });

        this.elements.editAlbumBtn.addEventListener('click', () => {
            if (this.state.currentAlbumId) {
                this.openEditAlbumModal(this.state.currentAlbumId);
            }
        });

        this.elements.deleteAlbumBtn.addEventListener('click', () => {
            if (this.state.currentAlbumId) {
                this.confirmDelete('album', this.state.currentAlbumId, '¿Estás seguro de que quieres eliminar este álbum?');
            }
        });

        // Navegación entre vistas
        this.elements.backToGridBtn.addEventListener('click', () => {
            this.showMainView();
        });

        // Navegación a la vista de almacenamiento y regreso
        const storageBtn = document.getElementById('storage-btn');
        if (storageBtn) {
            storageBtn.addEventListener('click', () => {
                this.showStorageView();
            });
        }

        this.elements.backFromStorageBtn.addEventListener('click', () => {
            this.showMainView();
        });

        // Botón para limpiar el almacenamiento
        this.elements.clearStorageBtn.addEventListener('click', () => {
            this.showConfirmDialog('¿Estás seguro de que quieres eliminar todos los datos?', () => this.clearAllStorage());
        });

        // NO intentamos acceder a addTrackToAlbumBtn aquí porque se crea dinámicamente
        // El event listener para este botón se añade cuando se crea el botón en showAlbumDetails

        // Botones de confirmación de eliminación
        this.elements.confirmDeleteCancel.addEventListener('click', () => {
            this.closeModal(this.elements.confirmDeleteModal);
        });

        this.elements.confirmDeleteConfirm.addEventListener('click', () => {
            if (this.state.confirmCallback) {
                this.state.confirmCallback();
            }
            this.closeModal(this.elements.confirmDeleteModal);
        });

        // Configuración
        if (this.elements.settingsBtn) {
            this.elements.settingsBtn.addEventListener('click', () => this.openSettingsModal());
        }

        if (this.elements.settingsModalClose) {
            this.elements.settingsModalClose.addEventListener('click', () => this.closeModal(this.elements.settingsModal));
        }

        // Guardar configuración cuando cambian los valores
        if (this.elements.autoplaySetting) {
            this.elements.autoplaySetting.addEventListener('change', () => this.saveSettings());
        }

        if (this.elements.skipSecondsSetting) {
            this.elements.skipSecondsSetting.addEventListener('change', () => this.saveSettings());
        }

        if (this.elements.notificationsPositionSetting) {
            this.elements.notificationsPositionSetting.addEventListener('change', () => this.saveSettings());
        }

        if (this.elements.notificationDurationSetting) {
            this.elements.notificationDurationSetting.addEventListener('change', () => this.saveSettings());
        }

        if (this.elements.compactModeSetting) {
            this.elements.compactModeSetting.addEventListener('change', () => {
                this.saveSettings();
                this.applyCompactMode();
            });
        }

        if (this.elements.animationsSetting) {
            this.elements.animationsSetting.addEventListener('change', () => this.saveSettings());
        }

        if (this.elements.themeMode) {
            this.elements.themeMode.addEventListener('change', () => this.saveSettings());
        }

        if (this.elements.accentColor) {
            this.elements.accentColor.addEventListener('change', () => this.saveSettings());
        }

        if (this.elements.visualizerEnabled) {
            this.elements.visualizerEnabled.addEventListener('change', () => this.saveSettings());
        }

        if (this.elements.visualizerType) {
            this.elements.visualizerType.addEventListener('change', () => this.saveSettings());
        }

        if (this.elements.transitionEffect) {
            this.elements.transitionEffect.addEventListener('change', () => this.saveSettings());
        }

        // Event listeners para perfil de usuario
        if (this.elements.viewProfileBtn) {
            this.elements.viewProfileBtn.addEventListener('click', () => this.openUserProfileModal());
        }
        
        if (this.elements.albumUploader) {
            this.elements.albumUploader.addEventListener('click', (e) => {
                e.preventDefault();
                this.openUserProfileModal();
            });
        }
        
        if (this.elements.closeProfileModal) {
            this.elements.closeProfileModal.addEventListener('click', () => this.closeUserProfileModal());
        }
        
        if (this.elements.editProfileBtn) {
            this.elements.editProfileBtn.addEventListener('click', () => this.showProfileEditView());
        }
        
        if (this.elements.cancelProfileEdit) {
            this.elements.cancelProfileEdit.addEventListener('click', () => this.showProfileView());
        }
        
        if (this.elements.profileEditForm) {
            this.elements.profileEditForm.addEventListener('submit', (e) => this.handleProfileEditSubmit(e));
        }
        
        if (this.elements.editAvatar) {
            this.elements.editAvatar.addEventListener('change', (e) => this.handleAvatarPreview(e));
        }

        // Event listeners para el ecualizador
        if (this.elements.eqBassSlider) {
            this.elements.eqBassSlider.addEventListener('input', (e) => {
                this.updateEqualizer('bass', parseInt(e.target.value));
            });
        }
        
        if (this.elements.eqMidSlider) {
            this.elements.eqMidSlider.addEventListener('input', (e) => {
                this.updateEqualizer('mid', parseInt(e.target.value));
            });
        }
        
        if (this.elements.eqTrebleSlider) {
            this.elements.eqTrebleSlider.addEventListener('input', (e) => {
                this.updateEqualizer('treble', parseInt(e.target.value));
            });
        }
        
        if (this.elements.eqPresetButtons) {
            this.elements.eqPresetButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const preset = button.dataset.preset;
                    this.applyEqualizerPreset(preset);
                });
            });
        }

        // Botón de perfil en el menú principal
        if (document.getElementById('profile-btn')) {
            document.getElementById('profile-btn').addEventListener('click', () => this.openUserProfileModal());
        }
    },

    /**
     * Cambia entre tema claro y oscuro
     */
    toggleTheme() {
        const body = document.body;
        const isDarkMode = body.classList.toggle('dark-mode');
        body.classList.toggle('light-mode', !isDarkMode);

        // Cambiar el icono del botón
        this.elements.themeToggle.innerHTML = isDarkMode ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';

        // Guardar preferencia
        localStorage.setItem('darkMode', isDarkMode);
    },

    /**
     * Carga la preferencia de tema guardada
     */
    loadThemePreference() {
        const darkModePreferred = localStorage.getItem('darkMode') === 'true';
        const body = document.body;
        
        if (darkModePreferred) {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
            this.elements.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            body.classList.add('light-mode');
            body.classList.remove('dark-mode');
            this.elements.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    },

    /**
     * Abre el modal para añadir un nuevo álbum
     */
    openModal() {
        // Limpiar el formulario
        this.elements.albumForm.reset();
        this.elements.tracksContainer.innerHTML = '';
        this.elements.coverPreview.src = 'images/placeholder.jpg';
        
        // Añadir al menos un campo de pista
        this.addTrackField();
        
        // Mostrar el modal
        this.elements.modal.style.display = 'block';
    },

    /**
     * Cierra el modal
     */
    closeModal(modal) {
        modal.style.display = 'none';
    },

    /**
     * Maneja la vista previa de la imagen de portada
     */
    handleImagePreview(input, preview) {
        const file = input.files[0];
        if (!file) return;

        if (file.type.match('image.*')) {
            const reader = new FileReader();

            reader.onload = (e) => {
                preview.src = e.target.result;
            };

            reader.readAsDataURL(file);
        }
    },

    /**
     * Añade un nuevo campo para añadir una pista al formulario
     */
    addTrackField() {
        const template = document.getElementById('track-template');
        const clone = document.importNode(template.content, true);
        
        // Configurar el botón de eliminar
        const removeBtn = clone.querySelector('.remove-track-btn');
        removeBtn.addEventListener('click', (e) => {
            const trackItem = e.target.closest('.track-item');
            if (this.elements.tracksContainer.children.length > 1) {
                trackItem.remove();
            }
        });
        
        this.elements.tracksContainer.appendChild(clone);
    },

    /**
     * Procesa el envío del formulario de nuevo álbum
     */
    async handleAlbumSubmit() {
        try {
            // Validar campos
            if (!this.validateForm()) {
                return;
            }

            // Obtener datos del álbum
            const albumData = {
                title: document.getElementById('album-title').value,
                artist: document.getElementById('album-artist').value,
                year: parseInt(document.getElementById('album-year').value),
                coverImage: await this.readFileAsDataUrl(document.getElementById('album-cover').files[0])
            };

            // Guardar álbum en la base de datos
            const albumId = await DB.addAlbum(albumData);

            // Guardar cada pista
            const trackItems = this.elements.tracksContainer.querySelectorAll('.track-item');
            
            for (const trackItem of trackItems) {
                const titleInput = trackItem.querySelector('.track-title-input');
                const fileInput = trackItem.querySelector('.track-file');
                
                if (titleInput.value && fileInput.files[0]) {
                    const trackData = {
                        albumId: albumId,
                        title: titleInput.value,
                        audioFile: await this.readFileAsDataUrl(fileInput.files[0])
                    };
                    
                    await DB.addTrack(trackData);
                }
            }

            // Cerrar modal y actualizar UI
            this.closeModal(this.elements.modal);
            this.renderAlbums();
            
            // Mostrar notificación de éxito
            this.showNotification('¡Álbum guardado correctamente!', 'success');
            
        } catch (error) {
            console.error('Error al guardar álbum:', error);
            this.showNotification('Error al guardar el álbum', 'error');
        }
    },

    /**
     * Valida el formulario de nuevo álbum
     * @returns {boolean} True si el formulario es válido
     */
    validateForm() {
        // Validar campos obligatorios del álbum
        if (!document.getElementById('album-title').value) {
            this.showNotification('Ingresa un título para el álbum', 'error');
            return false;
        }
        
        if (!document.getElementById('album-artist').value) {
            this.showNotification('Ingresa el nombre del artista', 'error');
            return false;
        }
        
        if (!document.getElementById('album-year').value) {
            this.showNotification('Ingresa el año del álbum', 'error');
            return false;
        }
        
        if (!document.getElementById('album-cover').files[0]) {
            this.showNotification('Selecciona una portada para el álbum', 'error');
            return false;
        }
        
        // Validar que haya al menos una pista con título y archivo
        const trackItems = this.elements.tracksContainer.querySelectorAll('.track-item');
        let hasValidTrack = false;
        
        for (const trackItem of trackItems) {
            const titleInput = trackItem.querySelector('.track-title-input');
            const fileInput = trackItem.querySelector('.track-file');
            
            if (titleInput.value && fileInput.files[0]) {
                hasValidTrack = true;
                break;
            }
        }
        
        if (!hasValidTrack) {
            this.showNotification('Añade al menos una canción válida', 'error');
            return false;
        }
        
        return true;
    },

    /**
     * Lee un archivo como Data URL
     * @param {File} file - Archivo a leer
     * @returns {Promise} Promesa que se resuelve con el Data URL
     */
    readFileAsDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                resolve(e.target.result);
            };
            
            reader.onerror = (e) => {
                reject(e);
            };
            
            reader.readAsDataURL(file);
        });
    },

    /**
     * Muestra una notificación temporal
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo de notificación ('success', 'error', 'info')
     * @param {number} duration - Duración personalizada (opcional)
     */
    showNotification(message, type = 'info', duration = null) {
        // Eliminar cualquier notificación existente
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification ${type} ${this.state.settings.notificationsPosition}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Mostrar con animación
        setTimeout(() => {
            notification.style.display = 'block';
        }, 10);
        
        // Duración personalizada o por configuración
        const displayDuration = duration || this.state.settings.notificationDuration;
        
        // Ocultar después del tiempo especificado
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, displayDuration);
    },

    /**
     * Maneja la búsqueda de álbumes
     * @param {string} query - Texto de búsqueda
     */
    async handleSearch(query) {
        try {
            const albums = await DB.searchAlbums(query);
            this.renderAlbums(albums);
        } catch (error) {
            console.error('Error al buscar:', error);
        }
    },

    /**
     * Renderiza la lista de álbumes en la interfaz
     * @param {Array} albums - Lista de álbumes a mostrar
     */
    async renderAlbums(albums) {
        if (!albums) {
            albums = await DB.getAllAlbums();
        }
        
        this.elements.albumsGrid.innerHTML = '';
        
        if (albums.length === 0) {
            this.elements.albumsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-music"></i>
                    <p>No hay álbumes para mostrar</p>
                    <p>Haz clic en "Añadir Álbum" para empezar</p>
                </div>
            `;
            return;
        }
        
        for (const album of albums) {
            const tracks = await DB.getTracksByAlbumId(album.id);
            this.createAlbumCard(album, tracks);
        }
    },

    /**
     * Crea una tarjeta para un álbum y la añade al grid
     * @param {Object} album - Datos del álbum
     * @param {Array} tracks - Lista de canciones del álbum
     */
    createAlbumCard(album, tracks) {
        const card = document.createElement('div');
        card.className = 'album-card';
        card.setAttribute('data-id', album.id);
        
        card.innerHTML = `
            <img src="${album.coverImage}" alt="${album.title}" class="album-artwork">
            <div class="album-info">
                <h3 class="album-title">${album.title}</h3>
                <p class="album-artist">${album.artist}</p>
                <p class="album-year">${album.year}</p>
                <button class="album-play" data-album-id="${album.id}">
                    <i class="fas fa-play"></i> Reproducir
                </button>
            </div>
        `;
        
        // Añadir event listener para reproducir el álbum
        const playButton = card.querySelector('.album-play');
        playButton.addEventListener('click', (e) => {
            e.stopPropagation();
            // Llamar a la función del reproductor para cargar y reproducir este álbum
            Player.loadAlbum(album.id);
        });
        
        // Añadir event listener para mostrar detalles del álbum al hacer clic en la tarjeta
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.album-play')) {
                this.showAlbumDetails(album.id);
            }
        });
        
        this.elements.albumsGrid.appendChild(card);
    },

    /**
     * Muestra los detalles de un álbum
     * @param {number} albumId - ID del álbum a mostrar
     */
    async showAlbumDetails(albumId) {
        try {
            // Guardar el ID del álbum actual
            this.state.currentAlbumId = albumId;
            
            // Obtener datos del álbum y sus pistas
            const album = await DB.getAlbumById(albumId);
            const tracks = await DB.getTracksByAlbumId(albumId);
            
            if (!album) {
                throw new Error('Álbum no encontrado');
            }
            
            // Actualizar la interfaz con los datos del álbum
            this.elements.detailCover.src = album.coverImage || 'images/placeholder.jpg';
            this.elements.detailTitle.textContent = album.title;
            this.elements.detailArtist.textContent = album.artist;
            this.elements.detailYear.textContent = album.year;
            
            // Actualizar lista de pistas
            this.elements.detailTracksList.innerHTML = '';
            
            if (tracks.length === 0) {
                const emptyState = document.createElement('div');
                emptyState.className = 'empty-state';
                emptyState.innerHTML = `
                    <i class="fas fa-music"></i>
                    <p>Este álbum no tiene canciones</p>
                    <p>Añade pistas usando el botón de arriba</p>
                `;
                this.elements.detailTracksList.appendChild(emptyState);
            } else {
                // Crear tabla para la lista de pistas
                const table = document.createElement('table');
                table.className = 'tracks-table';
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th class="track-select"><input type="checkbox" id="select-all-tracks" aria-label="Seleccionar todas las pistas"></th>
                            <th class="track-number">#</th>
                            <th class="track-title">Título</th>
                            <th class="track-actions">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tracks-table-body"></tbody>
                `;
                
                this.elements.detailTracksList.appendChild(table);
                const tableBody = document.getElementById('tracks-table-body');
                
                // Crear filas para cada pista
                tracks.forEach((track, index) => {
                    const row = document.createElement('tr');
                    row.className = 'track-row';
                    row.setAttribute('data-track-id', track.id);
                    row.innerHTML = `
                        <td class="track-select"><input type="checkbox" class="track-checkbox" data-track-id="${track.id}"></td>
                        <td class="track-number">${index + 1}</td>
                        <td class="track-title track-name">${track.title}</td>
                        <td class="track-actions">
                            <button class="track-play-btn control-btn" title="Reproducir"><i class="fas fa-play"></i></button>
                            <button class="track-edit-btn control-btn" title="Editar"><i class="fas fa-edit"></i></button>
                            <button class="track-delete-btn control-btn" title="Eliminar"><i class="fas fa-trash"></i></button>
                        </td>
                    `;
                    
                    tableBody.appendChild(row);
                    
                    // Configurar los eventos para esta pista
                    const playBtn = row.querySelector('.track-play-btn');
                    const editBtn = row.querySelector('.track-edit-btn');
                    const deleteBtn = row.querySelector('.track-delete-btn');
                    const trackTitle = row.querySelector('.track-name');
                    
                    // Doble clic en título de la canción para reproducir
                    trackTitle.addEventListener('dblclick', () => this.playTrack(track.id));
                    
                    // Doble clic en la fila para reproducir
                    row.addEventListener('dblclick', (e) => {
                        // Verificar que no se hizo doble clic en un botón o checkbox
                        if (!e.target.closest('button') && !e.target.closest('input[type="checkbox"]')) {
                            this.playTrack(track.id);
                        }
                    });
                    
                    // Clicks en botones
                    playBtn.addEventListener('click', () => this.playTrack(track.id));
                    editBtn.addEventListener('click', () => this.openEditTrackModal(track.id));
                    deleteBtn.addEventListener('click', () => this.confirmDeleteItem('track', track.id));
                });
                
                // Evento para seleccionar/deseleccionar todas las pistas
                const selectAllCheckbox = document.getElementById('select-all-tracks');
                selectAllCheckbox.addEventListener('change', () => {
                    const checkboxes = document.querySelectorAll('.track-checkbox');
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = selectAllCheckbox.checked;
                    });
                    this.updateSelectedTracksActions();
                });
                
                // Evento para cada checkbox
                const trackCheckboxes = document.querySelectorAll('.track-checkbox');
                trackCheckboxes.forEach(checkbox => {
                    checkbox.addEventListener('change', () => {
                        this.updateSelectedTracksActions();
                    });
                });
                
                // Añadir botones de acciones para pistas seleccionadas
                const selectedActionsDiv = document.createElement('div');
                selectedActionsDiv.id = 'selected-tracks-actions';
                selectedActionsDiv.className = 'selected-tracks-actions hidden';
                selectedActionsDiv.innerHTML = `
                    <span id="selected-count">0 pistas seleccionadas</span>
                    <button id="play-selected-btn" class="primary-btn small-btn"><i class="fas fa-play"></i> Reproducir</button>
                    <button id="deselect-all-btn" class="secondary-btn small-btn"><i class="fas fa-times"></i> Deseleccionar</button>
                `;
                
                // Insertar antes de la tabla
                this.elements.detailTracksList.insertBefore(selectedActionsDiv, table);
                
                // Configurar eventos para los botones de pistas seleccionadas
                document.getElementById('play-selected-btn').addEventListener('click', () => {
                    this.playSelectedTracks();
                });
                
                document.getElementById('deselect-all-btn').addEventListener('click', () => {
                    const checkboxes = document.querySelectorAll('.track-checkbox');
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = false;
                    });
                    document.getElementById('select-all-tracks').checked = false;
                    this.updateSelectedTracksActions();
                });
            }
            
            // Actualizar el click handler del botón de añadir canción
            document.getElementById('add-track-to-album-btn').onclick = (e) => {
                e.preventDefault();
                this.openAddTrackModal(albumId);
            };
            
            // Actualizar el click handler del botón de reproducir álbum
            document.getElementById('play-album-btn').onclick = (e) => {
                e.preventDefault();
                if (tracks.length > 0) {
                    Player.loadAlbum(albumId);
                } else {
                    this.showNotification('Este álbum no tiene canciones para reproducir', 'error');
                }
            };
            
            // Actualizar el click handler del botón de editar álbum
            document.getElementById('edit-album-btn').onclick = (e) => {
                e.preventDefault();
                this.openEditAlbumModal(albumId);
            };
            
            // Actualizar el click handler del botón de eliminar álbum
            document.getElementById('delete-album-btn').onclick = (e) => {
                e.preventDefault();
                this.confirmDeleteItem('album', albumId);
            };
            
            // Mostrar la vista de detalle y ocultar la principal
            document.getElementById('main-view').classList.remove('active-view');
            document.getElementById('storage-view').classList.remove('active-view');
            document.getElementById('album-detail-view').classList.add('active-view');
            
            // Mostrar información del usuario que subió el álbum
            if (this.elements.albumUploader) {
                this.elements.albumUploader.textContent = this.state.currentUser.username;
            }

            // Actualizar contadores para el perfil
            this.updateUserProfileStats();
            
        } catch (error) {
            console.error('Error al mostrar detalles del álbum:', error);
            this.showNotification('Error al cargar los detalles del álbum', 'error');
        }
    },

    /**
     * Actualiza la UI para mostrar las acciones para pistas seleccionadas
     */
    updateSelectedTracksActions() {
        const selectedCheckboxes = document.querySelectorAll('.track-checkbox:checked');
        const count = selectedCheckboxes.length;
        const actionsDiv = document.getElementById('selected-tracks-actions');
        
        if (!actionsDiv) return;
        
        if (count > 0) {
            // Mostrar la barra de acciones
            actionsDiv.classList.remove('hidden');
            
            // Actualizar el contador
            const countText = count === 1 ? '1 pista seleccionada' : `${count} pistas seleccionadas`;
            document.getElementById('selected-count').textContent = countText;
        } else {
            // Ocultar la barra de acciones
            actionsDiv.classList.add('hidden');
        }
    },
    
    /**
     * Resalta la pista actual en la interfaz
     */
    highlightCurrentTrack() {
        try {
            // Eliminar resaltado de todas las pistas
            document.querySelectorAll('.track-row').forEach(row => {
                row.classList.remove('playing');
                // Actualizar el icono del botu00f3n de reproducciu00f3n
                const playBtn = row.querySelector('.track-play-btn i');
                if (playBtn) playBtn.className = 'fas fa-play';
            });
            
            // Si no hay reproducciu00f3n activa, salir
            if (!Player.state.isPlaying || !Player.state.tracks.length) {
                return;
            }
            
            // Obtener la pista actual
            const currentTrack = Player.state.tracks[Player.state.currentTrackIndex];
            if (!currentTrack) return;
            
            // Encontrar y resaltar la fila correspondiente
            const trackRow = document.querySelector(`.track-row[data-track-id="${currentTrack.id}"]`);
            if (trackRow) {
                // Resaltar la fila
                trackRow.classList.add('playing');
                
                // Cambiar el icono del botuu00f3n a pausa
                const playBtn = trackRow.querySelector('.track-play-btn i');
                if (playBtn) playBtn.className = 'fas fa-pause';
                
                // Hacer scroll a la vista si es necesario y estu00e1 fuera del viewport
                const rect = trackRow.getBoundingClientRect();
                const isInViewport = (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
                
                if (!isInViewport) {
                    trackRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        } catch (error) {
            console.error('Error al resaltar pista actual:', error);
        }
    },

    /**
     * Reproduce las pistas seleccionadas
     */
    async playSelectedTracks() {
        try {
            // Obtener los IDs de las pistas seleccionadas
            const selectedCheckboxes = document.querySelectorAll('.track-checkbox:checked');
            const selectedTrackIds = Array.from(selectedCheckboxes).map(checkbox => 
                parseInt(checkbox.getAttribute('data-track-id'))
            );
            
            if (selectedTrackIds.length === 0) {
                this.showNotification('No hay pistas seleccionadas', 'info');
                return;
            }
            
            // Obtener los objetos de pista completos
            const selectedTracks = [];
            for (const id of selectedTrackIds) {
                const track = await DB.getTrackById(id);
                if (track) {
                    selectedTracks.push(track);
                }
            }
            
            if (selectedTracks.length === 0) {
                throw new Error('No se encontraron las pistas seleccionadas');
            }
            
            // Reproducir la lista personalizada
            Player.playCustomTrackList(selectedTracks, this.state.currentAlbumId);
            
            // Mostrar notificaciu00f3n
            this.showNotification(`Reproduciendo ${selectedTracks.length} pistas seleccionadas`, 'info');
        } catch (error) {
            console.error('Error al reproducir pistas seleccionadas:', error);
            this.showNotification('Error al reproducir las pistas seleccionadas', 'error');
        }
    },

    /**
     * Reproduce una pista específica
     * @param {number} trackId - ID de la pista a reproducir
     */
    async playTrack(trackId) {
        try {
            // Obtener la pista
            const track = await DB.getTrackById(trackId);
            if (!track) {
                throw new Error('Pista no encontrada');
            }
            
            // Obtener todas las pistas del álbum actual
            const albumId = track.albumId;
            const allTracks = await DB.getTracksByAlbumId(albumId);
            
            // Encontrar el índice de la pista seleccionada
            const trackIndex = allTracks.findIndex(t => t.id === trackId);
            
            if (trackIndex === -1) {
                throw new Error('Pista no encontrada en el álbum');
            }
            
            // Cargar el álbum en el reproductor comenzando por esta pista
            Player.loadAlbum(albumId, trackIndex);
            
            // Resaltar la pista actual en la UI
            this.highlightCurrentTrack();
        } catch (error) {
            console.error('Error al reproducir pista:', error);
            this.showNotification('Error al reproducir la pista', 'error');
        }
    },

    /**
     * Abre el modal para editar un álbum
     * @param {number} albumId - ID del álbum a editar
     */
    async openEditAlbumModal(albumId) {
        try {
            const album = await DB.getAlbumById(albumId);
            if (!album) {
                throw new Error('Álbum no encontrado');
            }
            
            // Llenar el formulario con los datos actuales
            this.elements.editAlbumId.value = album.id;
            this.elements.editAlbumTitle.value = album.title;
            this.elements.editAlbumArtist.value = album.artist;
            this.elements.editAlbumYear.value = album.year;
            this.elements.editCoverPreview.src = album.coverImage;
            
            // Mostrar el modal
            this.elements.editAlbumModal.style.display = 'block';
            
        } catch (error) {
            console.error('Error al abrir edición:', error);
            this.showNotification('Error al cargar los datos del álbum', 'error');
        }
    },

    /**
     * Maneja el envío del formulario de edición de álbum
     */
    async handleEditAlbumSubmit() {
        try {
            const albumId = parseInt(this.elements.editAlbumId.value);
            
            // Obtener el álbum actual para mantener la imagen si no se cambia
            const currentAlbum = await DB.getAlbumById(albumId);
            if (!currentAlbum) {
                throw new Error('Álbum no encontrado');
            }
            
            // Preparar datos actualizados
            const albumData = {
                id: albumId,
                title: this.elements.editAlbumTitle.value,
                artist: this.elements.editAlbumArtist.value,
                year: parseInt(this.elements.editAlbumYear.value),
                coverImage: currentAlbum.coverImage // Mantener la imagen actual por defecto
            };
            
            // Si se seleccionó una nueva imagen, actualizarla
            if (this.elements.editAlbumCover.files[0]) {
                albumData.coverImage = await this.readFileAsDataUrl(this.elements.editAlbumCover.files[0]);
            }
            
            // Actualizar en la base de datos
            await DB.updateAlbum(albumData);
            
            // Cerrar modal y actualizar vistas
            this.closeModal(this.elements.editAlbumModal);
            
            // Si el modal de detalles está abierto, actualizarlo
            if (this.elements.albumDetailView.style.display === 'block') {
                this.showAlbumDetails(albumId);
            }
            
            // Actualizar lista de álbumes
            this.renderAlbums();
            
            this.showNotification('Álbum actualizado correctamente', 'success');
            
        } catch (error) {
            console.error('Error al editar álbum:', error);
            this.showNotification('Error al actualizar el álbum', 'error');
        }
    },

    /**
     * Abre el modal para editar una pista
     * @param {number} trackId - ID de la pista a editar
     */
    async openEditTrackModal(trackId) {
        try {
            const track = await DB.getTrackById(trackId);
            if (!track) {
                throw new Error('Pista no encontrada');
            }
            
            // Llenar el formulario con los datos actuales
            this.elements.editTrackId.value = track.id;
            this.elements.editTrackAlbumId.value = track.albumId;
            this.elements.editTrackTitle.value = track.title;
            
            // Mostrar el modal
            this.elements.editTrackModal.style.display = 'block';
            
        } catch (error) {
            console.error('Error al abrir edición de pista:', error);
            this.showNotification('Error al cargar los datos de la pista', 'error');
        }
    },

    /**
     * Maneja el envío del formulario de edición de pista
     */
    async handleEditTrackSubmit() {
        try {
            const trackId = parseInt(this.elements.editTrackId.value);
            const albumId = parseInt(this.elements.editTrackAlbumId.value);
            
            // Obtener la pista actual para mantener el audio si no se cambia
            const currentTrack = await DB.getTrackById(trackId);
            if (!currentTrack) {
                throw new Error('Pista no encontrada');
            }
            
            // Preparar datos actualizados
            const trackData = {
                id: trackId,
                albumId: albumId,
                title: this.elements.editTrackTitle.value,
                audioFile: currentTrack.audioFile // Mantener el audio actual por defecto
            };
            
            // Si se seleccionó un nuevo archivo de audio, actualizarlo
            if (this.elements.editTrackFile.files[0]) {
                trackData.audioFile = await this.readFileAsDataUrl(this.elements.editTrackFile.files[0]);
            }
            
            // Actualizar en la base de datos
            await DB.updateTrack(trackData);
            
            // Cerrar modal y actualizar vistas
            this.closeModal(this.elements.editTrackModal);
            
            // Si el modal de detalles está abierto, actualizarlo
            if (this.elements.albumDetailView.style.display === 'block') {
                this.showAlbumDetails(albumId);
            }
            
            this.showNotification('Pista actualizada correctamente', 'success');
            
        } catch (error) {
            console.error('Error al editar pista:', error);
            this.showNotification('Error al actualizar la pista', 'error');
        }
    },

    /**
     * Abre el modal para añadir una pista a un álbum existente
     * @param {number} albumId - ID del álbum al que se añadirá la pista
     */
    openAddTrackModal(albumId) {
        this.elements.addTrackAlbumId.value = albumId;
        this.elements.addTrackForm.reset();
        this.elements.addTrackModal.style.display = 'block';
    },

    /**
     * Maneja el envío del formulario para añadir una pista a un álbum existente
     */
    async handleAddTrackToAlbumSubmit() {
        try {
            const albumId = parseInt(this.elements.addTrackAlbumId.value);
            
            // Validar que se haya seleccionado un archivo de audio
            if (!this.elements.addTrackFile.files[0]) {
                this.showNotification('Selecciona un archivo de audio', 'error');
                return;
            }
            
            // Preparar datos de la nueva pista
            const trackData = {
                albumId: albumId,
                title: this.elements.addTrackTitle.value,
                audioFile: await this.readFileAsDataUrl(this.elements.addTrackFile.files[0])
            };
            
            // Guardar en la base de datos
            await DB.addTrack(trackData);
            
            // Cerrar modal y actualizar vistas
            this.closeModal(this.elements.addTrackModal);
            
            // Si el modal de detalles está abierto, actualizarlo
            if (this.elements.albumDetailView.style.display === 'block') {
                this.showAlbumDetails(albumId);
            }
            
            this.showNotification('Pista añadida correctamente', 'success');
            
        } catch (error) {
            console.error('Error al añadir pista:', error);
            this.showNotification('Error al añadir la pista', 'error');
        }
    },

    /**
     * Muestra un modal de confirmación para eliminar un elemento
     * @param {string} type - Tipo de elemento ('album' o 'track')
     * @param {number} id - ID del elemento a eliminar
     * @param {string} message - Mensaje de confirmación
     */
    confirmDeleteItem(type, id, message) {
        this.state.deleteItemType = type;
        this.elements.confirmDeleteMessage.textContent = message;
        
        // Configurar callback de eliminación según el tipo
        if (type === 'album') {
            this.state.confirmCallback = () => this.deleteAlbum(id);
        } else if (type === 'track') {
            this.state.confirmCallback = () => this.deleteTrack(id);
        }
        
        this.elements.confirmDeleteModal.style.display = 'block';
    },

    /**
     * Elimina un álbum
     * @param {number} albumId - ID del álbum a eliminar
     */
    async deleteAlbum(albumId) {
        try {
            await DB.deleteAlbum(albumId);
            
            // Cerrar modal de detalles si está abierto
            this.closeModal(this.elements.albumDetailView);
            
            // Actualizar lista de álbumes
            this.renderAlbums();
            
            this.showNotification('Álbum eliminado correctamente', 'success');
            
        } catch (error) {
            console.error('Error al eliminar álbum:', error);
            this.showNotification('Error al eliminar el álbum', 'error');
        }
    },

    /**
     * Elimina una pista
     * @param {number} trackId - ID de la pista a eliminar
     */
    async deleteTrack(trackId) {
        try {
            // Obtener la pista para conocer su álbum
            const track = await DB.getTrackById(trackId);
            if (!track) {
                throw new Error('Pista no encontrada');
            }
            
            const albumId = track.albumId;
            
            // Eliminar la pista
            await DB.deleteTrack(trackId);
            
            // Si el modal de detalles está abierto, actualizarlo
            if (this.elements.albumDetailView.style.display === 'block') {
                this.showAlbumDetails(albumId);
            }
            
            this.showNotification('Pista eliminada correctamente', 'success');
            
        } catch (error) {
            console.error('Error al eliminar pista:', error);
            this.showNotification('Error al eliminar la pista', 'error');
        }
    },

    /**
     * Cambia a la vista principal (grid de álbumes)
     */
    showMainView() {
        document.getElementById('main-view').classList.add('active-view');
        document.getElementById('album-detail-view').classList.remove('active-view');
        document.getElementById('storage-view').classList.remove('active-view');
        this.state.currentAlbumId = null;
    },

    /**
     * Muestra la vista de almacenamiento local
     */
    async showStorageView() {
        try {
            // Obtener estadísticas de almacenamiento
            const albums = await DB.getAllAlbums();
            const tracks = await DB.getAllTracks();
            
            // Calcular el tamaño total aproximado
            let totalSize = 0;
            
            // Sumar el tamaño aproximado de las imágenes
            albums.forEach(album => {
                // Estimar el tamaño de cada imagen (en bytes)
                const imgSize = this.estimateDataURLSize(album.coverImage);
                totalSize += imgSize;
            });
            
            // Sumar el tamaño aproximado de los archivos de audio
            tracks.forEach(track => {
                // Estimar el tamaño de cada archivo de audio (en bytes)
                const audioSize = this.estimateDataURLSize(track.audioFile);
                totalSize += audioSize;
            });
            
            // Mostrar los datos en la interfaz
            this.elements.totalAlbumsCount.textContent = albums.length;
            this.elements.totalTracksCount.textContent = tracks.length;
            this.elements.storageUsed.textContent = this.formatBytes(totalSize);
            
            // Mostrar la vista de almacenamiento
            document.getElementById('main-view').classList.remove('active-view');
            document.getElementById('album-detail-view').classList.remove('active-view');
            document.getElementById('storage-view').classList.add('active-view');
            
        } catch (error) {
            console.error('Error al mostrar almacenamiento:', error);
            this.showNotification('Error al cargar los datos de almacenamiento', 'error');
        }
    },

    /**
     * Estima el tamaño de un Data URL en bytes
     * @param {string} dataURL - Data URL a estimar
     * @returns {number} - Tamaño estimado en bytes
     */
    estimateDataURLSize(dataURL) {
        if (!dataURL) return 0;
        // Quitar el encabezado (data:image/jpeg;base64,) para obtener solo los datos codificados
        const base64Data = dataURL.split(',')[1];
        if (!base64Data) return 0;
        
        // Calcular el tamaño aproximado
        return Math.floor((base64Data.length * 3) / 4);
    },

    /**
     * Formatea un tamaño en bytes a una unidad legible
     * @param {number} bytes - Tamaño en bytes
     * @returns {string} - Tamaño formateado (KB, MB, etc.)
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    /**
     * Formatea segundos a formato mm:ss
     * @param {number} seconds - Segundos a formatear
     * @returns {string} - Tiempo formateado
     */
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    },

    /**
     * Actualiza el icono de volumen según el nivel
     * @param {number} volume - Nivel de volumen (0-1)
     */
    updateVolumeIcon(volume) {
        const volumeIcon = document.getElementById('volume-icon');
        if (volume === 0) {
            volumeIcon.className = 'fas fa-volume-mute volume-icon';
        } else if (volume < 0.5) {
            volumeIcon.className = 'fas fa-volume-down volume-icon';
        } else {
            volumeIcon.className = 'fas fa-volume-up volume-icon';
        }
    },

    /**
     * Elimina todos los datos de la aplicación
     */
    async clearAllStorage() {
        try {
            await DB.clearAllData();
            this.renderAlbums();
            this.showStorageView();
            this.showNotification('Todos los datos han sido eliminados correctamente', 'success');
        } catch (error) {
            console.error('Error al eliminar datos:', error);
            this.showNotification('Error al eliminar los datos', 'error');
        }
    },
    
    /**
     * Abre el modal de configuración
     */
    openSettingsModal() {
        // Actualizar controles con la configuración actual
        this.elements.autoplaySetting.checked = this.state.settings.autoplay;
        this.elements.skipSecondsSetting.value = this.state.settings.skipSeconds;
        this.elements.notificationsPositionSetting.value = this.state.settings.notificationsPosition;
        this.elements.notificationDurationSetting.value = this.state.settings.notificationDuration;
        this.elements.compactModeSetting.checked = this.state.settings.compactMode;
        
        // Nuevos controles
        if (this.elements.animationsSetting) {
            this.elements.animationsSetting.checked = this.state.settings.animations;
        }
        
        if (this.elements.themeMode) {
            this.elements.themeMode.value = this.state.settings.themeMode;
        }
        
        if (this.elements.accentColor) {
            this.elements.accentColor.value = this.state.settings.accentColor;
        }
        
        if (this.elements.visualizerEnabled) {
            this.elements.visualizerEnabled.checked = this.state.settings.visualizerEnabled;
        }
        
        if (this.elements.visualizerType) {
            this.elements.visualizerType.value = this.state.settings.visualizerType;
        }
        
        if (this.elements.transitionEffect) {
            this.elements.transitionEffect.value = this.state.settings.transitionEffect;
        }
        
        // Mostrar modal
        this.elements.settingsModal.style.display = 'block';
    },
    
    /**
     * Aplica todas las configuraciones desde el estado actual
     */
    applyAllSettings() {
        // Aplicar tema
        this.applyThemeMode();
        
        // Aplicar color de acento
        this.applyAccentColor();
        
        // Aplicar modo compacto
        this.applyCompactMode();
        
        // Aplicar animaciones
        if (this.state.settings.animations) {
            document.body.classList.remove('no-animations');
        } else {
            document.body.classList.add('no-animations');
        }
        
        // Manejar visualizador de audio
        if (this.state.settings.visualizerEnabled) {
            this.initAudioVisualizer();
            // Renderizar el tipo de visualizador seleccionado
            if (this.state.settings.visualizerType === 'bars') {
                this.renderBarsVisualizer();
            } else if (this.state.settings.visualizerType === 'wave') {
                this.renderWaveVisualizer();
            } else if (this.state.settings.visualizerType === 'circle') {
                this.renderCircleVisualizer();
            }
        } else if (this.state.animationFrame) {
            cancelAnimationFrame(this.state.animationFrame);
        }
        
        // Actualizar configuraciu00f3n del reproductor
        if (Player && typeof Player.updateSettings === 'function') {
            Player.updateSettings(this.state.settings);
        }
        
        // Aplicar configuraciones de ecualizador
        this.initEqualizer();
    },
    
    /**
     * Guarda la configuraciu00f3n actual en localStorage
     */
    saveSettings() {
        // Recopilar valores de los controles bu00e1sicos
        this.state.settings.autoplay = this.elements.autoplaySetting.checked;
        this.state.settings.skipSeconds = parseInt(this.elements.skipSecondsSetting.value);
        this.state.settings.notificationsPosition = this.elements.notificationsPositionSetting.value;
        this.state.settings.notificationDuration = parseInt(this.elements.notificationDurationSetting.value);
        this.state.settings.compactMode = this.elements.compactModeSetting.checked;
        
        // Recopilar valores de los nuevos controles
        if (this.elements.animationsSetting) {
            this.state.settings.animations = this.elements.animationsSetting.checked;
        }
        
        if (this.elements.themeMode) {
            this.state.settings.themeMode = this.elements.themeMode.value;
        }
        
        if (this.elements.accentColor) {
            this.state.settings.accentColor = this.elements.accentColor.value;
        }
        
        if (this.elements.visualizerEnabled) {
            this.state.settings.visualizerEnabled = this.elements.visualizerEnabled.checked;
        }
        
        if (this.elements.visualizerType) {
            this.state.settings.visualizerType = this.elements.visualizerType.value;
        }
        
        if (this.elements.transitionEffect) {
            this.state.settings.transitionEffect = this.elements.transitionEffect.value;
        }
        
        // Guardar configuraciones de ecualizador
        this.state.settings.equalizer = {
            bass: this.state.equalizer.bass,
            mid: this.state.equalizer.mid,
            treble: this.state.equalizer.treble,
            preset: this.state.equalizer.currentPreset
        };

        // Guardar en localStorage
        localStorage.setItem('musicAppSettings', JSON.stringify(this.state.settings));
        
        // Aplicar todos los cambios inmediatamente
        this.applyAllSettings();
        
        // Notificar al usuario
        this.showNotification('Configuraciu00f3n guardada', 'success', 1000);
    },
    
    /**
     * Carga la configuraciu00f3n guardada
     */
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('musicAppSettings');
            if (savedSettings) {
                // Fusionar con la configuraciu00f3n predeterminada
                const parsedSettings = JSON.parse(savedSettings);
                this.state.settings = { ...this.state.settings, ...parsedSettings };
                
                // Restaurar configuraciones de ecualizador si existen
                if (parsedSettings.equalizer) {
                    this.state.equalizer.bass = parsedSettings.equalizer.bass || 0;
                    this.state.equalizer.mid = parsedSettings.equalizer.mid || 0;
                    this.state.equalizer.treble = parsedSettings.equalizer.treble || 0;
                    this.state.equalizer.currentPreset = parsedSettings.equalizer.preset || 'flat';
                }
            }
            
            // Cargar información del usuario si existe
            this.loadUserProfile();
            
            // Aplicar todas las configuraciones inmediatamente
            this.applyAllSettings();
        } catch (error) {
            console.error('Error al cargar la configuraciu00f3n:', error);
        }
    },
    
    /**
     * Aplica el efecto de transición seleccionado a un elemento
     * @param {HTMLElement} element - Elemento al que aplicar la transición
     */
    applyTransitionEffect(element) {
        if (!element || !this.state.settings.animations) return;
        
        // Eliminar clases de transición anteriores
        element.classList.remove('transition-fade', 'transition-slide', 'transition-zoom');
        
        // Aplicar el efecto seleccionado
        const effect = this.state.settings.transitionEffect;
        if (effect && effect !== 'none') {
            element.classList.add(`transition-${effect}`);
        }
    },
    
    /**
     * Abre el modal de perfil de usuario
     */
    openUserProfileModal() {
        try {
            // Cargar datos actuales del usuario en el modal
            if (this.elements.profileUsername) {
                this.elements.profileUsername.textContent = this.state.currentUser.username || 'Usuario';
            }
            
            if (this.elements.profileBio) {
                this.elements.profileBio.textContent = this.state.currentUser.bio || 'Sin biografu00eda';
            }
            
            if (this.elements.profileAvatar) {
                this.elements.profileAvatar.src = this.state.currentUser.avatar || 'images/placeholder.jpg';
            }
            
            // Actualizar contadores
            this.updateUserProfileStats();
            
            // Mostrar vista de perfil (no de ediciu00f3n)
            this.showProfileView();
            
            // Mostrar el modal
            if (this.elements.userProfileModal) {
                this.elements.userProfileModal.classList.add('active');
            }
        } catch (error) {
            console.error('Error al abrir el modal de perfil:', error);
            this.showNotification('Error al abrir el perfil de usuario', 'error');
        }
    },
    
    /**
     * Cierra el modal de perfil de usuario
     */
    closeUserProfileModal() {
        if (this.elements.userProfileModal) {
            this.elements.userProfileModal.classList.remove('active');
        }
    },
    
    /**
     * Muestra la vista de perfil (no ediciu00f3n)
     */
    showProfileView() {
        if (this.elements.profileView && this.elements.profileEdit) {
            this.elements.profileView.style.display = 'flex';
            this.elements.profileEdit.style.display = 'none';
        }
    },
    
    /**
     * Muestra la vista de ediciu00f3n de perfil
     */
    showProfileEditView() {
        try {
            // Llenar el formulario con los datos actuales
            if (this.elements.editUsername) {
                this.elements.editUsername.value = this.state.currentUser.username || 'Usuario';
            }
            
            if (this.elements.editBio) {
                this.elements.editBio.value = this.state.currentUser.bio || 'Sin biografu00eda';
            }
            
            if (this.elements.avatarPreview) {
                this.elements.avatarPreview.src = this.state.currentUser.avatar || 'images/placeholder.jpg';
            }
            
            // Mostrar vista de ediciu00f3n
            if (this.elements.profileView && this.elements.profileEdit) {
                this.elements.profileView.style.display = 'none';
                this.elements.profileEdit.style.display = 'block';
            }
        } catch (error) {
            console.error('Error al mostrar vista de ediciu00f3n de perfil:', error);
        }
    },
    
    /**
     * Maneja el envu00edo del formulario de ediciu00f3n de perfil
     * @param {Event} e - Evento de submit
     */
    handleProfileEditSubmit(e) {
        e.preventDefault();
        
        try {
            // Actualizar datos del usuario
            this.state.currentUser.username = this.elements.editUsername.value;
            this.state.currentUser.bio = this.elements.editBio.value;
            
            // Si hay una nueva imagen de avatar, usar esa
            if (this.uploadedAvatar) {
                this.state.currentUser.avatar = this.uploadedAvatar;
                this.uploadedAvatar = null; // Limpiar despuu00e9s de usar
            }
            
            // Guardar en localStorage
            this.saveUserProfile();
            
            // Volver a la vista de perfil
            this.showProfileView();
            
            // Actualizar la interfaz con los nuevos datos
            if (this.elements.profileUsername) {
                this.elements.profileUsername.textContent = this.state.currentUser.username;
            }
            
            if (this.elements.profileBio) {
                this.elements.profileBio.textContent = this.state.currentUser.bio;
            }
            
            if (this.elements.profileAvatar) {
                this.elements.profileAvatar.src = this.state.currentUser.avatar;
            }
            
            // Mostrar notificaciu00f3n
            this.showNotification('Perfil actualizado correctamente', 'success');
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            this.showNotification('Error al actualizar el perfil', 'error');
        }
    },
    
    /**
     * Maneja la vista previa del avatar
     * @param {Event} e - Evento de cambio de input
     */
    handleAvatarPreview(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Comprobar que sea una imagen
        if (!file.type.startsWith('image/')) {
            this.showNotification('El archivo seleccionado no es una imagen', 'error');
            return;
        }
        
        // Actualizar el nombre del archivo
        const fileNameElement = e.target.parentElement.querySelector('.file-name');
        if (fileNameElement) {
            fileNameElement.textContent = file.name;
        }
        
        // Crear vista previa
        const reader = new FileReader();
        reader.onload = (event) => {
            this.elements.avatarPreview.src = event.target.result;
            this.uploadedAvatar = event.target.result; // Guardar para uso posterior
        };
        reader.readAsDataURL(file);
    },
    
    /**
     * Guarda el perfil del usuario en localStorage
     */
    saveUserProfile() {
        try {
            localStorage.setItem('musicAppUserProfile', JSON.stringify(this.state.currentUser));
        } catch (error) {
            console.error('Error al guardar perfil de usuario:', error);
        }
    },
    
    /**
     * Carga el perfil del usuario desde localStorage
     */
    loadUserProfile() {
        try {
            const savedProfile = localStorage.getItem('musicAppUserProfile');
            if (savedProfile) {
                const parsedProfile = JSON.parse(savedProfile);
                this.state.currentUser = { ...this.state.currentUser, ...parsedProfile };
            }
        } catch (error) {
            console.error('Error al cargar perfil de usuario:', error);
        }
    },
    
    /**
     * Actualiza las estadu00edsticas del perfil de usuario
     */
    updateUserProfileStats() {
        try {
            // Actualizar contador de u00e1lbumes
            if (this.elements.profileAlbumsCount) {
                let albumCount = 0;
                const albumsGridItems = document.querySelectorAll('#albums-grid .album-card');
                if (albumsGridItems) {
                    albumCount = albumsGridItems.length;
                }
                this.state.currentUser.albums = albumCount;
                this.elements.profileAlbumsCount.textContent = albumCount;
            }
            
            // Actualizar contador de pistas (esto podru00eda ser aproximado)
            if (this.elements.profileTracksCount) {
                // Una forma simplificada: podemos asumir un promedio de pistas por u00e1lbum
                // o mejor, podemos obtener el nu00famero real si tenemos acceso a esos datos
                const trackCount = this.state.currentUser.albums * 5; // Asumiendo un promedio de 5 pistas por u00e1lbum
                this.state.currentUser.tracks = trackCount;
                this.elements.profileTracksCount.textContent = trackCount;
            }
        } catch (error) {
            console.error('Error al actualizar estadu00edsticas de perfil:', error);
        }
    },
    
    /**
     * Aplica el modo compacto si estu00e1 activado
     */
    applyCompactMode() {
        if (this.state.settings.compactMode) {
            document.body.classList.add('compact-mode');
        } else {
            document.body.classList.remove('compact-mode');
        }
    },
    
    /**
     * Aplica el modo de tema segu00fan la configuraciu00f3n
     */
    applyThemeMode() {
        const body = document.body;
        if (this.state.settings.themeMode === 'light') {
            body.classList.add('light-mode');
            body.classList.remove('dark-mode');
        } else if (this.state.settings.themeMode === 'dark') {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
        } else if (this.state.settings.themeMode === 'auto') {
            // Obtener la preferencia del sistema
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                body.classList.add('dark-mode');
                body.classList.remove('light-mode');
            } else {
                body.classList.add('light-mode');
                body.classList.remove('dark-mode');
            }
        }
    },
    
    /**
     * Aplica el color de acento segu00fan la configuraciu00f3n
     */
    applyAccentColor() {
        const accentColor = this.state.settings.accentColor;
        document.body.style.setProperty('--accent-color', accentColor);
    },
    
    /**
     * Muestra un diu00e1logo de confirmaciu00f3n personalizado
     * @param {string} message - Mensaje a mostrar
     * @param {Function} callback - Funciu00f3n a ejecutar si se confirma
     */
    showConfirmDialog(message, callback) {
        this.elements.confirmDeleteMessage.textContent = message;
        this.state.confirmCallback = callback;
        this.elements.confirmDeleteModal.style.display = 'block';
    },
    
    /**
     * Inicializa el visualizador de audio
     */
    initAudioVisualizer() {
        try {
            // Verificar si ya existe un contenedor para el visualizador
            let visualizerContainer = document.querySelector('.audio-visualizer');
            if (!visualizerContainer) {
                // Crear un contenedor para el visualizador y au00f1adirlo al reproductor
                visualizerContainer = document.createElement('div');
                visualizerContainer.className = 'audio-visualizer';
                const playerControls = document.querySelector('.player-controls');
                if (playerControls) {
                    playerControls.parentNode.insertBefore(visualizerContainer, playerControls.nextSibling);
                }
            }
            
            // Limpiar el contenedor existente
            visualizerContainer.innerHTML = '';
            
            // Crear el contenedor especu00edfico segu00fan el tipo de visualizador
            const container = document.createElement('div');
            
            if (this.state.settings.visualizerType === 'bars') {
                container.className = 'visualizer-container';
                // Crear barras para el visualizador
                for (let i = 0; i < 30; i++) {
                    const bar = document.createElement('div');
                    bar.className = 'visualizer-bar';
                    container.appendChild(bar);
                }
            } else if (this.state.settings.visualizerType === 'waves') {
                container.className = 'visualizer-wave';
                const canvas = document.createElement('canvas');
                canvas.width = visualizerContainer.clientWidth;
                canvas.height = visualizerContainer.clientHeight;
                container.appendChild(canvas);
                this.state.visualizer = canvas;
            } else if (this.state.settings.visualizerType === 'circle') {
                container.className = 'visualizer-circle';
                const circleInner = document.createElement('div');
                circleInner.className = 'visualizer-circle-inner';
                container.appendChild(circleInner);
                this.state.visualizer = circleInner;
            }
            
            visualizerContainer.appendChild(container);
            
            // Inicializar Web Audio API si el tipo es diferente de 'none'
            if (this.state.settings.visualizerType !== 'none') {
                this.setupAudioContext();
            }
        } catch (error) {
            console.error('Error al inicializar visualizador:', error);
        }
    },
    
    /**
     * Configura el contexto de audio para la visualizaciu00f3n
     */
    setupAudioContext() {
        try {
            if (!this.state.audioContext && Player && Player.elements && Player.elements.audioPlayer) {
                this.state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                // Crear nodo de fuente si el reproductor existe
                const source = this.state.audioContext.createMediaElementSource(Player.elements.audioPlayer);
                
                // Crear analizador si no existe
                if (!this.state.analyser) {
                    this.state.analyser = this.state.audioContext.createAnalyser();
                    this.state.analyser.fftSize = 64;
                    const bufferLength = this.state.analyser.frequencyBinCount;
                    this.state.visualData = new Uint8Array(bufferLength);
                    
                    // Conectar fuente de audio
                    source.connect(this.state.analyser);
                    this.state.analyser.connect(this.state.audioContext.destination);
                }
                
                // Iniciar renderizado segu00fan el tipo
                if (this.state.settings.visualizerType === 'bars') {
                    this.renderBarsVisualizer();
                } else if (this.state.settings.visualizerType === 'wave') {
                    this.renderWaveVisualizer();
                } else if (this.state.settings.visualizerType === 'circle') {
                    this.renderCircleVisualizer();
                }
            }
        } catch (error) {
            console.error('Error al configurar contexto de audio:', error);
        }
    },
    
    /**
     * Renderiza el visualizador de barras
     */
    renderBarsVisualizer() {
        try {
            // Cancelar la animaciu00f3n anterior si existe
            if (this.state.animationFrame) {
                cancelAnimationFrame(this.state.animationFrame);
            }
            
            const analyser = this.state.analyser;
            const visualData = this.state.visualData;
            const bars = document.querySelectorAll('.visualizer-bar');
            
            const updateVisualizer = () => {
                if (!this.state.settings.visualizerEnabled || 
                    this.state.settings.visualizerType !== 'bars') {
                    return;
                }
                
                analyser.getByteFrequencyData(visualData);
                
                for (let i = 0; i < bars.length; i++) {
                    const index = Math.floor(i * visualData.length / bars.length);
                    const value = visualData[index];
                    const height = Math.max(3, value / 255 * 40);
                    bars[i].style.height = `${height}px`;
                }
                
                this.state.animationFrame = requestAnimationFrame(updateVisualizer);
            };
            
            this.state.animationFrame = requestAnimationFrame(updateVisualizer);
        } catch (error) {
            console.error('Error al renderizar visualizador de barras:', error);
        }
    },
    
    /**
     * Renderiza el visualizador de ondas
     */
    renderWaveVisualizer() {
        try {
            // Cancelar la animaciu00f3n anterior si existe
            if (this.state.animationFrame) {
                cancelAnimationFrame(this.state.animationFrame);
            }
            
            const analyser = this.state.analyser;
            const visualData = this.state.visualData;
            const canvas = this.state.visualizer;
            
            if (!canvas || !canvas.getContext) return;
            
            const ctx = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;
            
            const updateVisualizer = () => {
                if (!this.state.settings.visualizerEnabled || 
                    this.state.settings.visualizerType !== 'waves') {
                    return;
                }
                
                analyser.getByteFrequencyData(visualData);
                
                ctx.clearRect(0, 0, width, height);
                ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--accent-light');
                
                // En modo oscuro, usar color de acento para modo oscuro
                if (document.body.classList.contains('dark-mode')) {
                    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--accent-dark');
                }
                
                ctx.beginPath();
                ctx.moveTo(0, height);
                
                const sliceWidth = width / visualData.length;
                let x = 0;
                
                for (let i = 0; i < visualData.length; i++) {
                    const v = visualData[i] / 255;
                    const y = height - (v * height);
                    
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                    
                    x += sliceWidth;
                }
                
                ctx.lineTo(width, height);
                ctx.closePath();
                ctx.fill();
                
                this.state.animationFrame = requestAnimationFrame(updateVisualizer);
            };
            
            this.state.animationFrame = requestAnimationFrame(updateVisualizer);
        } catch (error) {
            console.error('Error al renderizar visualizador de ondas:', error);
        }
    },
    
    /**
     * Renderiza el visualizador circular
     */
    renderCircleVisualizer() {
        try {
            // Cancelar la animaciu00f3n anterior si existe
            if (this.state.animationFrame) {
                cancelAnimationFrame(this.state.animationFrame);
            }
            
            const analyser = this.state.analyser;
            const visualData = this.state.visualData;
            const circle = this.state.visualizer;
            
            if (!circle) return;
            
            const updateVisualizer = () => {
                if (!this.state.settings.visualizerEnabled || 
                    this.state.settings.visualizerType !== 'circle') {
                    return;
                }
                
                analyser.getByteFrequencyData(visualData);
                
                // Calcular promedio de frecuencias bajas (graves)
                let sum = 0;
                for (let i = 0; i < 8; i++) {
                    sum += visualData[i];
                }
                const average = sum / 8;
                
                // Escalar el cu00edrculo basado en la intensidad del audio
                const scale = 1 + (average / 255);
                circle.style.transform = `scale(${scale})`;
                
                this.state.animationFrame = requestAnimationFrame(updateVisualizer);
            };
            
            this.state.animationFrame = requestAnimationFrame(updateVisualizer);
        } catch (error) {
            console.error('Error al renderizar visualizador circular:', error);
        }
    },
    
    /**
     * Inicializa el ecualizador de audio
     */
    initEqualizer() {
        try {
            // Asegurarse de que el contexto de audio esté configurado
            if (!this.state.audioContext && Player && Player.elements && Player.elements.audioPlayer) {
                this.state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                // Crear nodo de fuente si el reproductor existe
                const source = this.state.audioContext.createMediaElementSource(Player.elements.audioPlayer);
                
                // Crear filtros
                // Filtro de graves (baja frecuencia) - Low Shelf Filter
                this.state.equalizer.bassFilter = this.state.audioContext.createBiquadFilter();
                this.state.equalizer.bassFilter.type = 'lowshelf';
                this.state.equalizer.bassFilter.frequency.value = 200;
                
                // Filtro de medios (frecuencia media) - Peaking Filter
                this.state.equalizer.midFilter = this.state.audioContext.createBiquadFilter();
                this.state.equalizer.midFilter.type = 'peaking';
                this.state.equalizer.midFilter.frequency.value = 1000;
                this.state.equalizer.midFilter.Q.value = 1;
                
                // Filtro de agudos (alta frecuencia) - High Shelf Filter
                this.state.equalizer.trebleFilter = this.state.audioContext.createBiquadFilter();
                this.state.equalizer.trebleFilter.type = 'highshelf';
                this.state.equalizer.trebleFilter.frequency.value = 3000;
                
                // Conectar nodos
                source.connect(this.state.equalizer.bassFilter);
                this.state.equalizer.bassFilter.connect(this.state.equalizer.midFilter);
                this.state.equalizer.midFilter.connect(this.state.equalizer.trebleFilter);
                this.state.equalizer.trebleFilter.connect(this.state.audioContext.destination);
                
                // Si hay un analizador, conectarlo después del ecualizador
                if (this.state.analyser) {
                    this.state.equalizer.trebleFilter.disconnect(this.state.audioContext.destination);
                    this.state.equalizer.trebleFilter.connect(this.state.analyser);
                    this.state.analyser.connect(this.state.audioContext.destination);
                }
            }
            
            // Actualizar UI para reflejar los valores actuales
            this.updateEqualizerUI();
            
            // Aplicar valores guardados a los filtros
            if (this.state.equalizer.bassFilter) {
                this.state.equalizer.bassFilter.gain.value = this.state.equalizer.bass;
            }
            
            if (this.state.equalizer.midFilter) {
                this.state.equalizer.midFilter.gain.value = this.state.equalizer.mid;
            }
            
            if (this.state.equalizer.trebleFilter) {
                this.state.equalizer.trebleFilter.gain.value = this.state.equalizer.treble;
            }
            
            // Marcar el preset activo en la UI
            this.highlightActivePreset();
        } catch (error) {
            console.error('Error al inicializar el ecualizador:', error);
        }
    },
    
    /**
     * Actualiza los valores del ecualizador
     * @param {string} band - Banda a actualizar ('bass', 'mid', o 'treble')
     * @param {number} value - Valor en dB (-12 a 12)
     */
    updateEqualizer(band, value) {
        try {
            // Actualizar estado
            this.state.equalizer[band] = value;
            
            // Actualizar filtro correspondiente
            if (this.state.equalizer[`${band}Filter`]) {
                this.state.equalizer[`${band}Filter`].gain.value = value;
            }
            
            // Actualizar UI
            const valueElement = this.elements[`eq${band.charAt(0).toUpperCase() + band.slice(1)}Value`];
            if (valueElement) {
                valueElement.textContent = `${value > 0 ? '+' : ''}${value} dB`;
            }
            
            // Actualizar preset (a personalizado si se ajusta manualmente)
            this.state.equalizer.currentPreset = 'custom';
            this.highlightActivePreset();
            
            // Guardar configuración
            this.saveSettings();
            
            // Notificar al usuario
            this.showNotification(`Ecualizador ajustado`, 'info', 1000);
        } catch (error) {
            console.error(`Error al actualizar el ecualizador (${band}):`, error);
        }
    },
    
    /**
     * Actualiza la UI del ecualizador con los valores actuales
     */
    updateEqualizerUI() {
        // Actualizar sliders
        if (this.elements.eqBassSlider) {
            this.elements.eqBassSlider.value = this.state.equalizer.bass;
            this.elements.eqBassValue.textContent = `${this.state.equalizer.bass > 0 ? '+' : ''}${this.state.equalizer.bass} dB`;
        }
        
        if (this.elements.eqMidSlider) {
            this.elements.eqMidSlider.value = this.state.equalizer.mid;
            this.elements.eqMidValue.textContent = `${this.state.equalizer.mid > 0 ? '+' : ''}${this.state.equalizer.mid} dB`;
        }
        
        if (this.elements.eqTrebleSlider) {
            this.elements.eqTrebleSlider.value = this.state.equalizer.treble;
            this.elements.eqTrebleValue.textContent = `${this.state.equalizer.treble > 0 ? '+' : ''}${this.state.equalizer.treble} dB`;
        }
    },
    
    /**
     * Aplica un preset de ecualizador
     * @param {string} preset - Nombre del preset ('flat', 'bass', 'vocal', 'rock')
     */
    applyEqualizerPreset(preset) {
        try {
            // Definir valores para cada preset
            let bassValue = 0;
            let midValue = 0;
            let trebleValue = 0;
            
            switch (preset) {
                case 'flat':
                    // Valores planos (0 dB en todas las bandas)
                    bassValue = 0;
                    midValue = 0;
                    trebleValue = 0;
                    break;
                case 'bass':
                    // Refuerzo de graves
                    bassValue = 6;
                    midValue = -2;
                    trebleValue = 0;
                    break;
                case 'vocal':
                    // Mejora la claridad vocal
                    bassValue = -2;
                    midValue = 4;
                    trebleValue = 2;
                    break;
                case 'rock':
                    // Perfil para rock
                    bassValue = 3;
                    midValue = 0;
                    trebleValue = 4;
                    break;
                default:
                    return;
            }
            
            // Actualizar estado
            this.state.equalizer.bass = bassValue;
            this.state.equalizer.mid = midValue;
            this.state.equalizer.treble = trebleValue;
            this.state.equalizer.currentPreset = preset;
            
            // Actualizar filtros
            if (this.state.equalizer.bassFilter) {
                this.state.equalizer.bassFilter.gain.value = bassValue;
            }
            
            if (this.state.equalizer.midFilter) {
                this.state.equalizer.midFilter.gain.value = midValue;
            }
            
            if (this.state.equalizer.trebleFilter) {
                this.state.equalizer.trebleFilter.gain.value = trebleValue;
            }
            
            // Actualizar UI
            this.updateEqualizerUI();
            this.highlightActivePreset();
            
            // Guardar configuración
            this.saveSettings();
            
            // Notificar al usuario
            this.showNotification(`Preset de ecualizador: ${preset}`, 'info', 1000);
        } catch (error) {
            console.error(`Error al aplicar preset de ecualizador (${preset}):`, error);
        }
    },
    
    /**
     * Resalta el preset activo en la UI
     */
    highlightActivePreset() {
        if (!this.elements.eqPresetButtons) return;
        
        // Quitar clase activa de todos los botones
        this.elements.eqPresetButtons.forEach(button => {
            button.classList.remove('active');
            
            // Agregar clase activa al preset actual
            if (button.dataset.preset === this.state.equalizer.currentPreset) {
                button.classList.add('active');
            }
        });
    },
    
    /**
     * Muestra los detalles de un álbum
     * @param {number} albumId - ID del álbum a mostrar
     */
    async showAlbumDetails(albumId) {
        try {
            // Guardar el ID del álbum actual
            this.state.currentAlbumId = albumId;
            
            // Obtener datos del álbum y sus pistas
            const album = await DB.getAlbumById(albumId);
            const tracks = await DB.getTracksByAlbumId(albumId);
            
            if (!album) {
                throw new Error('Álbum no encontrado');
            }
            
            // Actualizar la interfaz con los datos del álbum
            this.elements.detailCover.src = album.coverImage || 'images/placeholder.jpg';
            this.elements.detailTitle.textContent = album.title;
            this.elements.detailArtist.textContent = album.artist;
            this.elements.detailYear.textContent = album.year;
            
            // Actualizar lista de pistas
            this.elements.detailTracksList.innerHTML = '';
            
            if (tracks.length === 0) {
                const emptyState = document.createElement('div');
                emptyState.className = 'empty-state';
                emptyState.innerHTML = `
                    <i class="fas fa-music"></i>
                    <p>Este álbum no tiene canciones</p>
                    <p>Añade pistas usando el botón de arriba</p>
                `;
                this.elements.detailTracksList.appendChild(emptyState);
            } else {
                // Crear tabla para la lista de pistas
                const table = document.createElement('table');
                table.className = 'tracks-table';
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th class="track-select"><input type="checkbox" id="select-all-tracks" aria-label="Seleccionar todas las pistas"></th>
                            <th class="track-number">#</th>
                            <th class="track-title">Título</th>
                            <th class="track-actions">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tracks-table-body"></tbody>
                `;
                
                this.elements.detailTracksList.appendChild(table);
                const tableBody = document.getElementById('tracks-table-body');
                
                // Crear filas para cada pista
                tracks.forEach((track, index) => {
                    const row = document.createElement('tr');
                    row.className = 'track-row';
                    row.setAttribute('data-track-id', track.id);
                    row.innerHTML = `
                        <td class="track-select"><input type="checkbox" class="track-checkbox" data-track-id="${track.id}"></td>
                        <td class="track-number">${index + 1}</td>
                        <td class="track-title track-name">${track.title}</td>
                        <td class="track-actions">
                            <button class="track-play-btn control-btn" title="Reproducir"><i class="fas fa-play"></i></button>
                            <button class="track-edit-btn control-btn" title="Editar"><i class="fas fa-edit"></i></button>
                            <button class="track-delete-btn control-btn" title="Eliminar"><i class="fas fa-trash"></i></button>
                        </td>
                    `;
                    
                    tableBody.appendChild(row);
                    
                    // Configurar los eventos para esta pista
                    const playBtn = row.querySelector('.track-play-btn');
                    const editBtn = row.querySelector('.track-edit-btn');
                    const deleteBtn = row.querySelector('.track-delete-btn');
                    const trackTitle = row.querySelector('.track-name');
                    
                    // Doble clic en título de la canción para reproducir
                    trackTitle.addEventListener('dblclick', () => this.playTrack(track.id));
                    
                    // Doble clic en la fila para reproducir
                    row.addEventListener('dblclick', (e) => {
                        // Verificar que no se hizo doble clic en un botón o checkbox
                        if (!e.target.closest('button') && !e.target.closest('input[type="checkbox"]')) {
                            this.playTrack(track.id);
                        }
                    });
                    
                    // Clicks en botones
                    playBtn.addEventListener('click', () => this.playTrack(track.id));
                    editBtn.addEventListener('click', () => this.openEditTrackModal(track.id));
                    deleteBtn.addEventListener('click', () => this.confirmDeleteItem('track', track.id));
                });
                
                // Evento para seleccionar/deseleccionar todas las pistas
                const selectAllCheckbox = document.getElementById('select-all-tracks');
                selectAllCheckbox.addEventListener('change', () => {
                    const checkboxes = document.querySelectorAll('.track-checkbox');
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = selectAllCheckbox.checked;
                    });
                    this.updateSelectedTracksActions();
                });
                
                // Evento para cada checkbox
                const trackCheckboxes = document.querySelectorAll('.track-checkbox');
                trackCheckboxes.forEach(checkbox => {
                    checkbox.addEventListener('change', () => {
                        this.updateSelectedTracksActions();
                    });
                });
                
                // Añadir botones de acciones para pistas seleccionadas
                const selectedActionsDiv = document.createElement('div');
                selectedActionsDiv.id = 'selected-tracks-actions';
                selectedActionsDiv.className = 'selected-tracks-actions hidden';
                selectedActionsDiv.innerHTML = `
                    <span id="selected-count">0 pistas seleccionadas</span>
                    <button id="play-selected-btn" class="primary-btn small-btn"><i class="fas fa-play"></i> Reproducir</button>
                    <button id="deselect-all-btn" class="secondary-btn small-btn"><i class="fas fa-times"></i> Deseleccionar</button>
                `;
                
                // Insertar antes de la tabla
                this.elements.detailTracksList.insertBefore(selectedActionsDiv, table);
                
                // Configurar eventos para los botones de pistas seleccionadas
                document.getElementById('play-selected-btn').addEventListener('click', () => {
                    this.playSelectedTracks();
                });
                
                document.getElementById('deselect-all-btn').addEventListener('click', () => {
                    const checkboxes = document.querySelectorAll('.track-checkbox');
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = false;
                    });
                    document.getElementById('select-all-tracks').checked = false;
                    this.updateSelectedTracksActions();
                });
            }
            
            // Actualizar el click handler del botón de añadir canción
            document.getElementById('add-track-to-album-btn').onclick = (e) => {
                e.preventDefault();
                this.openAddTrackModal(albumId);
            };
            
            // Actualizar el click handler del botón de reproducir álbum
            document.getElementById('play-album-btn').onclick = (e) => {
                e.preventDefault();
                if (tracks.length > 0) {
                    Player.loadAlbum(albumId);
                } else {
                    this.showNotification('Este álbum no tiene canciones para reproducir', 'error');
                }
            };
            
            // Actualizar el click handler del botón de editar álbum
            document.getElementById('edit-album-btn').onclick = (e) => {
                e.preventDefault();
                this.openEditAlbumModal(albumId);
            };
            
            // Actualizar el click handler del botón de eliminar álbum
            document.getElementById('delete-album-btn').onclick = (e) => {
                e.preventDefault();
                this.confirmDeleteItem('album', albumId);
            };
            
            // Mostrar la vista de detalle y ocultar la principal
            document.getElementById('main-view').classList.remove('active-view');
            document.getElementById('storage-view').classList.remove('active-view');
            document.getElementById('album-detail-view').classList.add('active-view');
            
            // Mostrar información del usuario que subió el álbum
            if (this.elements.albumUploader) {
                this.elements.albumUploader.textContent = this.state.currentUser.username;
            }

            // Actualizar contadores para el perfil
            this.updateUserProfileStats();
            
        } catch (error) {
            console.error('Error al mostrar detalles del álbum:', error);
            this.showNotification('Error al cargar los detalles del álbum', 'error');
        }
    }
};

/**
 * Utilidad para debounce (retrasar la ejecución de funciones)
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función con debounce
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Inicializar UI cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Comprobar que UI esté definido antes de inicializarlo
    if (typeof UI !== 'undefined') {
        try {
            UI.init();
            console.log('UI inicializada correctamente');
        } catch (error) {
            console.error('Error al inicializar UI:', error);
            alert('Hubo un problema al iniciar la aplicación: ' + error.message + '. Por favor, recarga la página.');
        }
    } else {
        console.error('UI no está definida');
        alert('Hubo un problema al iniciar la aplicación: UI no está definida. Por favor, recarga la página.');
    }
});