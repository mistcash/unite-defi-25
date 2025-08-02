import admin, { ServiceAccount } from 'firebase-admin';
import adminKey from './keys/admin.json';
import { DecodedFirebaseToken } from './types';

const app = admin.initializeApp({
	credential: admin.credential.cert(adminKey as ServiceAccount)
});

export const verifyFirebaseToken = async (token: string): Promise<DecodedFirebaseToken> => {
	try {
		const decodedToken = await app.auth().verifyIdToken(token);

		return {
			uid: decodedToken.uid,
			email: decodedToken.email,
			email_verified: decodedToken.email_verified,
			exp: decodedToken.exp,
			iat: decodedToken.iat,
		};
	} catch (error) {
		console.error('Error verifying Firebase token:', error);
		throw new Error('Invalid Firebase token');
	}
};
