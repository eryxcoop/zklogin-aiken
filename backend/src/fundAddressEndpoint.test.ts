import {describe, it} from 'node:test';
import * as assert from 'node:assert/strict';
import {handleFundAddressEndpoint} from "./handleFundAddressEndpoint.ts";

describe("Fund address endpoint tests", () => {

    function assertResponseIs200(response: any) {
        assert.equal(response.status, 200);
    }

    function assertResponseIs500(response: any) {
        assert.equal(response.status, 500);
    }

    function assertResponseHasField(fieldName: string, actualResponse: any) {
        assert.ok(Object.hasOwn(actualResponse.body, fieldName))
    }

    function endpointLogicThatExecutesSuccessfully(_scriptAddr) {
        return 'a valid transaction hash';
    }

    function endpointLogicThatExecutesUnsuccessfully(_scriptAddr) {
        throw new Error('Forced error');
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

    it("answers with error when a problem occurs", async () => {
        const request = {
            url: '/fundAddress',
            body: {
                'zkLoginAddress': '',
            },
        };

        const actualResponse = await handleFundAddressEndpoint(request, endpointLogicThatExecutesUnsuccessfully);

        assertResponseIs500(actualResponse);
        assertResponseHasField('message', actualResponse);
        assertResponseHasField('error', actualResponse);
    });
});