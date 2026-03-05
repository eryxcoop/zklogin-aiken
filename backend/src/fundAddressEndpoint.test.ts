import {describe, it} from 'node:test';
import {handleFundAddressEndpoint} from "./handleFundAddressEndpoint.ts";
import {
    assertResponseHasField,
    assertResponseIs200,
    assertResponseIs500
} from "../tests_common_code/responseAssertions.ts";

describe("Fund address endpoint tests", () => {

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