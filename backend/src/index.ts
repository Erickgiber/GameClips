import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { corsOptions } from './config/cors.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/error-handler.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// ── Middleware ──────────────────────────────────────────────
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ─────────────────────────────────────────────────
app.use('/api', apiRouter);

// ── Error Handling ─────────────────────────────────────────
app.use(errorHandler);

// ── Start Server ───────────────────────────────────────────
app.listen(PORT, () => {
	console.log(`\n🚀 GameClips Backend running at http://localhost:${PORT}`);
	console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
