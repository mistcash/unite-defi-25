'use client'

import React, { useState, useEffect } from 'react';
import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	onAuthStateChanged,
	signOut as firebaseSignOut, // Alias signOut to avoid naming conflict
	User // Import the User type
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

function LoginComponent() {
	// Explicitly type the state variables
	const [user, setUser] = useState<User | null>(null);
	const [idToken, setIdToken] = useState<string | null>(null);
	const [error, setError] = useState<Error | null>(null); // Use Error type for errors
	const [loading, setLoading] = useState<boolean>(true); // Initial loading state

	useEffect(() => {
		// This listener observes your authentication state in real-time!
		const unsubscribe = onAuthStateChanged(auth, async (currentUser: User | null) => {
			setUser(currentUser);
			if (currentUser) {
				// If there's a user, get their ID token
				try {
					const token = await currentUser.getIdToken();
					setIdToken(token);
				} catch (e: any) { // Type the error as 'any' for now, or 'FirebaseError' if you import it
					console.error("Error getting ID token:", e);
					setError(e as Error); // Cast to Error type
				}
			} else {
				setIdToken(null);
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
				<div style={{ backgroundColor: '#ffe0e0', border: '1px solid #ff0000', color: '#ff0000', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
					<p>Login failed: {error.message} {error instanceof Error && (error as any).code ? `(Code: ${(error as any).code})` : ''}</p>
				</div>
			)}

			{user ? (
				<div style={{ textAlign: 'center' }}>
					<p style={{ fontSize: '1.1em', fontWeight: 'bold' }}>Welcome, {user.displayName || user.email}!</p>
					<p>Your User ID: <code style={{ backgroundColor: '#eee', padding: '3px 6px', borderRadius: '3px' }}>{user.uid}</code></p>
					<h3 style={{ marginTop: '20px', marginBottom: '10px' }}>Your JWT (ID Token):</h3>
					<textarea
						readOnly
						value={idToken || "Fetching token..."}
						style={{ width: '100%', height: '150px', backgroundColor: '#f9f9f9', padding: '10px', fontFamily: 'monospace', borderRadius: '5px', border: '1px solid #ddd', resize: 'vertical' }}
					/>
					<p style={{ fontSize: '0.9em', color: '#555' }}>You can send this JWT to your backend for verification!</p>
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
