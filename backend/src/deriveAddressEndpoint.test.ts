import {describe, it} from 'node:test';
import {handleDeriveAddressEndpoint} from "./handleDeriveAddressEndpoint.ts";
import {
    assertFieldHasValue,
    assertResponseIs200,
} from "../tests_common_code/responseAssertions.ts";


describe("Derive address endpoint tests", () => {
    function callEndpoint(request: any): { status: number; body: any } {
        const host = 'localhost';
        const port = 8000;

        const url = new URL(request.url, `http://${host}:${port}`);
        const searchParams = url.searchParams;

        return handleDeriveAddressEndpoint(searchParams);
    }

    it("answers successfully when correct parameters are passed", () => {
        const request = {
            url: '/deriveAddress?zkLoginId=21140065873708661981141523561235886173184262775540053915030560953831497869414',
        };

        const actualResponse = callEndpoint(request);

        assertResponseIs200(actualResponse);
        assertFieldHasValue(actualResponse, 'message', 'Wallet created successfully.');
        assertFieldHasValue(actualResponse, 'execution_result_code', 0);
        assertFieldHasValue(actualResponse, 'status', 'success');
        assertFieldHasValue(actualResponse, 'walletAddress', 'addr_test1wz85pmuldpc0km0rcdjcu8c8a2c0rvcklut6puhhq0wu9ygvfat33');
    });
});