import express, { Request, Response, NextFunction, Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { generateJWT } from './routes/auth';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
	res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.post('/generate-jwt', generateJWT);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error('Unhandled error:', err);
	res.status(500).json({
		success: false,
		error: 'Internal server error',
	});
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
	res.status(404).json({
		success: false,
		error: 'Endpoint not found',
	});
});

// Start server
app.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
	console.log(`📱 Health check: http://localhost:${PORT}/health`);
	console.log(`🔑 Generate JWT: POST http://localhost:${PORT}/api/generate-jwt`);
});

export default app;
