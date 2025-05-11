/**
 * Archivo principal de la aplicación
 * Inicializa todos los componentes y coordina su funcionamiento
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Crear la carpeta de imágenes si no existe y agregar imagen placeholder
        await createImagePlaceholder();
        
        // Inicializar la base de datos
        await DB.init();
        console.log('Base de datos inicializada');
        
        // Inicializar la interfaz de usuario
        UI.init();
        console.log('Interfaz de usuario inicializada');
        
        // Inicializar el reproductor
        Player.init();
        console.log('Reproductor inicializado');
        
        // Cargar y mostrar álbumes existentes
        await UI.renderAlbums();
        console.log('Aplicación iniciada correctamente');
        
        // Mostrar notificación de bienvenida
        setTimeout(() => {
            UI.showNotification('Bienvenido a MusicApp \ud83c\udfb5', 'info');
        }, 1000);
        
    } catch (error) {
        console.error('Error al iniciar la aplicación:', error);
        alert('Hubo un problema al iniciar la aplicación. Por favor, recarga la página.');
    }
});

/**
 * Crea la imagen placeholder para nuevos álbumes si no existe
 */
async function createImagePlaceholder() {
    try {
        const imagesDir = 'images';
        const placeholderPath = `${imagesDir}/placeholder.jpg`;
        
        // Crear un <img> temporal para verificar si el placeholder existe
        const img = new Image();
        img.onerror = () => {
            // Si la imagen no existe, crearla dinámicamente
            createPlaceholderImage(imagesDir, placeholderPath);
        };
        img.src = placeholderPath;
    } catch (error) {
        console.error('Error al crear placeholder:', error);
    }
}

/**
 * Crea una imagen placeholder genérica
 * @param {string} dir - Directorio donde guardar la imagen
 * @param {string} path - Ruta completa de la imagen
 */
function createPlaceholderImage(dir, path) {
    try {
        // Verificar si el directorio existe, crearlo si no
        const dirExists = checkDirectoryExists(dir);
        if (!dirExists) {
            // En el navegador no podemos crear directorios directamente
            // Solo mostrar mensaje indicando que se necesita crear la carpeta 'images'
            console.warn(`Por favor, crea manualmente la carpeta '${dir}' en la raíz del proyecto.`);
            UI.showNotification(`Crea la carpeta '${dir}' en la raíz para imágenes`, 'error');
            return;
        }
        
        // Crear un canvas para generar la imagen placeholder
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        
        // Dibujar fondo gris
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar icono de música
        ctx.fillStyle = '#9e9e9e';
        ctx.font = '100px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('\u266B', canvas.width / 2, canvas.height / 2);
        
        // Convertir canvas a blob y guardar
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const img = document.createElement('img');
            img.src = url;
            img.onload = () => {
                // Actualizar todos los placeholders en la página
                document.querySelectorAll('img[src="images/placeholder.jpg"]').forEach(el => {
                    el.src = url;
                });
                console.log('Imagen placeholder creada dinámicamente');
            };
        }, 'image/jpeg');
        
    } catch (error) {
        console.error('Error al crear imagen placeholder:', error);
    }
}

/**
 * Verifica si un directorio existe (limitado en navegador)
 * @param {string} dirPath - Ruta del directorio
 * @returns {boolean} true si parece existir
 */
function checkDirectoryExists(dirPath) {
    // En el navegador, no podemos verificar directamente si un directorio existe
    // Asumiremos que existe para continuar, pero en entornos reales se debería verificar
    const img = new Image();
    img.src = `${dirPath}/test.png?nocache=${Date.now()}`;
    // Si el directorio existe, obtendremos un error 404
    // Si no existe, obtendremos un error de dirección no encontrada
    // Por simplicidad, asumimos que existe
    return true;
}
