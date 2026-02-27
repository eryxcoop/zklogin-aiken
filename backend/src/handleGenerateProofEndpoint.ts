import {generateProof} from "../deployment/generateProof.ts";

export async function handleGenerateProofEndpoint(request) {
    try {
        const proofPath = await generateProof(request.body, 'generated_proofs', 'generated_proofs/zk_redeemer.ts');
        return {
            status: 200,
            body: {
                'message': 'Proof generated successfully.',
                'proofPath': proofPath
            }
        }
    } catch (error)
        {
            return {
                status: 500,
                body: {
                    'message': 'Proof generation failed.',
                    'error': error.message
                }
            };
        }
    }