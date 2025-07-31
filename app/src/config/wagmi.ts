'use client'

import { http, createConfig } from 'wagmi'
import { base, mainnet } from 'wagmi/chains'
import { injected, metaMask } from 'wagmi/connectors'

export const config = createConfig({
	chains: [base, mainnet],
	connectors: [
		injected(),
		metaMask(),
	],
	transports: {
		[base.id]: http(),
		[mainnet.id]: http(),
	},
	ssr: true,
	syncConnectedChain: true,
})

declare module 'wagmi' {
	interface Register {
		config: typeof config
	}
}
