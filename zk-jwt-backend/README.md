# ZK JWT Backend

A TypeScript API server that generates JWTs by verifying Firebase authentication tokens.

## Features

- 🔥 Firebase JWT verification using Firebase Admin SDK
- 🔐 Custom JWT generation with RSA key pair signing
- 🚀 Express.js server with TypeScript
- 🛡️ Security headers with Helmet
- 🌐 CORS enabled
- ✅ Health check endpoint

## API Endpoints

### POST `/api/generate-jwt`

Generates a custom JWT token after verifying a Firebase JWT.

**Request Body:**
```json
{
  "firebaseToken": "your-firebase-jwt-token"
}
```

**Response:**
```json
{
  "success": true,
  "jwt": "your-generated-jwt-token"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

### GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-08-02T10:00:00.000Z"
}
```

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Generate RSA Key Pair

```bash
pnpm run generate-keys
```

This will generate RSA keys and display the environment variables you need to set.

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required environment variables:

- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `FIREBASE_CLIENT_EMAIL`: Firebase service account client email
- `FIREBASE_PRIVATE_KEY`: Firebase service account private key
- `JWT_PRIVATE_KEY`: RSA private key for JWT signing (generated in step 2)
- `JWT_PUBLIC_KEY`: RSA public key for JWT verification (generated in step 2)
- `PORT`: Server port (default: 3000)

### 4. Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Go to Project Settings > Service accounts
4. Generate a new private key
5. Use the values from the downloaded JSON file to set the Firebase environment variables

### 5. Run the Server

**Development mode with hot reload:**
```bash
pnpm run dev
```

**Production mode:**
```bash
pnpm run build
pnpm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## Usage Example

```bash
# Test the API
curl -X POST http://localhost:3000/api/generate-jwt \
  -H "Content-Type: application/json" \
  -d '{"firebaseToken": "your-firebase-jwt-token"}'
```

## Project Structure

```
src/
├── index.ts          # Main server file
├── types.ts          # TypeScript type definitions
├── firebase.ts       # Firebase Admin SDK configuration
├── jwt.ts           # JWT utilities
├── routes/
│   └── auth.ts      # Authentication routes
└── utils/
    └── generateKeys.ts # RSA key generation utility
```

## Security Considerations

- RSA keys are used for JWT signing (RS256 algorithm)
- Firebase tokens are verified server-side
- Email verification is required
- CORS and security headers are configured
- Environment variables are used for sensitive data

## Error Handling

The API handles various error cases:

- Missing Firebase token
- Invalid Firebase token
- Unverified email addresses
- Missing email in Firebase token
- JWT signing errors
- Server configuration errors
