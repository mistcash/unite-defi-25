include "@zk-email/circuits/lib/sha.circom";
include "@zk-email/circuits/lib/rsa.circom";


// We cheat a bit, we sign directly on email hash
// so email hash doesn't need to be recomputed in the circuit
// Saving a SHA 256 hash
// Email hash is directly used in the merkle tree
template JWTVerifier(
    n,
    k
) {
    signal input message[k];
    signal input signature[k];
    signal input modulus[k];

    // Verify RSA signature
    component rsaVerifier = RSAVerifier65537(n, k);

    rsaVerifier.message <== message[i].out;
    rsaVerifier.modulus <== modulus;
    rsaVerifier.signature <== signature;

    // Calculate the pubkey hash
    publicKeyHash <== PoseidonLarge(n, k)(pubkey);

    // Assert that period exists at periodIndex
    signal period <== ItemAtIndex(maxMessageLength)(message, periodIndex);
    period === 46;

    // Assert that period is unique
    signal periodCount <== CountCharOccurrences(maxMessageLength)(message, 46);
    periodCount === 1;

    // Find the real message length
    signal realMessageLength <== FindRealMessageLength(maxMessageLength)(message);

    // Calculate the length of the Base64 encoded header and payload
    signal b64HeaderLength <== periodIndex;
    signal b64PayloadLength <== realMessageLength - b64HeaderLength - 1;

    // Extract the Base64 encoded header and payload from the message
    signal b64Header[maxB64HeaderLength] <== SelectSubArrayBase64(maxMessageLength, maxB64HeaderLength)(message, 0, b64HeaderLength);
    signal b64Payload[maxB64PayloadLength] <== SelectSubArrayBase64(maxMessageLength, maxB64PayloadLength)(message, b64HeaderLength + 1, b64PayloadLength);

    // Decode the Base64 encoded header and payload
    header <== Base64Decode(maxHeaderLength)(b64Header);
    payload <== Base64Decode(maxPayloadLength)(b64Payload);
}