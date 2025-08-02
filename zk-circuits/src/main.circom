pragma circom 2.0.0;

include "circomlib/circuits/poseidon.circom";

template MerkleVerifier(levs) {
    signal input value;
    signal input siblings[levs];
    signal output root;
    var results[levs];

    component hashers[levs];

    hashers[0] = Poseidon(2);
    // Hash the secret with nullifier
    hashers[0].inputs[0] <== value;
    hashers[0].inputs[1] <== siblings[0];

    for(var i = 1; i < levs; i++){
        hashers[i] = Poseidon(2);
        hashers[i].inputs[0] <== hashers[i-1].out;
        hashers[i].inputs[1] <== siblings[i];
    }

    // Output the result
    root <== hashers[levs - 1].out;
}

// Main component
component main = MerkleVerifier(16);
