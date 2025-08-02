'use client'

import React, { useState, useEffect } from 'react';
import { User, Key, DollarSign, AlertCircle } from 'lucide-react';
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
	const [idToken, setIdToken] = useState<string | null>(null);
	const [realJWT, setRealJWT] = useState<string | null>(null);
	const [jwtLoading, setJwtLoading] = useState<boolean>(false);
	const [recipientAddress, setRecipientAddress] = useState<string>('');
	const [claimingKey, setClaimingKey] = useState<string>('');
	const [amount, setAmount] = useState<string>('');
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
				(window as any).user = currentUser;
				// If there's a user, get their ID token
				try {
					const token = await currentUser.getIdToken();
					setIdToken(token);

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
				} catch (e: any) { // Type the error as 'any' for now, or 'FirebaseError' if you import it
					console.error("Error getting ID token:", e);
					setError(e as Error); // Cast to Error type
				}
			} else {
				setIdToken(null);
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
		return <div>Loading authentication state...</div>;
	}

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '600px', margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
			<h2 style={{ textAlign: 'center', color: '#333' }}>Firebase Google Authentication (TypeScript Edition!)</h2>

			{error && (
				<div style={{ border: '1px solid #ff0000', color: '#ff0000', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
					<p>Login failed: {error.message} {error instanceof Error && (error as any).code ? `(Code: ${(error as any).code})` : ''}</p>
				</div>
			)}

			{user ? (
				<div style={{ textAlign: 'center' }}>
					<p style={{ fontSize: '1.1em', fontWeight: 'bold' }}>Welcome, {user.displayName || user.email}!</p>
					<p>Your User ID: <code style={{ padding: '3px 6px', borderRadius: '3px' }}>{user.uid}</code></p>

					{/* JWT Status */}
					{jwtLoading ? (
						<div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f8ff', border: '1px solid #007acc', borderRadius: '5px' }}>
							<p style={{ color: '#007acc', fontWeight: 'bold' }}>🔄 Exchanging Firebase token for real JWT...</p>
						</div>
					) : realJWT ? (
						<div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0fff0', border: '1px solid #28a745', borderRadius: '5px' }}>
							<p style={{ color: '#28a745', fontWeight: 'bold' }}>✅ Valid JWT obtained successfully!</p>
						</div>
					) : (
						<div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#fff5f5', border: '1px solid #dc3545', borderRadius: '5px' }}>
							<p style={{ color: '#dc3545', fontWeight: 'bold' }}>❌ Failed to obtain real JWT</p>
						</div>
					)}

					{/* Transaction Details - Using TransferUI styling */}
					<div style={{ marginTop: '30px', maxWidth: '500px', margin: '30px auto 0', textAlign: 'left' }}>
						<h3 style={{ marginBottom: '20px', textAlign: 'center', color: '#333' }}>Transaction Details</h3>

						{/* Recipient Address */}
						<div style={{ marginTop: '16px' }}>
							<label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: 'rgb(240, 245, 255)' }}>
								Wallet Address
							</label>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '12px',
									padding: '12px',
									borderRadius: '8px',
									border: `1px solid ${errors.recipient ? 'rgb(239, 68, 68)' : 'rgb(80, 80, 80)'}`,
									backgroundColor: 'rgba(63, 63, 63, 0.4)'
								}}
							>
								<div style={{
									width: '32px',
									height: '32px',
									borderRadius: '50%',
									backgroundColor: 'rgb(255, 87, 34)',
									display: 'none',
									alignItems: 'center',
									justifyContent: 'center'
								}} className="hidden md:flex">
									<User style={{ width: '16px', height: '16px', color: 'white' }} />
								</div>
								<input
									type="text"
									value={recipientAddress}
									onChange={(e) => handleRecipientChange(e.target.value)}
									placeholder="0xCe8...d129"
									style={{
										flex: 1,
										backgroundColor: 'transparent',
										color: 'white',
										outline: 'none',
										border: 'none',
										fontSize: '14px'
									}}
									className="placeholder-gray-400"
								/>
							</div>
							{errors.recipient && (
								<div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', color: 'rgb(248, 113, 113)', fontSize: '14px' }}>
									<AlertCircle style={{ width: '16px', height: '16px' }} />
									{errors.recipient}
								</div>
							)}
						</div>

						{/* Claiming Key */}
						<div style={{ marginTop: '16px' }}>
							<label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: 'rgb(240, 245, 255)' }}>
								Claiming Key
								<span style={{ fontSize: '12px', color: 'rgb(156, 163, 175)', marginLeft: '8px' }}>(256-bit hex secret)</span>
							</label>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '12px',
									padding: '12px',
									borderRadius: '8px',
									border: `1px solid ${errors.claimingKey ? 'rgb(239, 68, 68)' : 'rgb(80, 80, 80)'}`,
									backgroundColor: 'rgba(63, 63, 63, 0.4)'
								}}
							>
								<div style={{
									width: '32px',
									height: '32px',
									borderRadius: '50%',
									backgroundColor: 'rgb(34, 197, 94)',
									display: 'none',
									alignItems: 'center',
									justifyContent: 'center'
								}} className="hidden md:flex">
									<Key style={{ width: '16px', height: '16px', color: 'white' }} />
								</div>
								<input
									type="text"
									value={claimingKey}
									onChange={(e) => handleClaimingKeyChange(e.target.value)}
									placeholder="Enter your claiming key..."
									style={{
										flex: 1,
										backgroundColor: 'transparent',
										color: 'white',
										outline: 'none',
										border: 'none',
										fontSize: '14px',
										fontFamily: 'monospace',
										letterSpacing: '0.05em',
										wordBreak: 'break-all'
									}}
									className="placeholder-gray-400"
								/>
							</div>
							{errors.claimingKey && (
								<div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', color: 'rgb(248, 113, 113)', fontSize: '14px' }}>
									<AlertCircle style={{ width: '16px', height: '16px' }} />
									{errors.claimingKey}
								</div>
							)}
							<div style={{ marginTop: '4px', fontSize: '12px', color: 'rgb(156, 163, 175)' }}>
								Enter the claiming key you received to claim the funds.
							</div>
						</div>

						{/* Amount Section */}
						<div style={{ marginBottom: '32px', marginTop: '16px' }}>
							<label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '12px', color: 'rgb(240, 245, 255)' }}>
								Amount
							</label>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '12px',
									padding: '12px',
									borderRadius: '8px',
									border: '1px solid rgb(80, 80, 80)',
									backgroundColor: 'rgba(63, 63, 63, 0.4)'
								}}
							>
								<div style={{
									width: '32px',
									height: '32px',
									borderRadius: '50%',
									backgroundColor: 'rgb(34, 197, 94)',
									display: 'none',
									alignItems: 'center',
									justifyContent: 'center'
								}} className="hidden md:flex">
									<DollarSign style={{ width: '16px', height: '16px', color: 'white' }} />
								</div>
								<input
									type="text"
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									placeholder="0.00"
									style={{
										flex: 1,
										backgroundColor: 'transparent',
										color: 'white',
										outline: 'none',
										border: 'none',
										fontSize: '14px'
									}}
									className="placeholder-gray-400"
								/>
							</div>
						</div>
					</div>

					<button
						onClick={handleSignOut}
						style={{
							marginTop: '20px', padding: '12px 25px', backgroundColor: '#dc3545', color: 'white',
							border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em',
							boxShadow: '0 2px 4px rgba(0,0,0,0.2)', transition: 'background-color 0.3s'
						}}
					>
						Sign Out
					</button>
				</div>
			) : (
				<div style={{ textAlign: 'center' }}>
					<p style={{ fontSize: '1.1em', color: '#555' }}>You are currently not signed in.</p>
					<button
						onClick={handleGoogleSignIn}
						style={{
							marginTop: '20px', padding: '12px 25px', backgroundColor: '#4285F4', color: 'white',
							border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em',
							boxShadow: '0 2px 4px rgba(0,0,0,0.2)', transition: 'background-color 0.3s',
							display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
						}}
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
			)}
		</div>
	);
}

export default LoginComponent;
