const snarkjs = require("snarkjs");
const fs = require("fs");

async function verifyProof() {
	console.log("Verifying proof...");

	try {
		// Read proof and public signals
		const proof = JSON.parse(fs.readFileSync("proof.json", "utf8"));
		const publicSignals = JSON.parse(fs.readFileSync("public.json", "utf8"));

		// Read verification key
		const vKey = JSON.parse(fs.readFileSync("verification_key.json", "utf8"));

		// Verify the proof
		const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

		if (res === true) {
			console.log("Verification OK");
			return true;
		} else {
			console.log("Invalid proof");
			return false;
		}
	} catch (error) {
		console.error("Error verifying proof:", error);
		throw error;
	}
}

if (require.main === module) {
	verifyProof().catch(console.error);
}

module.exports = { verifyProof };
