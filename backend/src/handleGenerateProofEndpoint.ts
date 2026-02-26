import {generateProof} from "../deployment/generateProof.ts";

export async function handleGenerateProofEndpoint(request) {
    const body: Record<string, unknown> = await new Promise((resolve, reject) => {
        let data = '';
        request.on('data', chunk => {
            data += chunk;
        });
        request.on('end', () => {
            try {
                resolve(JSON.parse(data));
            } catch (error) {
                reject(error);
            }
        });
        request.on('error', reject);
    });
    const proofPath = await generateProof(body, 'generated_proofs', 'generated_proofs/zk_redeemer.ts');
    return {
        status: 200,
        body: {'proofPath': proofPath}
    };
}