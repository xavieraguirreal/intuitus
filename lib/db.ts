// IndexedDB utilities para la biblioteca de guiones

const DB_NAME = 'IntuitusBD';
const DB_VERSION = 1;
const STORE_NAME = 'guiones';

export interface SavedScript {
  id: string;
  nombre: string;
  contenido: string;
  fechaCreacion: number; // timestamp
  fechaModificacion: number; // timestamp
  palabras: number;
  duracionEstimada: number; // en segundos
}

// Calcular palabras y duración estimada
export function calcularMetadata(contenido: string): {
  palabras: number;
  duracionEstimada: number;
} {
  const palabras = contenido.trim().split(/\s+/).filter(Boolean).length;
  // Estimación: 150 palabras por minuto
  const duracionEstimada = palabras > 0 ? Math.ceil((palabras / 150) * 60) : 0;
  return { palabras, duracionEstimada };
}

// Inicializar IndexedDB
export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Crear object store si no existe
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });

        // Crear índices para búsquedas
        store.createIndex('nombre', 'nombre', { unique: false });
        store.createIndex('fechaModificacion', 'fechaModificacion', { unique: false });
      }
    };
  });
}

// Obtener todos los guiones
export async function getAllScripts(): Promise<SavedScript[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      // Ordenar por fecha de modificación (más reciente primero)
      const scripts = request.result as SavedScript[];
      scripts.sort((a, b) => b.fechaModificacion - a.fechaModificacion);
      resolve(scripts);
    };
    request.onerror = () => reject(request.error);
  });
}

// Obtener un guion por ID
export async function getScript(id: string): Promise<SavedScript | undefined> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Guardar un nuevo guion
export async function saveScript(
  nombre: string,
  contenido: string
): Promise<SavedScript> {
  const db = await initDB();
  const { palabras, duracionEstimada } = calcularMetadata(contenido);
  const now = Date.now();

  const script: SavedScript = {
    id: crypto.randomUUID(),
    nombre,
    contenido,
    fechaCreacion: now,
    fechaModificacion: now,
    palabras,
    duracionEstimada,
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(script);

    request.onsuccess = () => resolve(script);
    request.onerror = () => reject(request.error);
  });
}

// Actualizar un guion existente
export async function updateScript(
  id: string,
  nombre: string,
  contenido: string
): Promise<SavedScript> {
  const db = await initDB();
  const existing = await getScript(id);

  if (!existing) {
    throw new Error('Guion no encontrado');
  }

  const { palabras, duracionEstimada } = calcularMetadata(contenido);

  const updated: SavedScript = {
    ...existing,
    nombre,
    contenido,
    fechaModificacion: Date.now(),
    palabras,
    duracionEstimada,
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(updated);

    request.onsuccess = () => resolve(updated);
    request.onerror = () => reject(request.error);
  });
}

// Eliminar un guion
export async function deleteScript(id: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Duplicar un guion
export async function duplicateScript(id: string): Promise<SavedScript> {
  const original = await getScript(id);

  if (!original) {
    throw new Error('Guion no encontrado');
  }

  return saveScript(
    `${original.nombre} (copia)`,
    original.contenido
  );
}
