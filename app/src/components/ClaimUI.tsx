'use client'

import React, { useState, useEffect } from 'react';
import { User, Key, DollarSign, AlertCircle, Check, X, RefreshCcw } from 'lucide-react';
import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	onAuthStateChanged,
	signOut as firebaseSignOut, // Alias signOut to avoid naming conflict
	User as FirebaseUser // Import the User type and alias it
} from "firebase/auth";
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app"; // Import types for app initialization
// import { getAnalytics } from "firebase/analytics"; // Not directly used in this component, but you have it in your config.

// Your web app's Firebase configuration (copied from your starter code)
const firebaseConfig = {
	apiKey: "AIzaSyCUA0FymiGn98uvL685IQPL-DC-rYRE_eA",
	authDomain: "mist-unitedefi.firebaseapp.com",
	projectId: "mist-unitedefi",
	storageBucket: "mist-unitedefi.firebasestorage.app",
	messagingSenderId: "81318144148",
	appId: "1:81318144148:web:8803aa5430f4956de6ec81",
	measurementId: "G-6Z25WECRE1"
};

// Initialize Firebase once globally or within a utility file.
// In a Next.js app, `getApps().length` is a common way to prevent re-initialization
// during hot reloading or multiple component renders.
let app: FirebaseApp;
if (!getApps().length) {
	app = initializeApp(firebaseConfig);
} else {
	app = getApp(); // If already initialized, get the existing app
}

const auth = getAuth(app); // Get the Auth service instance

// Function to exchange Firebase token for real JWT
const exchangeForRealJWT = async (firebaseToken: string): Promise<string | null> => {
	try {
		const response = await fetch('https://mist-unite-defi-jwt-shramee-shramees-projects.vercel.app/generate-jwt', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				firebaseToken: firebaseToken
			})
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		if (data.success && data.jwt) {
			return data.jwt;
		} else {
			throw new Error('Failed to get JWT from response');
		}
	} catch (error) {
		console.error('Error exchanging Firebase token for real JWT:', error);
		throw error;
	}
};

