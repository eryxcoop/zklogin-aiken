import {generateProof} from "../deployment/generateProof.ts";

export async function handleGenerateProofEndpoint(request) {
    const proofPath = await generateProof(request.body, 'generated_proofs', 'generated_proofs/zk_redeemer.ts');
    return {
        status: 200,
        body: {'proofPath': proofPath}
    };
}