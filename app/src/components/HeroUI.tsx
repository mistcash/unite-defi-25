'use client'

import React, { useState, useEffect } from 'react';
import { ChevronDown, Wallet, Send, Check, AlertCircle, AlertTriangle, Key, User, Mail, Globe, DollarSign, Coins, Zap } from 'lucide-react';
import { useAccount, useConnect, useDisconnect, useSendTransaction, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { parseEther } from 'viem';
import { base } from 'wagmi/chains';

interface HeroUIError {
	recipient?: string;
	claimingKey?: string;
}

declare global {
	interface Window {
		ethereum?: any;
	}
}

export default function HeroUI() {
	const [selectedToken, setSelectedToken] = useState('usdc');
	const [selectedFromNetwork, setSelectedFromNetwork] = useState('base');
	const [selectedToNetwork, setSelectedToNetwork] = useState('gmail');
	const [recipientAddress, setRecipientAddress] = useState('');
	const [claimingKey, setClaimingKey] = useState('');
	const [errors, setErrors] = useState<HeroUIError>({});

	// Wagmi hooks
	const { address, isConnected, chain } = useAccount();
	const { connect, connectors } = useConnect();
	const { disconnect } = useDisconnect();
	const { data: hash, sendTransaction, isPending: isSending, error: sendError } = useSendTransaction();
	const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
	const { switchChain } = useSwitchChain();

	// Popup states
	const [showFromNetworkPopup, setShowFromNetworkPopup] = useState(false);
	const [showFromTokenPopup, setShowFromTokenPopup] = useState(false);
	const [showToNetworkPopup, setShowToNetworkPopup] = useState(false);
	const [showToTokenPopup, setShowToTokenPopup] = useState(false);

	// Network and token options
	const networks = [
		{
			id: 'starknet',
			name: 'Starknet',
			icon: 'Globe',
			color: 'rgb(0, 80, 157)',
			textColor: 'white'
		},
		{
			id: 'base',
			name: 'Base',
			icon: 'Globe',
			color: 'rgb(0, 82, 255)',
			textColor: 'white'
		},
		{
			id: 'ethereum',
			name: 'Ethereum',
			icon: 'Zap',
			color: 'rgb(99, 102, 241)',
			textColor: 'white'
		},
		{
			id: 'gmail',
			name: 'Gmail',
			icon: 'Mail',
			color: 'rgb(234, 67, 53)',
			textColor: 'white'
		}
	];

	const tokens = [
		{
			id: 'usdc',
			name: 'USDC',
			icon: 'DollarSign',
			color: 'rgb(253, 196, 0)',
			textColor: 'rgb(0, 41, 107)'
		},
		{
			id: 'usdt',
			name: 'USDT',
			icon: 'DollarSign',
			color: 'rgb(38, 161, 123)',
			textColor: 'white'
		},
		{
			id: 'eth',
			name: 'ETH',
			icon: 'Coins',
			color: 'rgb(99, 102, 241)',
			textColor: 'white'
		}
	];

	const getNetworkById = (id: string) => networks.find(n => n.id === id.toLowerCase());
	const getTokenById = (id: string) => tokens.find(t => t.id === id.toLowerCase());

	// Helper function to render icons
	const renderIcon = (iconName: string, className = "w-4 h-4") => {
		const iconProps = { className };
		switch (iconName) {
			case 'Globe':
				return <Globe {...iconProps} />;
			case 'Mail':
				return <Mail {...iconProps} />;
			case 'Zap':
				return <Zap {...iconProps} />;
			case 'DollarSign':
				return <DollarSign {...iconProps} />;
			case 'Coins':
				return <Coins {...iconProps} />;
			case 'Key':
				return <Key {...iconProps} />;
			case 'User':
				return <User {...iconProps} />;
			default:
				return <Globe {...iconProps} />;
		}
	};

	// Close all popups when clicking outside
	useEffect(() => {
		const handleClickOutside = () => {
			setShowFromNetworkPopup(false);
			setShowFromTokenPopup(false);
			setShowToNetworkPopup(false);
			setShowToTokenPopup(false);
		};

		if (showFromNetworkPopup || showFromTokenPopup || showToNetworkPopup || showToTokenPopup) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	}, [showFromNetworkPopup, showFromTokenPopup, showToNetworkPopup, showToTokenPopup]);

	// Selection handlers
	const handleFromNetworkSelect = (networkId: string) => {
		if (networkId !== "base") {
			alert("Only Base is supported atm, " + networkId + " will be supported soon.");
			networkId = "base";
		}
		setSelectedFromNetwork(networkId);
		setShowFromNetworkPopup(false);
	};

	const handleFromTokenSelect = (tokenId: string) => {
		if (tokenId !== "usdc") {
			alert("Only USDC is supported atm, " + tokenId + " will be supported soon.");
			tokenId = "usdc";
		}
		setSelectedToken(tokenId);
		setShowFromTokenPopup(false);
	};

	const handleToNetworkSelect = (networkId: string) => {
		setSelectedToNetwork(networkId);
		setShowToNetworkPopup(false);
	};

	const swapNetworks = () => {
		const tempNetwork = selectedFromNetwork;
		setSelectedFromNetwork(selectedToNetwork);
		setSelectedToNetwork(tempNetwork);
	};

	// Selection Popup Component
	const SelectionPopup = ({
		items,
		onSelect,
		show,
		position = 'bottom'
	}: {
		items: any[],
		onSelect: (id: string) => void,
		show: boolean,
		position?: 'bottom' | 'top'
	}) => {
		if (!show) return null;

		return (
			<div
				className={`absolute ${position === 'bottom' ? 'top-full mt-1' : 'bottom-full mb-1'} left-0 right-0 z-50 rounded-lg border shadow-lg`}
				style={{
					backgroundColor: 'rgba(30, 30, 30, 0.95)',
					borderColor: 'rgb(80, 80, 80)',
					backdropFilter: 'blur(10px)'
				}}
				onClick={(e) => e.stopPropagation()}
			>
				{items.map((item) => (
					<div
						key={item.id}
						className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-700/50 transition-all first:rounded-t-lg last:rounded-b-lg"
						onClick={() => onSelect(item.id)}
					>
						<div
							className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
							style={{ backgroundColor: item.color, color: item.textColor }}
						>
							{renderIcon(item.icon, "w-4 h-4")}
						</div>
						<span className="text-white font-medium">{item.name}</span>
					</div>
				))}
			</div>
		);
	};

	// Base Chain ID
	const BASE_CHAIN_ID = base.id;

	// Validate recipient address/email
	const validateRecipient = (value: string, destination: string) => {
		if (!value.trim()) return 'This field is required';

		if (destination === 'gmail') {
			const emailRegex = /^[^\s@]+@gmail\.com$/;
			return emailRegex.test(value) ? undefined : 'Please enter a valid Gmail address';
		} else if (destination === 'base' || destination === 'ethereum') {
			// Ethereum/Base addresses
			const addressRegex = /^0x[a-fA-F0-9]{40}$/;
			return addressRegex.test(value) ? undefined : 'Please enter a valid wallet address';
		} else if (destination === 'starknet') {
			// Starknet addresses are longer and start with 0x
			const starknetRegex = /^0x[a-fA-F0-9]{63,64}$/;
			return starknetRegex.test(value) ? undefined : 'Please enter a valid Starknet address';
		}
		return undefined;
	};

	// Handle recipient input change
	const handleRecipientChange = (value: string) => {
		setRecipientAddress(value);
		const error = validateRecipient(value, selectedToNetwork.toLowerCase());
		setErrors(prev => ({ ...prev, recipient: error }));
	};

	// Handle destination change
	const handleDestinationChange = (destination: string) => {
		setSelectedToNetwork(destination);
		setRecipientAddress('');
		setClaimingKey('');
		setErrors(prev => ({ ...prev, recipient: undefined, claimingKey: undefined }));
	};

	// Generate cryptographically secure random claiming key
	const generateClaimingKey = () => {
		// Generate 256 bits (32 bytes) for extra security - more than the required 200 bits
		const randomBytes = new Uint8Array(32);
		crypto.getRandomValues(randomBytes);

		// Convert to hexadecimal string
		const hexKey = Array.from(randomBytes)
			.map(byte => byte.toString(16).padStart(2, '0'))
			.join('');

		setClaimingKey(hexKey);
		setErrors(prev => ({ ...prev, claimingKey: undefined }));
	};

	// Auto-generate claiming key when component mounts or destination changes (client-side only)
	useEffect(() => {
		// Only generate if we're on the client side and don't have a key
		if (typeof window !== 'undefined' && !claimingKey) {
			generateClaimingKey();
		}
	}, [selectedToNetwork, claimingKey]);

	// Validate claiming key
	const validateClaimingKey = (value: string) => {
		if (!value.trim()) return 'Claiming key is required';
		if (!/^[a-fA-F0-9]{64}$/.test(value)) return 'Invalid claiming key format';
		return undefined;
	};

	// Handle approve and send functionality using wagmi
	const handleApproveAndSend = async () => {
		const recipientError = validateRecipient(recipientAddress, selectedToNetwork.toLowerCase());
		const claimingKeyError = validateClaimingKey(claimingKey);

		if (recipientError || claimingKeyError) {
			setErrors(prev => ({
				...prev,
				recipient: recipientError,
				claimingKey: claimingKeyError
			}));
			return;
		}

		if (!isConnected) {
			// Connect to the first available connector (usually MetaMask/injected)
			const connector = connectors.find(c => c.type === 'injected') || connectors[0];
			if (connector) {
				connect({ connector });
			}
			return;
		}

		try {
			// Ensure we're on Base network for Base transfers
			if (selectedToNetwork.toLowerCase() === 'base' && chain?.id !== BASE_CHAIN_ID) {
				switchChain({ chainId: BASE_CHAIN_ID });
				return;
			}

			if (selectedToNetwork.toLowerCase() === 'gmail') {
				// Handle Gmail transfers (would integrate with your MIST system)
				// This would be handled differently, possibly through an API call
				alert('Gmail transfer integration not implemented yet');
				return;
			}

			// Handle blockchain transfers using wagmi
			if (selectedToken.toLowerCase() === 'eth') {
				// ETH transfer
				sendTransaction({
					to: recipientAddress as `0x${string}`,
					value: parseEther('0.1'), // 0.1 ETH - replace with actual amount from form
				});
			} else {
				// For now, show that token transfers need contract interaction
				alert('Token transfers will be implemented with useWriteContract');
			}
		} catch (error: any) {
			console.error('Transaction failed:', error);
		}
	};

	// Connect wallet function
	const connectWallet = () => {
		const connector = connectors.find(c => c.type === 'injected') || connectors[0];
		if (connector) {
			connect({ connector });
		}
	};

	const getFieldLabel = () => {
		return !selectedToNetwork ? 'Anyone' : selectedToNetwork.toLowerCase() === 'gmail' ? 'Email Address' : 'Wallet address';
	};

	const isFormValid = !errors.recipient && !errors.claimingKey && recipientAddress.trim() && claimingKey.trim() && selectedToNetwork;
	const isOnCorrectChain = !selectedToNetwork || selectedToNetwork.toLowerCase() !== 'base' || chain?.id === BASE_CHAIN_ID;

	// Determine transaction state for UI
	const getTransactionState = () => {
		if (isSending) return 'sending';
		if (isConfirming) return 'confirming';
		if (isConfirmed) return 'sent';
		return 'idle';
	};

	const txState = getTransactionState();

	return (
		<div className="text-white acrylic flex items-center justify-center p-4 sm:p-6">
			<div className="w-full max-w-2xl px-2 sm:px-0">
				{/* Transfer Interface */}
				<div className="max-w-md mx-auto">
					{/* From Section */}
					<div className="mb-3">
						<label className="block text-sm font-medium mb-3" style={{ color: 'rgb(240, 245, 255)' }}>
							From
						</label>
						<div className="grid grid-cols-2 gap-3">
							{/* From Network Selector */}
							<div className="relative">
								<div
									className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:border-opacity-60 transition-all"
									style={{
										backgroundColor: 'rgba(63, 63, 63, 0.4)',
										borderColor: 'rgb(80, 80, 80)'
									}}
									onClick={(e) => {
										e.stopPropagation();
										setShowFromNetworkPopup(!showFromNetworkPopup);
										setShowFromTokenPopup(false);
										setShowToNetworkPopup(false);
										setShowToTokenPopup(false);
									}}
								>
									{(() => {
										const network = getNetworkById(selectedFromNetwork);
										return (
											<>
												<div
													className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
													style={{ backgroundColor: network?.color, color: network?.textColor }}
												>
													{renderIcon(network?.icon || 'Globe', "w-4 h-4")}
												</div>
												<span className="text-white font-medium">{network?.name}</span>
												<ChevronDown className="w-4 h-4 ml-auto text-gray-400" />
											</>
										);
									})()}
								</div>
								<SelectionPopup
									items={networks}
									onSelect={handleFromNetworkSelect}
									show={showFromNetworkPopup}
								/>
							</div>

							{/* From Token Selector */}
							<div className="relative">
								<div
									className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:border-opacity-60 transition-all"
									style={{
										backgroundColor: 'rgba(63, 63, 63, 0.4)',
										borderColor: 'rgb(80, 80, 80)'
									}}
									onClick={(e) => {
										e.stopPropagation();
										setShowFromTokenPopup(!showFromTokenPopup);
										setShowFromNetworkPopup(false);
										setShowToNetworkPopup(false);
										setShowToTokenPopup(false);
									}}
								>
									{(() => {
										const token = getTokenById(selectedToken);
										return (
											<>
												<div
													className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
													style={{ backgroundColor: token?.color, color: token?.textColor }}
												>
													{renderIcon(token?.icon || 'DollarSign', "w-4 h-4")}
												</div>
												<span className="text-white font-medium">{token?.name}</span>
												<ChevronDown className="w-4 h-4 ml-auto text-gray-400" />
											</>
										);
									})()}
								</div>
								<SelectionPopup
									items={tokens}
									onSelect={handleFromTokenSelect}
									show={showFromTokenPopup}
								/>
							</div>
						</div>
					</div>


					{/* To Section */}
					<div className="mb-6">
						<label className="block text-sm font-medium mb-3" style={{ color: 'rgb(240, 245, 255)' }}>
							To
						</label>
						<div className="grid grid-cols-2 gap-3 clear-both">
							{/* To Network Selector */}
							<div className="relative">
								<div
									className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:border-opacity-60 transition-all"
									style={{
										backgroundColor: 'rgba(63, 63, 63, 0.4)',
										borderColor: 'rgb(80, 80, 80)'
									}}
									onClick={(e) => {
										e.stopPropagation();
										setShowToNetworkPopup(!showToNetworkPopup);
										setShowFromNetworkPopup(false);
										setShowFromTokenPopup(false);
										setShowToTokenPopup(false);
									}}
								>
									{(() => {
										const network = getNetworkById(selectedToNetwork);
										return (
											<>
												<div
													className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
													style={{ backgroundColor: network?.color, color: network?.textColor }}
												>
													{renderIcon(network?.icon || 'Globe', "w-4 h-4")}
												</div>
												<span className="text-white font-medium">{network?.name}</span>
												<ChevronDown className="w-4 h-4 ml-auto text-gray-400" />
											</>
										);
									})()}
								</div>
								<SelectionPopup
									items={networks.filter(n => ['base', 'gmail'].indexOf(n.id) > -1)}
									onSelect={handleToNetworkSelect}
									show={showToNetworkPopup}
									position="top"
								/>
							</div>

							{/* To Token Selector */}
							<div className="relative">
								<div
									className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:border-opacity-60 transition-all"
									style={{
										backgroundColor: 'rgba(63, 63, 63, 0.4)',
										borderColor: 'rgb(80, 80, 80)'
									}}
									onClick={(e) => {
										e.stopPropagation();
										setShowToTokenPopup(!showToTokenPopup);
										setShowFromNetworkPopup(false);
										setShowFromTokenPopup(false);
										setShowToNetworkPopup(false);
									}}
								>
									{(() => {
										const token = getTokenById(selectedToken);
										return (
											<>
												<div
													className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
													style={{ backgroundColor: token?.color, color: token?.textColor }}
												>
													{renderIcon(token?.icon || 'DollarSign', "w-4 h-4")}
												</div>
												<span className="text-white font-medium">{token?.name}</span>
												<ChevronDown className="w-4 h-4 ml-auto text-gray-400" />
											</>
										);
									})()}
								</div>
								<SelectionPopup
									items={tokens}
									onSelect={handleFromTokenSelect}
									show={showToTokenPopup}
									position="top"
								/>
							</div>
						</div>

						{/* Recipient Address */}
						<div className="mt-4">
							<label className="block text-sm font-medium mb-2" style={{ color: 'rgb(240, 245, 255)' }}>
								{getFieldLabel()}
							</label>
							<div
								className="flex items-center space-x-3 p-3 rounded-lg border"
								style={{
									backgroundColor: 'rgba(63, 63, 63, 0.4)',
									borderColor: errors.recipient ? 'rgb(239, 68, 68)' : 'rgb(80, 80, 80)'
								}}
							>
								<div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(255, 87, 34)' }}>
									<User className="w-4 h-4 text-white" />
								</div>
								<input
									type="text"
									value={recipientAddress}
									onChange={(e) => handleRecipientChange(e.target.value)}
									placeholder={selectedToNetwork.toLowerCase() === 'gmail' ? 'user@gmail.com' : '0xCe8...d129'}
									className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
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
								<span className="text-xs text-gray-400 ml-2">(256-bit hex secret)</span>
							</label>
							<div
								className="flex items-center space-x-3 p-3 rounded-lg border"
								style={{
									backgroundColor: 'rgba(63, 63, 63, 0.4)',
									borderColor: errors.claimingKey ? 'rgb(239, 68, 68)' : 'rgb(80, 80, 80)'
								}}
							>
								<div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(34, 197, 94)' }}>
									<Key className="w-4 h-4 text-white" />
								</div>
								<input
									type="text"
									value={claimingKey}
									readOnly
									placeholder="Generating..."
									className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none font-mono text-sm tracking-wide cursor-default select-all break-all"
								/>
								<button
									type="button"
									onClick={generateClaimingKey}
									className="px-3 py-1 rounded text-sm transition-all hover:opacity-80 shrink-0"
									style={{
										backgroundColor: 'rgba(34, 197, 94, 0.6)',
										color: 'white'
									}}
								>
									Regenerate
								</button>
							</div>
							{errors.claimingKey && (
								<div className="mt-1 flex items-center gap-1 text-red-400 text-sm">
									<AlertCircle className="w-4 h-4" />
									{errors.claimingKey}
								</div>
							)}
							<div className="mt-1 text-xs text-gray-400">
								Share this code with the recipient to claim the funds.
							</div>
						</div>
					</div>

					{/* Amount Section */}
					<div className="mb-8">
						<label className="block text-sm font-medium mb-3" style={{ color: 'rgb(240, 245, 255)' }}>
							Amount
						</label>
						<div
							className="flex items-center space-x-3 p-3 rounded-lg border"
							style={{
								backgroundColor: 'rgba(63, 63, 63, 0.4)',
								borderColor: 'rgb(80, 80, 80)'
							}}
						>
							<div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(34, 197, 94)' }}>
								<DollarSign className="w-4 h-4 text-white" />
							</div>
							<input
								type="text"
								placeholder="0.00"
								className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
								defaultValue="1.221633"
							/>
							<div className="flex space-x-2">
								<button
									className="px-3 py-1 rounded text-sm transition-all hover:opacity-80"
									style={{
										backgroundColor: 'rgba(0, 80, 157, 0.6)',
										color: 'rgb(240, 245, 255)'
									}}
								>
									MIN
								</button>
								<button
									className="px-3 py-1 rounded text-sm transition-all hover:opacity-80"
									style={{
										backgroundColor: 'rgba(0, 80, 157, 0.6)',
										color: 'rgb(240, 245, 255)'
									}}
								>
									MAX
								</button>
							</div>
						</div>
					</div>

					{/* Connect Wallet Button */}
					<button
						className="w-full py-4 px-6 rounded-xl font-semibold text-white text-lg transition-all hover:scale-[1.02] hover:shadow-lg flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
						style={{
							background: isConnected && isFormValid
								? `linear-gradient(135deg, rgb(34, 197, 94) 0%, rgb(22, 163, 74) 100%)`
								: `linear-gradient(135deg, rgb(253, 196, 0) 0%, rgb(255, 213, 0) 100%)`,
							color: isConnected && isFormValid ? 'white' : 'rgb(0, 41, 107)'
						}}
						onClick={isConnected ? handleApproveAndSend : () => connect({ connector: connectors[0] })}
						disabled={txState !== 'idle'}
					>
						{txState === 'sending' && (
							<>
								<div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
								<span>Sending...</span>
							</>
						)}
						{txState === 'confirming' && (
							<>
								<div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
								<span>Confirming...</span>
							</>
						)}
						{txState === 'sent' && (
							<>
								<Check className="w-6 h-6" />
								<span>Sent!</span>
							</>
						)}
						{txState === 'idle' && !isConnected && (
							<>
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
								</svg>
								<span>Connect wallet</span>
							</>
						)}
						{txState === 'idle' && isConnected && (
							<>
								<Send className="w-6 h-6" />
								<span>{isFormValid ? 'Send Transfer' : 'Enter Details'}</span>
							</>
						)}
					</button>

					{/* Wallet Status */}
					{isConnected && (
						<div className="mt-3 text-center">
							<div className="text-sm text-gray-400">
								Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
							</div>
							{!isOnCorrectChain && (
								<div className="mt-1 text-sm text-yellow-400 flex items-center justify-center space-x-1">
									<AlertTriangle className="w-4 h-4" />
									<span>Please switch to Base network</span>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}