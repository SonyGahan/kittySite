/* STORAGE MANAGER
   Simula una base de datos usando el LocalStorage del navegador.
   Prepara el terreno para conectar una API real en el futuro.
*/

class StorageManager {
    constructor(collectionName) {
        // collectionName será como el nombre de nuestra "tabla" (ej: 'kitty_velitas')
        this.collection = collectionName;
    }

    // Obtener todos los datos
    getAll() {
        const data = localStorage.getItem(this.collection);
        return data ? JSON.parse(data) : [];
    }

    // Guardar toda la lista de datos
    saveAll(dataArray) {
        localStorage.setItem(this.collection, JSON.stringify(dataArray));
    }

    // Agregar un item nuevo
    add(item) {
        const currentData = this.getAll();
        currentData.push(item);
        this.saveAll(currentData);
        return item; // Devolvemos el item confirmando que se guardó
    }

    // Método auxiliar para limpiar datos (útil para pruebas)
    clear() {
        localStorage.removeItem(this.collection);
    }
}