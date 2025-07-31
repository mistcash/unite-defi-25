'use client'

import React, { useState, useEffect } from 'react';
import { ChevronDown, Wallet, Send, Check, AlertCircle } from 'lucide-react';

interface HeroUIError { recipient?: string }

export default function HeroUI() {
	const [selectedToken, setSelectedToken] = useState('Anything');
	const [selectedDestination, setSelectedDestination] = useState('');
	const [recipientAddress, setRecipientAddress] = useState('');
	const [isWalletConnected, setIsWalletConnected] = useState(false);
	const [walletAddress, setWalletAddress] = useState('');
	const [txState, setTxState] = useState('idle'); // idle, approving, approved, sending, sent
	const [errors, setErrors] = useState<HeroUIError>({});

	// Mock wallet connection
	const connectWallet = async () => {
		try {
			// Simulating wallet connection
			await new Promise(resolve => setTimeout(resolve, 1000));
			setIsWalletConnected(true);
			setWalletAddress('0x742d35Cc6675C05F4149b1b9F2b9e2E10e5b6F89');
		} catch (error) {
			console.error('Failed to connect wallet:', error);
		}
	};

	// Validate recipient address/email
	const validateRecipient = (value: string, destination: string) => {
		if (!value.trim()) return 'This field is required';

		if (destination === 'Gmail') {
			const emailRegex = /^[^\s@]+@gmail\.com$/;
			return emailRegex.test(value) ? undefined : 'Please enter a valid Gmail address';
		} else {
			const addressRegex = /^0x[a-fA-F0-9]{40}$/;
			return addressRegex.test(value) ? undefined : 'Please enter a valid wallet address';
		}
	};

	// Handle recipient input change
	const handleRecipientChange = (value: string) => {
		setRecipientAddress(value);
		const error = validateRecipient(value, selectedDestination);
		setErrors(prev => ({ ...prev, recipient: error }));
	};

	// Handle destination change
	const handleDestinationChange = (destination: string) => {
		setSelectedDestination(destination);
		setRecipientAddress('');
		setErrors(prev => ({ ...prev, recipient: undefined }));
	};

	// Handle approve and send
	const handleApproveAndSend = async () => {
		const recipientError = validateRecipient(recipientAddress, selectedDestination);
		if (recipientError) {
			setErrors(prev => ({ ...prev, recipient: recipientError }));
			return;
		}

		try {
			setTxState('approving');
			await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate approval

			setTxState('approved');
			await new Promise(resolve => setTimeout(resolve, 500));

			setTxState('sending');
			await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate transaction

			setTxState('sent');
			setTimeout(() => setTxState('idle'), 3000);
		} catch (error) {
			setTxState('idle');
			console.error('Transaction failed:', error);
		}
	};

	const getFieldLabel = () => {
		return !selectedDestination ? 'Anyone' : selectedDestination === 'Gmail' ? 'Email Address' : 'Wallet address';
	};

	const isFormValid = !errors.recipient && recipientAddress.trim();

	return (
		<div className="text-white flex items-center justify-center p-4 sm:p-6">
			<div className="w-full max-w-2xl px-2 sm:px-0">
				{/* Main Transfer Interface */}
				<div className="">
					{/* Sentence-like Interface */}
					<div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
						{/* Send [Money] on [Anywhere] to [Anyone] */}
						<div className="text-2xl sm:text-3xl leading-relaxed break-words">
							<div className="send-block">
								<span className="text-white">Send</span>

								<div className="relative inline-block mx-5">
									<select
										value={selectedToken}
										onChange={(e) => setSelectedToken(e.target.value)}
										className="field-sizing-content appearance-none bg-transparent border-none text-white cursor-pointer focus:outline-none pr-[1.25em]"
										style={{
											color: 'var(--gold)',
											textDecoration: 'underline',
											textUnderlineOffset: '5px'
										}}
										required
									>
										<option value="">Anything</option>
										<option value="USDC">USDC</option>
										<option value="USDT">USDT</option>
									</select>
									<ChevronDown
										className="absolute right-[0.1em] top-1/2 transform -translate-y-1/2 w[1em] pointer-events-none"
										style={{ color: 'var(--gold)' }}
									/>
								</div>
								<div className="relative inline-block">
									<select
										value={selectedDestination}
										onChange={(e) => handleDestinationChange(e.target.value)}
										className="field-sizing-content appearance-none bg-transparent border-none text-white cursor-pointer focus:outline-none pr-[1.25em]"
										style={{
											color: 'var(--gold-bright)',
											textDecoration: 'underline',
											textUnderlineOffset: '5px'
										}}
										required
									>
										<option value="">Anywhere</option>
										<option value="Base">on Base</option>
										<option value="Starknet">on Starknet</option>
										<option value="Gmail">on Gmail</option>
									</select>
									<ChevronDown
										className="absolute right-[0.1em] top-1/2 transform -translate-y-1/2 w[1em] pointer-events-none"
										style={{ color: 'var(--gold)' }}
									/>
								</div>
							</div>

							<span className="text-white">To</span>

							<div className="relative inline-block min-w-0 flex-1 ml-4">
								<input
									type="text"
									value={recipientAddress}
									onChange={(e) => handleRecipientChange(e.target.value)}
									placeholder={getFieldLabel()}
									className="field-sizing-content bg-transparent border-none text-white focus:outline-none w-full min-w-0"
									style={{
										color: 'var(--gold-bright)',
										textDecoration: 'underline',
										textUnderlineOffset: '5px'
									}}
								/>
							</div>
						</div>

						{/* Error display */}
						{errors.recipient && (
							<div className="flex items-center gap-2 text-red-400 text-sm ml-2">
								<AlertCircle className="w-4 h-4" />
								{errors.recipient}
							</div>
						)}
					</div>

					{/* Action Button */}
					<div className="flex justify-center">
						{!isWalletConnected ? (
							<button
								onClick={connectWallet}
								className="flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all transform hover:scale-105 focus:outline-none w-full sm:w-auto justify-center"
								style={{
									backgroundColor: 'var(--navy-bright)',
									color: 'white'
								}}
							>
								<Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
								Connect Wallet
							</button>
						) : (
							<button
								onClick={handleApproveAndSend}
								disabled={!isFormValid || txState !== 'idle'}
								className="flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all transform hover:scale-105 focus:outline-none disabled:opacity-90 disabled:cursor-not-allowed disabled:transform-none w-full sm:w-auto justify-center"
								style={{
									backgroundColor: isFormValid ? 'var(--gold)' : 'var(--navy-deep)',
									color: isFormValid ? 'black' : 'gray'
								}}
							>
								{txState === 'idle' && <Send className="w-5 h-5 sm:w-6 sm:h-6" />}
								{txState === 'approving' && (
									<div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
								)}
								{(txState === 'approved' || txState === 'sending') && (
									<div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
								)}
								{txState === 'sent' && <Check className="w-5 h-5 sm:w-6 sm:h-6" />}

								{txState === 'idle' && 'Approve & Send'}
								{txState === 'approving' && 'Approving...'}
								{txState === 'approved' && 'Approved'}
								{txState === 'sending' && 'Sending...'}
								{txState === 'sent' && 'Sent!'}
							</button>
						)}
					</div>

					{/* Transaction Steps */}
					{isWalletConnected && txState !== 'idle' && (
						<div className="mt-6 space-y-3">
							<div className="flex items-center gap-3 text-sm">
								<div
									className={`w-3 h-3 rounded-full ${txState === 'approving' ? 'animate-pulse' : ''}`}
									style={{
										backgroundColor: ['approving', 'approved', 'sending', 'sent'].includes(txState)
											? 'var(--gold)'
											: 'var(--navy-bright)'
									}}
								></div>
								<span className="text-white">
									{txState === 'approving' ? 'Requesting approval...' : 'Approval granted'}
								</span>
							</div>

							{['approved', 'sending', 'sent'].includes(txState) && (
								<div className="flex items-center gap-3 text-sm">
									<div
										className={`w-3 h-3 rounded-full ${txState === 'sending' ? 'animate-pulse' : ''}`}
										style={{
											backgroundColor: ['sending', 'sent'].includes(txState)
												? 'var(--gold)'
												: 'var(--navy-bright)'
										}}
									></div>
									<span className="text-white">
										{txState === 'sending' ? 'Processing transfer...' : 'Transfer complete'}
									</span>
								</div>
							)}
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="text-center mt-8 text-gray-500 text-sm">
					<p>MIST - Money in STealth • Private interoperable payments</p>
				</div>
			</div>
		</div>
	);
};
