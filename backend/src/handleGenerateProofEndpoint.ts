import {generateProof} from "../deployment/generateProof.ts";
import {execSync} from "node:child_process";

export async function handleGenerateProofEndpoint(request) {
    try {
        let proofFilePath = 'generated_proofs/zk_redeemer.ts';
        const generateProofAction = (toolExecutionCommandLine) => {
            execSync(toolExecutionCommandLine, {encoding: 'utf8'});
        };
        const proofPath = await generateProof(
            generateProofAction,
            request.body,
            'generated_proofs',
            proofFilePath
        );

        return {
            status: 200,
            body: {
                'message': 'Proof generated successfully.',
                'proofPath': proofPath,
                //'proofContent':
            }
        }
    } catch (error) {
        return {
            status: 500,
            body: {
                'message': 'Proof generation failed.',
                'error': error.message
            }
        };
    }
}