import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import {handleGenerateProofEndpoint} from "./handleGenerateProofEndpoint";
import {circuitInputs} from "../tests/testDataForACompleteFlowOfZkLogin";

describe("Generate proof endpoint tests", () => {
    function sessionDataJson() {
        return circuitInputs();
    }

    function callEndpoint(request: any): void {
        return handleGenerateProofEndpoint(request.body);
    }

    function assertResponseIs200(response: any) {
        assert.equal(response.status, 200);
    }

    it("answers successfully when correct parameters are passed", () => {
        const request = {
            url: '/generateProof',
            body: sessionDataJson()
        };

        const actualResponse = callEndpoint(request);

        assertResponseIs200(actualResponse);
    });
});