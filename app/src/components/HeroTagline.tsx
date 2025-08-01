'use client'

import React, { useState, useEffect } from 'react';

const currencies = ['USDT', 'ETH', 'EUR', 'BTC'];
const platforms = ['Base', 'Gmail', 'Facebook', 'Optimism'];

export default function AnimatedHeroText() {

	const [currentCurrency, setCurrentCurrency] = useState(0);
	const [currentPlatform, setCurrentPlatform] = useState(0);
	const [currencyAnimating, setCurrencyAnimating] = useState(false);
	const [platformAnimating, setPlatformAnimating] = useState(false);

	useEffect(() => {
		const currencyInterval = setInterval(() => {
			setCurrencyAnimating(true);
			setTimeout(() => {
				setCurrentCurrency((prev) => (prev + 1) % currencies.length);
				setCurrencyAnimating(false);
			}, 150);
		}, 2000);

		return () => clearInterval(currencyInterval);
	}, []);

	useEffect(() => {
		const platformInterval = setInterval(() => {
			setPlatformAnimating(true);
			setTimeout(() => {
				setCurrentPlatform((prev) => (prev + 1) % platforms.length);
				setPlatformAnimating(false);
			}, 150);
		}, 2500);

		return () => clearInterval(platformInterval);
	}, []);

	return (
		<div
			className="min-h-screen flex items-center justify-center p-8"

		>
			<div className="text-center max-w-6xl mx-auto">
				<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
					Send{' '}
					<span className="relative inline-block w-40">
						<span
							className={`inline-block transition-all duration-300 ease-in-out ${currencyAnimating
								? 'transform -translate-y-4 opacity-0'
								: 'transform translate-y-0 opacity-100'
								}`}
						>
							<span
								style={{
									background: `linear-gradient(135deg, 
                    rgb(253, 196, 0) 0%, 
                    rgb(255, 213, 0) 50%, 
                    rgb(255, 240, 102) 100%)`,
									WebkitBackgroundClip: 'text',
									backgroundClip: 'text',
									color: 'transparent'
								}}
							>
								{currencies[currentCurrency]}
							</span>
						</span>
						<span className="absolute top-0 left-0 w-full h-full">
							<span
								className={`inline-block transition-all duration-300 ease-in-out ${currencyAnimating
									? 'transform translate-y-0 opacity-100'
									: 'transform translate-y-4 opacity-0'
									}`}
							>
								<span
									style={{
										background: `linear-gradient(135deg, 
                      rgb(253, 196, 0) 0%, 
                      rgb(255, 213, 0) 50%, 
                      rgb(255, 240, 102) 100%)`,
										WebkitBackgroundClip: 'text',
										backgroundClip: 'text',
										color: 'transparent'
									}}
								>
									{currencies[(currentCurrency + 1) % currencies.length]}
								</span>
							</span>
						</span>
					</span>
					{' '}
					<span className="relative">
						privately
					</span><br />
					{' '}to anyone on{' '}
					<span className="relative inline-block">
						<span
							className={`inline-block transition-all duration-300 ease-in-out ${platformAnimating
								? 'transform -translate-y-4 opacity-0'
								: 'transform translate-y-0 opacity-100'
								}`}
						>
							<span
								style={{
									background: `linear-gradient(135deg, 
                    rgb(0, 102, 204) 0%, 
                    rgb(0, 80, 157) 50%, 
                    rgb(0, 63, 136) 100%)`,
									WebkitBackgroundClip: 'text',
									backgroundClip: 'text',
									color: 'transparent'
								}}
							>
								{platforms[currentPlatform]}
							</span>
						</span>
						<span className="absolute top-0 left-0 w-full h-full">
							<span
								className={`inline-block transition-all duration-300 ease-in-out ${platformAnimating
									? 'transform translate-y-0 opacity-100'
									: 'transform translate-y-4 opacity-0'
									}`}
							>
								<span
									style={{
										background: `linear-gradient(135deg, 
                      rgb(0, 102, 204) 0%, 
                      rgb(0, 80, 157) 50%, 
                      rgb(0, 63, 136) 100%)`,
										WebkitBackgroundClip: 'text',
										backgroundClip: 'text',
										color: 'transparent'
									}}
								>
									{platforms[(currentPlatform + 1) % platforms.length]}
								</span>
							</span>
						</span>
					</span>
					.
				</h1>

				<div
					className="mt-8 text-xl md:text-2xl opacity-80"
					style={{ color: 'rgb(240, 245, 255)' }}
				>
					Confidential transfers powered by zero-knowledge proofs
				</div>
			</div>
		</div>
	);
};