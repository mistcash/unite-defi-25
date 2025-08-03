pragma circom 2.0.0;

include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/comparators.circom";
include "circomlib/circuits/mux1.circom";

template BinarySelectorHasher() {
    signal input i;     // Must be 0 or 1
    signal input a;     // Input
    signal input b;     // Sibling
    signal output out;    // Result

    component isZero = IsZero();
    isZero.in <== b;

    // i must be binary (0 or 1)
    i * (1 - i) === 0;
    
    component hasher = Poseidon(2);
    // 0 selects a then b, 1 selects b then a
    hasher.inputs[0] <== a + i * (b - a);
    hasher.inputs[1] <== a + (1 - i) * (b - a);
    component mux = Mux1();
    mux.c[0] <== hasher.out;     // when isZero.out == 0 (sibling != 0)
    mux.c[1] <== a;    // when isZero.out == 1 (sibling == 0)
    mux.s <== isZero.out;

    out <== mux.out;
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

// // Main component
component main = MerkleVerifier(16);

// root = 19961037077221450811179090755490497271310203121908505232896238333507349516398
// root = hash("22", "77") 🥳

/* INPUT = {
    "value": "77",
    "siblings": ["22", "0", "0", "0", "0","0", "0", "0", "0", "0","0", "0", "0", "0", "0","0"],
    "flipOrder": ["1", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]
} */
