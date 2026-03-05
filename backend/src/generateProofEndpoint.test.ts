import {describe, it} from 'node:test';
import {handleGenerateProofEndpoint} from "./handleGenerateProofEndpoint.ts";
import {circuitInputs} from "../tests_common_code/testDataForACompleteFlowOfZkLogin.ts";
import {execSync} from "node:child_process";
import {writeProofInFile} from "../tests_common_code/writeProofInFile.ts";
import {assertResponseHasField, assertResponseIs200} from "../tests_common_code/responseAssertions.ts";

describe("Generate proof endpoint tests", () => {
    function sessionDataJson() {
        return circuitInputs();
    }

    it("answers successfully when correct parameters are passed", async () => {
        const request = {
            url: '/generateProof',
            body: sessionDataJson(),
        };

        let generateRealProofAction: any;

        if (process.env.REAL_PROOF == "true") {
            generateRealProofAction = (toolExecutionCommandLine) => {
                execSync(toolExecutionCommandLine, {encoding: 'utf8'});
            };
        } else {
            generateRealProofAction = (_toolExecutionCommandLine) => {
                const outputProofFilePath = 'generated_proofs/proof.json';
                writeProofInFile(outputProofFilePath);
            };
        }

        const actualResponse = await handleGenerateProofEndpoint(request, generateRealProofAction);

        assertResponseIs200(actualResponse);
        assertResponseHasField("proofPath", actualResponse);
        assertResponseHasField("proofContent", actualResponse);
    });
});