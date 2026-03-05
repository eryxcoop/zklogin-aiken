import {describe, it} from 'node:test';
import * as assert from 'node:assert/strict';
import {circuitInputs} from "../tests_common_code/testDataForACompleteFlowOfZkLogin.ts";
import {handleFundAddressEndpoint} from "./handleFundAddressEndpoint.ts";

describe("Fund address endpoint tests", () => {
    function sessionDataJson() {
        return circuitInputs();
    }

    function assertResponseIs200(response: any) {
        assert.equal(response.status, 200);
    }

    function assertResponseHasField(fieldName: string, actualResponse: any) {
        assert.ok(Object.hasOwn(actualResponse.body, fieldName))
    }

    function endpointLogicThatExecutesSuccessfully(scriptAddr) {
        return 'a valid transaction hash';
    }

    it("answers successfully when correct parameters are passed", async () => {
        const request = {
            url: '/fundAddress',
            body: {
                'zkLoginAddress': '',
            },
        };

        const actualResponse = await handleFundAddressEndpoint(request, endpointLogicThatExecutesSuccessfully);

        assertResponseIs200(actualResponse);
        assertResponseHasField('message', actualResponse);
        assertResponseHasField('transactionHash', actualResponse);
    });
});