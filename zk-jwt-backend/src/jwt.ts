import jwt from 'jsonwebtoken';
import { CustomJWTPayload } from './types';

export const generateCustomJWT = (email: string, uid: string): string => {
  const privateKey = process.env.JWT_PRIVATE_KEY?.replace(/\\n/g, '\n');
  
  if (!privateKey) {
    throw new Error('JWT_PRIVATE_KEY not configured');
  }

  const payload: CustomJWTPayload = {
    email,
    uid,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
  };

  return jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    issuer: 'zk-jwt-backend',
    audience: 'zk-jwt-client',
  });
};

export const verifyCustomJWT = (token: string): CustomJWTPayload => {
  const publicKey = process.env.JWT_PUBLIC_KEY?.replace(/\\n/g, '\n');
  
  if (!publicKey) {
    throw new Error('JWT_PUBLIC_KEY not configured');
  }

  return jwt.verify(token, publicKey, {
    algorithms: ['RS256'],
    issuer: 'zk-jwt-backend',
    audience: 'zk-jwt-client',
  }) as CustomJWTPayload;
};
