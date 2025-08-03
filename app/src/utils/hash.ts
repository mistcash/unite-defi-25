import { keccak256, encodePacked } from 'viem';

/**
 * Placeholder hash function for bn254 Poseidon hash
 * Currently using keccak256 - replace with proper Poseidon implementation
 */
export function createHashMessage(recipient: string, claimingKey: string): bigint {
	const packed = encodePacked(['string', 'string'], [recipient, claimingKey]);
	return BigInt(keccak256(packed));
}
