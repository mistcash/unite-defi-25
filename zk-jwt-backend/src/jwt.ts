import jwt from 'jsonwebtoken';
import { CustomJWTPayload } from './types';

export const generateCustomJWT = (email: string): string => {
	const privateKey = process.env.JWT_PRIVATE_KEY?.replace(/\\n/g, '\n');

	if (!privateKey) {
		throw new Error('JWT_PRIVATE_KEY not configured');
	}

	return jwt.sign(email, privateKey, { algorithm: 'RS256' });
};
