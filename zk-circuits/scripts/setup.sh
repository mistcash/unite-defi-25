#!/bin/bash

# Script to set up the circom project from scratch

echo "Setting up circom project..."

# Create build directory
mkdir -p build

# Compile the circuit
echo "Compiling circuit..."
circom circuits/main.circom --r1cs --wasm --sym -o build/

# Check if Powers of Tau file exists
if [ ! -f "powersOfTau28_hez_final_15.ptau" ]; then
    echo "Downloading Powers of Tau ceremony file..."
    wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_15.ptau
fi

# Generate proving and verification keys
echo "Generating proving key..."
snarkjs groth16 setup build/main.r1cs powersOfTau28_hez_final_15.ptau circuit_final.zkey

# Export verification key
echo "Exporting verification key..."
snarkjs zkey export verificationkey circuit_final.zkey verification_key.json

# Generate Solidity verifier
echo "Generating Solidity verifier..."
snarkjs zkey export solidityverifier circuit_final.zkey verifier.sol

echo "Setup complete!"
echo "You can now run 'npm run prove' to generate a proof and 'npm run verify' to verify it."
