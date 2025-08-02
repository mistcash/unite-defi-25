const snarkjs = require("snarkjs");
const fs = require("fs");
const { poseidon2 } = require("poseidon-lite");

async function generateProof() {
	console.log("Generating proof...");

	// Example input
	const secret = "123456789";
	const nullifier = "987654321";

	// Calculate the public commitment
	const publicCommitment = poseidon2([BigInt(secret), BigInt(nullifier)]);

	const input = {
		secret: secret,
		publicCommitment: publicCommitment.toString(),
		nullifier: nullifier
	};

	console.log("Input:", input);

	try {
		// Generate witness
		const { proof, publicSignals } = await snarkjs.groth16.fullProve(
			input,
			"circuits/main.wasm",
			"circuit_final.zkey"
		);

		console.log("Proof generated successfully!");
		console.log("Public signals:", publicSignals);

		// Save proof
		fs.writeFileSync("proof.json", JSON.stringify(proof, null, 2));
		fs.writeFileSync("public.json", JSON.stringify(publicSignals, null, 2));

		console.log("Proof saved to proof.json");
		console.log("Public signals saved to public.json");

		return { proof, publicSignals };
	} catch (error) {
		console.error("Error generating proof:", error);
		throw error;
	}
}

if (require.main === module) {
	generateProof().catch(console.error);
}

module.exports = { generateProof };
