export interface GenerateJWTRequest {
  firebaseToken: string;
}

export interface GenerateJWTResponse {
  success: boolean;
  jwt?: string;
  error?: string;
}

export interface DecodedFirebaseToken {
  uid: string;
  email?: string;
  email_verified?: boolean;
  exp: number;
  iat: number;
}

export interface CustomJWTPayload {
  email: string;
  uid: string;
  iat: number;
  exp: number;
}
