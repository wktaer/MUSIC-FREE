/**
 * Módulo de Base de Datos
 * Gestiona el almacenamiento local de álbumes y canciones utilizando IndexedDB
 */

const DB = {
    name: 'musicAppDB',
    version: 1,
    db: null,

    /**
     * Inicializa la base de datos
     * @returns {Promise} Promesa que se resuelve cuando la base de datos está lista
     */
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.name, this.version);

            // Se ejecuta si la base de datos necesita ser creada o actualizada
            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Crear almacén de álbumes si no existe
                if (!db.objectStoreNames.contains('albums')) {
                    const albumStore = db.createObjectStore('albums', { keyPath: 'id', autoIncrement: true });
                    albumStore.createIndex('title', 'title', { unique: false });
                    albumStore.createIndex('artist', 'artist', { unique: false });
                }

                // Crear almacén de canciones si no existe
                if (!db.objectStoreNames.contains('tracks')) {
                    const trackStore = db.createObjectStore('tracks', { keyPath: 'id', autoIncrement: true });
                    trackStore.createIndex('albumId', 'albumId', { unique: false });
                    trackStore.createIndex('title', 'title', { unique: false });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('Base de datos inicializada correctamente');
                resolve();
            };

            request.onerror = (event) => {
                console.error('Error al abrir la base de datos:', event.target.error);
                reject(event.target.error);
            };
        });
    },

    /**
     * Guarda un álbum en la base de datos
     * @param {Object} album - Objeto con datos del álbum
     * @returns {Promise} Promesa que se resuelve con el ID del álbum guardado
     */
    async addAlbum(album) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['albums'], 'readwrite');
            const store = transaction.objectStore('albums');
            const request = store.add(album);

            request.onsuccess = (event) => {
                resolve(event.target.result); // Devuelve el ID generado
            };

            request.onerror = (event) => {
                console.error('Error al guardar álbum:', event.target.error);
                reject(event.target.error);
            };
        });
    },

    /**
     * Actualiza un álbum existente en la base de datos
     * @param {Object} album - Objeto con datos del álbum (debe incluir id)
     * @returns {Promise} Promesa que se resuelve cuando se completa la actualización
     */
    async updateAlbum(album) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['albums'], 'readwrite');
            const store = transaction.objectStore('albums');
            const request = store.put(album); // put actualiza si existe, agrega si no

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = (event) => {
                console.error('Error al actualizar álbum:', event.target.error);
                reject(event.target.error);
            };
        });
    },

    /**
     * Actualiza una pista existente en la base de datos
     * @param {Object} track - Objeto con datos de la pista (debe incluir id)
     * @returns {Promise} Promesa que se resuelve cuando se completa la actualización
     */
    async updateTrack(track) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['tracks'], 'readwrite');
            const store = transaction.objectStore('tracks');
            const request = store.put(track);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = (event) => {
                console.error('Error al actualizar pista:', event.target.error);
                reject(event.target.error);
            };
        });
    },

    /**
     * Guarda una canción en la base de datos
     * @param {Object} track - Objeto con datos de la canción
     * @returns {Promise} Promesa que se resuelve con el ID de la canción guardada
     */
    async addTrack(track) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['tracks'], 'readwrite');
            const store = transaction.objectStore('tracks');
            const request = store.add(track);

            request.onsuccess = (event) => {
                resolve(event.target.result); // Devuelve el ID generado
            };

            request.onerror = (event) => {
                console.error('Error al guardar canción:', event.target.error);
                reject(event.target.error);
            };
        });
    },

    /**
     * Obtiene todos los álbumes de la base de datos
     * @returns {Promise} Promesa que se resuelve con un array de álbumes
     */
    async getAllAlbums() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['albums'], 'readonly');
            const store = transaction.objectStore('albums');
            const request = store.getAll();

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                console.error('Error al obtener álbumes:', event.target.error);
                reject(event.target.error);
            };
        });
    },

    /**
     * Obtiene un álbum específico por su ID
     * @param {number} id - ID del álbum a obtener
     * @returns {Promise} Promesa que se resuelve con el álbum encontrado
     */
    async getAlbumById(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['albums'], 'readonly');
            const store = transaction.objectStore('albums');
            const request = store.get(id);

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                console.error('Error al obtener álbum:', event.target.error);
                reject(event.target.error);
            };
        });
    },

    /**
     * Obtiene todas las canciones de un álbum específico
     * @param {number} albumId - ID del álbum
     * @returns {Promise} Promesa que se resuelve con un array de canciones
     */
    async getTracksByAlbumId(albumId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['tracks'], 'readonly');
            const store = transaction.objectStore('tracks');
            const index = store.index('albumId');
            const request = index.getAll(albumId);

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                console.error('Error al obtener canciones:', event.target.error);
                reject(event.target.error);
            };
        });
    },

    /**
     * Busca álbumes por título o artista
     * @param {string} query - Texto a buscar
     * @returns {Promise} Promesa que se resuelve con un array de álbumes que coinciden
     */
    async searchAlbums(query) {
        const albums = await this.getAllAlbums();
        if (!query) return albums;
        
        query = query.toLowerCase();
        return albums.filter(album => 
            album.title.toLowerCase().includes(query) || 
            album.artist.toLowerCase().includes(query)
        );
    },

    /**
     * Elimina un álbum y todas sus canciones
     * @param {number} id - ID del álbum a eliminar
     * @returns {Promise} Promesa que se resuelve cuando se completa la eliminación
     */
    async deleteAlbum(id) {
        // Primero eliminamos todas las canciones asociadas al álbum
        const tracks = await this.getTracksByAlbumId(id);
        const trackIds = tracks.map(track => track.id);
        
        const promises = [];
        
        // Eliminar cada canción
        trackIds.forEach(trackId => {
            promises.push(new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['tracks'], 'readwrite');
                const store = transaction.objectStore('tracks');
                const request = store.delete(trackId);
                
                request.onsuccess = () => resolve();
                request.onerror = (event) => reject(event.target.error);
            }));
        });
        
        // Eliminar el álbum
        promises.push(new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['albums'], 'readwrite');
            const store = transaction.objectStore('albums');
            const request = store.delete(id);
            
            request.onsuccess = () => resolve();
            request.onerror = (event) => reject(event.target.error);
        }));
        
        return Promise.all(promises);
    },
    
    /**
     * Elimina una pista específica
     * @param {number} trackId - ID de la pista a eliminar
     * @returns {Promise} Promesa que se resuelve cuando se completa la eliminación
     */
    async deleteTrack(trackId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['tracks'], 'readwrite');
            const store = transaction.objectStore('tracks');
            const request = store.delete(trackId);
            
            request.onsuccess = () => resolve();
            request.onerror = (event) => reject(event.target.error);
        });
    },
    
    /**
     * Elimina completamente todos los datos de la aplicación
     * @returns {Promise} Promesa que se resuelve cuando se completa la eliminación
     */
    async clearAllData() {
        return new Promise((resolve, reject) => {
            try {
                // Cerrar la conexión actual a la BD
                this.db.close();
                
                // Eliminar toda la base de datos
                const request = indexedDB.deleteDatabase(this.name);
                
                request.onsuccess = () => {
                    console.log('Base de datos eliminada correctamente');
                    // Reinicializar la BD
                    this.init()
                        .then(() => {
                            // También limpiar localStorage para cualquier configuración
                            localStorage.clear();
                            console.log('LocalStorage limpiado');
                            resolve();
                        })
                        .catch(err => {
                            console.error('Error al reinicializar la BD:', err);
                            reject(err);
                        });
                };
                
                request.onerror = (event) => {
                    console.error('Error al eliminar la base de datos:', event.target.error);
                    reject(event.target.error);
                };
            } catch (error) {
                console.error('Error en clearAllData:', error);
                reject(error);
            }
        });
    },
    
    /**
     * Obtiene una pista específica por su ID
     * @param {number} id - ID de la pista a obtener
     * @returns {Promise} Promesa que se resuelve con la pista encontrada
     */
    async getTrackById(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['tracks'], 'readonly');
            const store = transaction.objectStore('tracks');
            const request = store.get(id);

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                console.error('Error al obtener pista:', event.target.error);
                reject(event.target.error);
            };
        });
    },

    /**
     * Obtiene todas las pistas de la base de datos
     * @returns {Promise} Promesa que se resuelve con un array de todas las pistas
     */
    async getAllTracks() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['tracks'], 'readonly');
            const store = transaction.objectStore('tracks');
            const request = store.getAll();

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                console.error('Error al obtener todas las pistas:', event.target.error);
                reject(event.target.error);
            };
        });
    }
};
