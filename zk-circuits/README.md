# ZK Circuits

This directory contains the zero-knowledge circuits for the Unite DeFi project using Circom.

## Prerequisites

- Node.js v16 or higher
- circom compiler
- snarkjs

## Installation

1. Install circom:
```bash
# Install circom
git clone https://github.com/iden3/circom.git
cd circom
cargo build --release
cargo install --path circom
```

2. Install dependencies:
```bash
npm install
```

3. Download Powers of Tau ceremony file (for production):
```bash
wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_15.ptau
```

## Project Structure

```
zk-circuits/
├── circuits/           # Circom circuit files
│   ├── main.circom    # Main circuit
│   └── utils/         # Utility circuits
├── scripts/           # Build and utility scripts
├── test/             # Circuit tests
├── build/            # Compiled outputs
└── proofs/           # Generated proofs
```

## Usage

### Compile Circuits
```bash
npm run compile
```

### Run Tests
```bash
npm test
```

### Generate Proof
```bash
npm run prove
```

### Verify Proof
```bash
npm run verify
```

## Circuit Development

1. Write your circuits in the `circuits/` directory
2. Test them using the test framework
3. Compile and generate the necessary keys
4. Generate and verify proofs

## Security Notes

- Always use a trusted Powers of Tau ceremony file for production
- Verify the circuit logic thoroughly before deployment
- Keep private keys secure
