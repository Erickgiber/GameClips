/**
 * Normaliza un texto eliminando espacios en blanco al inicio y al final,
 * y removiendo los acentos o tildes, preservando el uso de mayúsculas y minúsculas.
 *
 * @param {string | null | undefined} text - El texto que se desea normalizar.
 * @returns {string} El texto normalizado sin espacios externos ni acentos.
 *
 * @example
 * normalizeText("  Árbol de Navidad  "); // Devuelve: "Arbol de Navidad"
 * normalizeText("CANCIÓN");            // Devuelve: "CANCION"
 * normalizeText(null);                 // Devuelve: ""
 */
export const normalizeText = (text: string | null | undefined): string =>
	(text ?? '')
		.trim()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');
