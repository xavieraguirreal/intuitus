// Utilidades para parsear y procesar marcadores de expresión en guiones

export type MarkerType =
  | 'PAUSA'
  | 'SONREÍR'
  | 'SONREIR'
  | 'SERIO'
  | 'ÉNFASIS'
  | 'ENFASIS'
  | 'LENTO'
  | 'RÁPIDO'
  | 'RAPIDO'
  | 'RESPIRAR'
  | 'ALEGRE'
  | 'TRISTE'
  | 'SORPRENDIDO'
  | 'PENSATIVO';

export interface ScriptSegment {
  type: 'text' | 'marker';
  content: string;
  markerType?: MarkerType;
  pauseDuration?: number; // en segundos, solo para PAUSA
}

// Regex para detectar marcadores: [TEXTO] o [TEXTO 3s]
const MARKER_REGEX = /\[([A-ZÁÉÍÓÚÑa-záéíóúñ]+)(?:\s+(\d+)s)?\]/g;

// Lista de marcadores válidos
const VALID_MARKERS: MarkerType[] = [
  'PAUSA',
  'SONREÍR',
  'SONREIR',
  'SERIO',
  'ÉNFASIS',
  'ENFASIS',
  'LENTO',
  'RÁPIDO',
  'RAPIDO',
  'RESPIRAR',
  'ALEGRE',
  'TRISTE',
  'SORPRENDIDO',
  'PENSATIVO',
];

// Iconos/emojis para cada marcador
export const MARKER_ICONS: Record<MarkerType, string> = {
  PAUSA: '⏸️',
  'SONREÍR': '😊',
  SONREIR: '😊',
  SERIO: '😐',
  ÉNFASIS: '📢',
  ENFASIS: '📢',
  LENTO: '🐢',
  RÁPIDO: '🐇',
  RAPIDO: '🐇',
  RESPIRAR: '💨',
  ALEGRE: '😄',
  TRISTE: '😢',
  SORPRENDIDO: '😲',
  PENSATIVO: '🤔',
};

// Descripciones de cada marcador
export const MARKER_DESCRIPTIONS: Record<MarkerType, string> = {
  PAUSA: 'Pausa automática',
  'SONREÍR': 'Sonreír',
  SONREIR: 'Sonreír',
  SERIO: 'Expresión seria',
  ÉNFASIS: 'Enfatizar siguiente idea',
  ENFASIS: 'Enfatizar siguiente idea',
  LENTO: 'Reducir velocidad',
  RÁPIDO: 'Aumentar velocidad',
  RAPIDO: 'Aumentar velocidad',
  RESPIRAR: 'Recordatorio de respirar',
  ALEGRE: 'Expresión alegre',
  TRISTE: 'Expresión triste',
  SORPRENDIDO: 'Expresión sorprendida',
  PENSATIVO: 'Expresión pensativa',
};

// Parsear el script y separar texto de marcadores
export function parseScript(script: string): ScriptSegment[] {
  const segments: ScriptSegment[] = [];
  let lastIndex = 0;

  // Buscar todos los marcadores
  const matches = Array.from(script.matchAll(MARKER_REGEX));

  matches.forEach((match) => {
    const markerStart = match.index!;
    const markerEnd = markerStart + match[0].length;
    const markerText = match[1].toUpperCase();
    const pauseDuration = match[2] ? parseInt(match[2], 10) : undefined;

    // Agregar texto antes del marcador (si hay)
    if (markerStart > lastIndex) {
      const textContent = script.substring(lastIndex, markerStart);
      if (textContent.trim()) {
        segments.push({
          type: 'text',
          content: textContent,
        });
      }
    }

    // Validar si es un marcador válido
    const normalizedMarker = normalizeMarker(markerText);
    if (normalizedMarker && isValidMarker(normalizedMarker)) {
      segments.push({
        type: 'marker',
        content: match[0],
        markerType: normalizedMarker,
        pauseDuration,
      });
    } else {
      // Si no es válido, tratarlo como texto normal
      segments.push({
        type: 'text',
        content: match[0],
      });
    }

    lastIndex = markerEnd;
  });

  // Agregar texto restante después del último marcador
  if (lastIndex < script.length) {
    const remainingText = script.substring(lastIndex);
    if (remainingText.trim()) {
      segments.push({
        type: 'text',
        content: remainingText,
      });
    }
  }

  return segments;
}

// Normalizar marcador (manejar acentos)
function normalizeMarker(marker: string): MarkerType | null {
  const upperMarker = marker.toUpperCase();

  // Mapeo de variantes sin acento a con acento
  const normalizationMap: Record<string, MarkerType> = {
    SONREIR: 'SONREÍR',
    ENFASIS: 'ÉNFASIS',
    RAPIDO: 'RÁPIDO',
  };

  return (normalizationMap[upperMarker] as MarkerType) || (upperMarker as MarkerType);
}

// Verificar si es un marcador válido
function isValidMarker(marker: string): boolean {
  return VALID_MARKERS.includes(marker as MarkerType);
}

// Obtener todos los marcadores disponibles para documentación
export function getAvailableMarkers(): Array<{
  marker: MarkerType;
  icon: string;
  description: string;
  example: string;
}> {
  // Filtrar duplicados (SONREIR/SONREÍR, etc.)
  const uniqueMarkers: MarkerType[] = [
    'PAUSA',
    'SONREÍR',
    'SERIO',
    'ÉNFASIS',
    'LENTO',
    'RÁPIDO',
    'RESPIRAR',
    'ALEGRE',
    'TRISTE',
    'SORPRENDIDO',
    'PENSATIVO',
  ];

  return uniqueMarkers.map((marker) => ({
    marker,
    icon: MARKER_ICONS[marker],
    description: MARKER_DESCRIPTIONS[marker],
    example:
      marker === 'PAUSA'
        ? '[PAUSA 3s]'
        : `[${marker}]`,
  }));
}
