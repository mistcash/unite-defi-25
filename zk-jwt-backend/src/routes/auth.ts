import { Request, Response } from 'express';
import { GenerateJWTRequest, GenerateJWTResponse } from '../types';
import { verifyFirebaseToken } from '../firebase';
import { generateCustomJWT } from '../jwt';

export const generateJWT = async (req: Request, res: Response): Promise<void> => {
	try {
		const { firebaseToken }: GenerateJWTRequest = req.body;

		if (!firebaseToken) {
			res.status(400).json({
				success: false,
				error: 'Firebase token is required',
			} as GenerateJWTResponse);
			return;
		}

		// Verify Firebase token
		const decodedToken = await verifyFirebaseToken(firebaseToken);

		if (!decodedToken.email) {
			res.status(400).json({
				success: false,
				error: 'Email not found in Firebase token',
			} as GenerateJWTResponse);
			return;
		}

		if (!decodedToken.email_verified) {
			res.status(400).json({
				success: false,
				error: 'Email not verified',
			} as GenerateJWTResponse);
			return;
		}

		// Generate custom JWT
		const customJWT = generateCustomJWT(decodedToken.email);

		res.status(200).json({
			success: true,
			jwt: customJWT,
		} as GenerateJWTResponse);

	} catch (error) {
		console.error('Error generating JWT:', error);
		res.status(500).json({
			success: false,
			error: error instanceof Error ? error.message : 'Internal server error',
		} as GenerateJWTResponse);
	}
};
