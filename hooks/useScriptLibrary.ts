'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  SavedScript,
  getAllScripts,
  getScript,
  saveScript,
  updateScript,
  deleteScript,
  duplicateScript,
} from '@/lib/db';

export function useScriptLibrary() {
  const [scripts, setScripts] = useState<SavedScript[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar todos los guiones al montar
  const loadScripts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allScripts = await getAllScripts();
      setScripts(allScripts);
    } catch (err) {
      console.error('Error loading scripts:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar guiones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadScripts();
  }, [loadScripts]);

  // Guardar nuevo guion
  const save = useCallback(
    async (nombre: string, contenido: string): Promise<SavedScript> => {
      try {
        setError(null);
        const newScript = await saveScript(nombre, contenido);
        await loadScripts(); // Recargar lista
        return newScript;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error al guardar';
        setError(errorMsg);
        throw err;
      }
    },
    [loadScripts]
  );

  // Actualizar guion existente
  const update = useCallback(
    async (id: string, nombre: string, contenido: string): Promise<SavedScript> => {
      try {
        setError(null);
        const updated = await updateScript(id, nombre, contenido);
        await loadScripts(); // Recargar lista
        return updated;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error al actualizar';
        setError(errorMsg);
        throw err;
      }
    },
    [loadScripts]
  );

  // Eliminar guion
  const remove = useCallback(
    async (id: string): Promise<void> => {
      try {
        setError(null);
        await deleteScript(id);
        await loadScripts(); // Recargar lista
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error al eliminar';
        setError(errorMsg);
        throw err;
      }
    },
    [loadScripts]
  );

  // Duplicar guion
  const duplicate = useCallback(
    async (id: string): Promise<SavedScript> => {
      try {
        setError(null);
        const duplicated = await duplicateScript(id);
        await loadScripts(); // Recargar lista
        return duplicated;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error al duplicar';
        setError(errorMsg);
        throw err;
      }
    },
    [loadScripts]
  );

  // Obtener un guion específico
  const get = useCallback(async (id: string): Promise<SavedScript | undefined> => {
    try {
      setError(null);
      return await getScript(id);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al obtener guion';
      setError(errorMsg);
      throw err;
    }
  }, []);

  return {
    scripts,
    loading,
    error,
    save,
    update,
    remove,
    duplicate,
    get,
    refresh: loadScripts,
  };
}
