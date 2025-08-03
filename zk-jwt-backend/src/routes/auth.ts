import { Request, Response } from 'express';
import { GenerateJWTRequest, GenerateJWTResponse } from '../types';
import { verifyFirebaseToken } from '../firebase';
import { generateCustomJWT } from '../jwt';
import { generateJWTVerifierInputs } from '@zk-email/jwt-tx-builder-helpers/dist/input-generators';

export const generateJWT = async (req: Request, res: Response): Promise<void> => {
	try {
		const jwt = await token_verification(req, res);
		if (!jwt) {
			return;
		}
		res.status(200).json({
			success: true,
			jwt,
		} as GenerateJWTResponse);

	} catch (error) {
		console.error('Error generating JWT:', error);
		res.status(500).json({
			success: false,
			error: error instanceof Error ? error.message : 'Internal server error',
		} as GenerateJWTResponse);
	}
};

export const generateJWTCircuitInputs = async (req: Request, res: Response): Promise<void> => {
	try {
		const jwt = await token_verification(req, res);
		if (!jwt) {
			return;
		}

		const n = (process.env.JWT_PUBLIC_KEY || '').replace('-----BEGIN PUBLIC KEY-----', '').replace('-----END PUBLIC KEY-----', '').replace(/\\n/g, '');

		console.log(n);

		const circuitInputs = await generateJWTVerifierInputs(jwt, { n, e: 65537 });

		res.status(200).json({
			success: true,
			jwt: jwt,
			circuitInputs,
		});

	} catch (error) {
		console.error('Error generating JWT:', error);
		res.status(500).json({
			success: false,
			error: error instanceof Error ? error.message : 'Internal server error',
		} as GenerateJWTResponse);
	}
}

const token_verification = async (req: Request, res: Response): Promise<null | string> => {
	const { firebaseToken }: GenerateJWTRequest = req.body;

	if (!firebaseToken) {
		res.status(400).json({
			success: false,
			error: 'Firebase token is required',
		} as GenerateJWTResponse);
		return null;
	}

	// Verify Firebase token
	const decodedToken = await verifyFirebaseToken(firebaseToken);

	if (!decodedToken.email) {
		res.status(400).json({
			success: false,
			error: 'Email not found in Firebase token',
		} as GenerateJWTResponse);
		return null;
	}

	if (!decodedToken.email_verified) {
		res.status(400).json({
			success: false,
			error: 'Email not verified',
		} as GenerateJWTResponse);
		return null;
	}

	// Generate custom JWT
	return generateCustomJWT(decodedToken.email);
}