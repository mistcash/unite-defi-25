# TransferUI Implementation

## Overview
The TransferUI component has been updated to support wallet connection, token approval, and private transactions as requested.

## Key Features Implemented

### 1. Contract Integration
- **USDC Token Contract**: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- **Private TX Contract**: `0x72727C53dca4f739974F403C8044008Fe4CA2771`

### 2. Two-Step Transaction Process
1. **Approve USDC**: First, the user approves the private TX contract to spend their USDC tokens
2. **Execute private_tx**: After approval, calls the `private_tx` function with amount and hash message

### 3. Hash Message Generation
- Uses Poseidon hash (currently placeholder with keccak256) to hash `recipientAddress` and `claimingKey`
- The hash is passed as `_hashMessage` parameter to `private_tx`

### 4. Enhanced UI States
- Shows different button states: "Connect wallet", "Approve USDC", "Send Transfer"
- Displays transaction progress: "Approving...", "Sending...", "Sent!"
- Shows current USDC allowance in wallet status

## Technical Details

### Contract ABIs
- **ERC20 ABI**: Minimal ABI with `approve` and `allowance` functions
- **Private TX ABI**: Contains the `private_tx(uint256 _amount, uint256 _hashMessage)` function

### Transaction Flow
1. User enters recipient email, claiming key is auto-generated
2. User enters amount and clicks "Approve USDC" (if approval needed)
3. After approval confirmation, button changes to "Send Transfer"
4. Clicking "Send Transfer" calls `private_tx` with the hashed message

### Error Handling
- Form validation for all required fields
- Network switching to Base chain
- Transaction failure handling with proper state reset

## Important Notes

### Poseidon Hash Implementation
The current implementation uses a placeholder Poseidon hash function (`src/utils/poseidon.ts`) that uses keccak256. For production, you should replace this with a proper bn254-compatible Poseidon hash implementation.

### Recommended Libraries for Poseidon
- `circomlib` - Official Circom library with Poseidon implementation
- `poseidon-lite` - Lightweight Poseidon implementation
- Custom implementation compatible with your ZK circuits

### USDC Decimals
The implementation assumes USDC has 6 decimals (standard for USDC). Amounts are converted using `parseUnits(amount, 6)`.

## Usage
1. Connect wallet (MetaMask/injected wallet)
2. Ensure you're on Base network
3. Enter recipient Gmail address
4. Enter amount of USDC to transfer
5. Click "Approve USDC" to approve spending
6. Click "Send Transfer" to execute the private transaction

The claiming key is automatically generated and should be shared with the recipient to claim the funds.
