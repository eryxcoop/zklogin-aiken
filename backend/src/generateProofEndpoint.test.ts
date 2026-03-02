import {describe, it} from 'node:test';
import * as assert from 'node:assert/strict';
import {handleGenerateProofEndpoint} from "./handleGenerateProofEndpoint.ts";
import {circuitInputs} from "../tests/testDataForACompleteFlowOfZkLogin.ts";

describe("Generate proof endpoint tests", () => {
    function sessionDataJson() {
        return circuitInputs();
    }

    async function callEndpoint(request: any) {
        return await handleGenerateProofEndpoint(request);
    }

    function assertResponseIs200(response: any) {
        assert.equal(response.status, 200);
    }

    function assertResponseHasField(fieldName: string, actualResponse: any) {
        assert.ok(Object.hasOwn(actualResponse, fieldName))
    }

    it("answers successfully when correct parameters are passed", async () => {
        const request = {
            url: '/generateProof',
            body: sessionDataJson(),
        };

        const actualResponse = await callEndpoint(request);

        assertResponseIs200(actualResponse);
        //assertResponseHasField("proofPath", actualResponse);
        //assertResponseHasField("proofContent", actualResponse);
    });
});