import { generateKeyPairSync } from 'crypto';
import fs from 'fs';
import path from 'path';

export const generateKeyPair = () => {
  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

  return { publicKey, privateKey };
};

// Script to generate and save key pair
if (require.main === module) {
  const { publicKey, privateKey } = generateKeyPair();
  
  const keysDir = path.join(__dirname, '..', 'keys');
  
  // Create keys directory if it doesn't exist
  if (!fs.existsSync(keysDir)) {
    fs.mkdirSync(keysDir, { recursive: true });
  }
  
  // Save keys to files
  fs.writeFileSync(path.join(keysDir, 'private.pem'), privateKey);
  fs.writeFileSync(path.join(keysDir, 'public.pem'), publicKey);
  
  console.log('🔑 RSA key pair generated successfully!');
  console.log('📁 Keys saved to:', keysDir);
  console.log('\n📋 Add these to your .env file:');
  console.log('JWT_PRIVATE_KEY="' + privateKey.replace(/\n/g, '\\n') + '"');
  console.log('JWT_PUBLIC_KEY="' + publicKey.replace(/\n/g, '\\n') + '"');
}