function LoginComponent() {
	// Explicitly type the state variables
	const [user, setUser] = useState<FirebaseUser | null>(null);
	const [realJWT, setRealJWT] = useState<string | null>(null);
	const [jwtLoading, setJwtLoading] = useState<boolean>(false);
	const [recipientAddress, setRecipientAddress] = useState<string>('');
	const [claimingKey, setClaimingKey] = useState<string>('');
	const [errors, setErrors] = useState<{
		recipient?: string;
		claimingKey?: string;
	}>({});
	const [error, setError] = useState<Error | null>(null); // Use Error type for errors
	const [loading, setLoading] = useState<boolean>(true); // Initial loading state

	// Validate recipient address/email
	const validateRecipient = (value: string) => {
		if (!value.trim()) return 'This field is required';
		// For now, we'll accept any non-empty value
		// In a real app, you'd validate based on the destination type
		return undefined;
	};

	// Validate claiming key
	const validateClaimingKey = (value: string) => {
		if (!value.trim()) return 'Claiming key is required';
		if (!/^(0x)?[a-fA-F0-9]{1,64}$/.test(value)) return 'Invalid claiming key format';
		return undefined;
	};

	// Auto-generate claiming key when component mounts (client-side only)
	useEffect(() => {
		// Remove auto-generation for claiming interface
		// Users must enter their claiming key manually
	}, []);

	// Handle recipient input change
	const handleRecipientChange = (value: string) => {
		setRecipientAddress(value);
		const error = validateRecipient(value);
		setErrors(prev => ({ ...prev, recipient: error }));
	};

	// Handle claiming key input change
	const handleClaimingKeyChange = (value: string) => {
		setClaimingKey(value);
		const error = validateClaimingKey(value);
		setErrors(prev => ({ ...prev, claimingKey: error }));
	};

	useEffect(() => {
		// This listener observes your authentication state in real-time!
		const unsubscribe = onAuthStateChanged(auth, async (currentUser: FirebaseUser | null) => {
			setUser(currentUser);
			if (currentUser) {
				// If there's a user, get their ID token
				try {
					const token = await currentUser.getIdToken();
					// Exchange Firebase token for real JWT
					setJwtLoading(true);
					try {
						const jwt = await exchangeForRealJWT(token);
						setRealJWT(jwt);
						console.log('Successfully obtained real JWT');
					} catch (jwtError) {
						console.error('Failed to exchange for real JWT:', jwtError);
						setError(jwtError as Error);
					} finally {
						setJwtLoading(false);
					}
				} catch (e: unknown) { // Type the error as 'any' for now, or 'FirebaseError' if you import it
					console.error("Error getting ID token:", e);
					setError(e as Error); // Cast to Error type
				}
			} else {
				setRealJWT(null);
			}
			setLoading(false); // Authentication state loaded
		});

		// Cleanup the listener when the component unmounts
		return () => unsubscribe();
	}, []); // Empty dependency array means this runs once on mount

	const handleGoogleSignIn = async () => {
		setError(null); // Clear previous errors
		const provider = new GoogleAuthProvider(); // Create a new Google Auth Provider instance
		try {
			// Sign in with a pop-up window! Firebase handles all the redirects.
			await signInWithPopup(auth, provider);
			// The onAuthStateChanged listener will pick up the user and update the state
			console.log("Successfully started Google sign-in process.");
		} catch (err: any) { // Type the error as 'any' or 'FirebaseError'
			console.error("Error signing in with Google:", err);
			// Firebase provides useful error codes and messages
			setError(err as Error); // Cast to Error type
		}
	};

	const handleSignOut = async () => {
		setError(null);
		try {
			await firebaseSignOut(auth); // Use the aliased signOut from firebase/auth
			console.log("User signed out.");
			// The onAuthStateChanged listener will pick this up and clear user/token state
		} catch (err: any) { // Type the error as 'any' or 'FirebaseError'
			console.error("Error signing out:", err);
			setError(err as Error); // Cast to Error type
		}
	};

	if (loading) {
		return (
			<div className="w-full max-w-2xl mx-auto p-6 bg-gray-800 bg-opacity-60 rounded-xl backdrop-blur-sm border border-gray-700">
				<div className="flex items-center justify-center gap-3">
					<RefreshCcw className="w-5 h-5 text-blue-400 animate-spin" />
					<span className="text-white">Loading...</span>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full max-w-2xl mx-auto p-6 bg-gray-800 bg-opacity-60 rounded-xl backdrop-blur-sm border border-gray-700">
			{error && (
				<div className="mb-4 p-4 bg-red-600 bg-opacity-20 border border-red-400 border-opacity-50 rounded-lg backdrop-blur-sm">
					<div className="flex items-center gap-3">
						<AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
						<div>
							<p className="text-red-300 font-medium">Sign in failed</p>
							<p className="text-red-400 text-sm">{error.message}</p>
						</div>
					</div>
				</div>
			)}

			{user ? (
				<div className="">
					<div className="mt-8 max-w-lg mx-auto">
						<div className="mb-4">
							<h3 className="text-xl font-bold text-white mb-2">
								Welcome, {(user.displayName || '').split(' ')[0] || 'there'}!
							</h3>
						</div>

						{/* Authentication Status */}
						{jwtLoading ? (
							<div className="flex gap-3">
								<RefreshCcw className="w-5 h-5 text-blue-400 animate-spin" />
								<p className="text-blue-300 font-medium">Verifying your Gmail account...</p>
							</div>
						) : realJWT ? (
							<div className="flex gap-2">
								<Check className="w-5 h-5 text-green-400" />
								<p className="text-green-200 text-sm">You can now claim payments for <span className="tracking-wide text-green-100">{user.email}</span>.</p>
							</div>
						) : (
							<div className="flex gap-3">
								<X className="w-5 h-5 text-red-400" />
								<p className="text-red-300 font-medium">Verification failed. Please try signing in again.</p>
							</div>
						)}

						{/* Recipient Address */}
						<div className="mt-4">
							<label className="block text-sm font-medium mb-2" style={{ color: 'rgb(240, 245, 255)' }}>
								Wallet address
							</label>
							<div
								className="flex items-center space-x-3 p-3 rounded-lg border"
								style={{
									backgroundColor: 'rgba(63, 63, 63, 0.4)',
									borderColor: errors.recipient ? 'rgb(239, 68, 68)' : 'rgb(80, 80, 80)'
								}}
							>
								<div className="hidden w-8 h-8 rounded-full md:flex items-center justify-center" style={{ backgroundColor: 'rgb(255, 87, 34)' }}>
									<User className="w-4 h-4 text-white" />
								</div>
								<input
									type="text"
									value={recipientAddress}
									onChange={(e) => handleRecipientChange(e.target.value)}
									placeholder={'Address (0x...)'}
									className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none font-mono text-sm tracking-wide"
								/>
							</div>
							{errors.recipient && (
								<div className="mt-1 flex items-center gap-1 text-red-400 text-sm">
									<AlertCircle className="w-4 h-4" />
									{errors.recipient}
								</div>
							)}
						</div>

						{/* Claiming Key */}
						<div className="mt-4">
							<label className="block text-sm font-medium mb-2" style={{ color: 'rgb(240, 245, 255)' }}>
								Claiming Key
							</label>
							<div
								className="flex items-center space-x-3 p-3 rounded-lg border"
								style={{
									backgroundColor: 'rgba(63, 63, 63, 0.4)',
									borderColor: errors.claimingKey ? 'rgb(239, 68, 68)' : 'rgb(80, 80, 80)'
								}}
							>
								<div className="hidden w-8 h-8 rounded-full md:flex items-center justify-center" style={{ backgroundColor: 'rgb(34, 197, 94)' }}>
									<Key className="w-4 h-4 text-white" />
								</div>
								<input
									type="text"
									value={claimingKey}
									onChange={(e) => handleClaimingKeyChange(e.target.value)}
									placeholder="Claiming key from sender (0x...)"
									className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none font-mono text-sm tracking-wide"
								/>
							</div>
							{errors.claimingKey && (
								<div className="mt-1 flex items-center gap-1 text-red-400 text-sm">
									<AlertCircle className="w-4 h-4" />
									{errors.claimingKey}
								</div>
							)}
							<div className="mt-1 text-xs text-gray-400">
								Enter the claiming key provided by the sender.
							</div>
						</div>

						{/* Claim Button */}
						<div className="mt-8 flex justify-center">
							{realJWT && (
								<button
									disabled={!recipientAddress || !claimingKey || !!errors.recipient || !!errors.claimingKey}
									className="px-2 md:px-4 mr-4 py-3 bg-green-600 hover:bg-green-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
								>
									<DollarSign className="w-4 h-4" />
									Claim Payment
								</button>
							)}

							<button
								onClick={handleSignOut}
								className="px-2 md:px-4 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
							>
								<X className="w-4 h-4" />
								Sign Out
							</button>
						</div>
					</div>
				</div>
			) : (
				<div className="text-center">
					<div className="mb-6">
						<h3 className="text-xl font-medium text-white mb-2">Sign in to claim payments</h3>
						<p className="text-gray-400">Connect your Gmail account to claim payments sent to your email address.</p>
					</div>
					<button
						onClick={handleGoogleSignIn}
						className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-3 mx-auto"
					>
						<svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M17.64 9.2045C17.64 8.5605 17.5845 7.9545 17.4705 7.3875H9V10.875H13.8465C13.6215 12.0465 12.915 13.0125 11.961 13.6545V15.903H14.9085C16.6395 14.346 17.64 12.003 17.64 9.2045Z" fill="#4285F4" />
							<path d="M9 18C11.43 18 13.4625 17.199 14.9085 15.903L11.961 13.6545C11.1615 14.1975 10.1505 14.5365 9 14.5365C6.702 14.5365 4.7925 13.0695 4.0905 11.0265H0.963V13.3605C2.535 16.4025 5.589 18 9 18Z" fill="#34A853" />
							<path d="M4.0905 11.0265C3.9015 10.479 3.7935 9.9225 3.7935 9.324C3.7935 8.7255 3.9015 8.169 4.0905 7.6215V5.2875H0.963C0.342 6.5595 0 7.896 0 9.324C0 10.752 0.342 12.0885 0.963 13.3605L4.0905 11.0265Z" fill="#FBBC05" />
							<path d="M9 3.4635C10.395 3.4635 11.625 3.966 12.564 4.887L14.9745 2.4765C13.4625 0.9045 11.43 0 9 0C5.589 0 2.535 1.5975 0.963 4.6395L4.0905 7.6215C4.7925 5.5785 6.702 4.1115 9 4.1115C9 4.1115 9 3.4635 9 3.4635Z" fill="#EA4335" />
						</svg>
						Sign in with Google
					</button>
				</div>
			)
			}
		</div >
	);
}

export default LoginComponent;
