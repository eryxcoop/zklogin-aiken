import {generateProof} from "../deployment/generateProof.ts";
import {execSync} from "node:child_process";
import * as fs from 'node:fs/promises';

export async function handleGenerateProofEndpoint(request, generateProofAction = null) {
    try {
        let proofFilePath = 'generated_proofs/zk_redeemer.ts';
        if (generateProofAction === null) {
            generateProofAction = (toolExecutionCommandLine) => {
                execSync(toolExecutionCommandLine, {encoding: 'utf8'});
            };
        }

        const proofPath = await generateProof(
            generateProofAction,
            request.body,
            'generated_proofs',
            proofFilePath
        );

        const proofContent = await fs.readFile(proofFilePath, 'utf8');

        return {
            status: 200,
            body: {
                'message': 'Proof generated successfully.',
                'proofPath': proofPath,
                'proofContent': proofContent
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