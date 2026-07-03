import { m } from '$lib/paraglide/messages.js';

type Messages = typeof m;

/**
 * Filtra las llaves cuyos mensajes no requieren parámetros.
 * Evaluamos estrictamente contra una función que se puede invocar con cero argumentos.
 */
type NoInputKeys = {
	[K in keyof Messages]: Messages[K] extends () => unknown ? K : never;
}[keyof Messages];

/**
 * Mapea las llaves limpias a su tipo de retorno real (usualmente string).
 */
type ResolvedNoInputMessages = {
	[K in NoInputKeys]: Messages[K] extends () => infer R ? R : never;
};

export const t = new Proxy(m, {
	get(target, key: string | symbol) {
		// 1. Verificación en runtime: aseguramos que la llave exista en el objeto m
		if (typeof key === 'string' && key in target) {
			const potentialFn = target[key as keyof Messages];

			// 2. Verificación de que efectivamente sea una función
			if (typeof potentialFn === 'function') {
				// Ejecutamos de forma segura abstrayendo el tipo a una función sin argumentos
				return (potentialFn as () => unknown)();
			}
		}
		return undefined;
	}
}) as unknown as ResolvedNoInputMessages;
