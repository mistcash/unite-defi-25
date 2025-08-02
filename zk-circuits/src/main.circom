pragma circom 2.0.0;

include "circomlib/circuits/poseidon.circom";

template BinarySelectorHasher() {
    signal input i;     // Must be 0 or 1
    signal input a;     // Value when i = 0
    signal input b;     // Value when i = 1
    signal output out;    // Result

    // i must be binary (0 or 1)
    i * (1 - i) === 0;
    
    component hasher = Poseidon(2);
    // 0 selects a then b, 1 selects b then a
    hasher.inputs[0] <== a + i * (b - a);
    hasher.inputs[1] <== b + (1 - i) * (a - b);

    out <== hasher.out;
}

template MerkleVerifier(levs) {
    signal input value;
    signal input siblings[levs];
    signal input flipOrder[levs];
    signal output root;
    var results[levs];

    component hashers[levs];
    component binSel[levs];

    hashers[0] = BinarySelectorHasher();
    hashers[0].a <== value;
    hashers[0].b <== siblings[0];
    hashers[0].i <== flipOrder[0];

    for(var i = 1; i < levs; i++){
        hashers[i] = BinarySelectorHasher();
        hashers[i].i <== flipOrder[i];
        hashers[i].a <== hashers[i-1].out;
        hashers[i].b <== siblings[i];
    }

    // Output the result
    root <== hashers[levs - 1].out;
}

// Main component
component main = MerkleVerifier(16);
