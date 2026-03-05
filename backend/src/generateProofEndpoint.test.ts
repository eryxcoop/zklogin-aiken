import {describe, it} from 'node:test';
import * as assert from 'node:assert/strict';
import {handleGenerateProofEndpoint} from "./handleGenerateProofEndpoint.ts";
import {circuitInputs} from "../tests_common_code/testDataForACompleteFlowOfZkLogin.ts";
import {execSync} from "node:child_process";
import {writeProofInFile} from "../tests_common_code/writeProofInFile.ts";

describe("Generate proof endpoint tests", () => {
    function sessionDataJson() {
        return circuitInputs();
    }

    function assertResponseIs200(response: any) {
        assert.equal(response.status, 200);
    }

    function assertResponseHasField(fieldName: string, actualResponse: any) {
        assert.ok(Object.hasOwn(actualResponse.body, fieldName))
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