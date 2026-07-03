import type { Request, Response, NextFunction } from 'express';

export function errorHandler(
	err: Error,
	_req: Request,
	res: Response,
	_next: NextFunction
): void {
	console.error(`[ERROR] ${err.message}`);

	// CORS errors
	if (err.message.includes('not allowed by CORS')) {
		res.status(403).json({
			error: 'Forbidden',
			message: err.message
		});
		return;
	}

	res.status(500).json({
		error: 'Internal Server Error',
		message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
	});
}
