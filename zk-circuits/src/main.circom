pragma circom 2.0.0;

include "circomlib/circuits/poseidon.circom";

template HashPreimage() {
    // Private input
    signal input a;
    signal input b;
    
    // Output
    signal output hash;
    
    // Components
    component hasher = Poseidon(2);
    component equalCheck = IsEqual();
    
    // Hash the secret with nullifier
    hasher.inputs[0] <== a;
    hasher.inputs[1] <== b;
    
    // Output the result
    hash <== hasher.out;
}

// Main component
component main = HashPreimage();
