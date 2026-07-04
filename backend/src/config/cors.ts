import type { CorsOptions } from 'cors';

const allowedOrigins = ['http://localhost:5173', 'https://game-clips-iota.vercel.app'];

export const corsOptions: CorsOptions = {
	origin: (origin, callback) => {
		// Allow requests with no origin (e.g., curl, Postman, server-to-server)
		if (!origin) {
			callback(null, true);
			return;
		}

		if (allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error(`Origin ${origin} not allowed by CORS`));
		}
	},
	methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
	credentials: true,
	optionsSuccessStatus: 204
};
