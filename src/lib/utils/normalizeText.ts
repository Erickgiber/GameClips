export const normalizeText = (text: string | null | undefined) =>
	(text ?? '')
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');
