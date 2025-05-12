/**
 * Módulo de Interfaz de Usuario (UI)
 * Maneja la interacción con el DOM y eventos de la interfaz
 */

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
        confirmDeleteConfirm: document.getElementById('confirm-delete-confirm')
    },

    // Variables de estado
    state: {
        currentAlbumId: null,
        currentTrackId: null,
        deleteItemType: null, // 'album' o 'track'
        confirmCallback: null
    },

    /**
     * Inicializa todos los eventos de la UI
     */
    init() {
        this.setupEventListeners();
        this.loadThemePreference();
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
            this.confirmDelete('storage', null, '¿Estás seguro de que quieres eliminar TODOS los datos? Esta acción no se puede deshacer.');
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
     * @param {string} type - Tipo de notificación ('success', 'error')
     */
    showNotification(message, type = 'info') {
        // Crear elemento de notificación si no existe
        let notification = document.querySelector('.notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        // Configurar estilo según tipo
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.display = 'block';
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
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
                // Actualizar el icono del botu00f3n de reproduccin
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
                
                // Hacer scroll a la vista si es necesario y estuu00e1 fuera del viewport
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
