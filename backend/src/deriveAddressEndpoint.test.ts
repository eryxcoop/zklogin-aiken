import {describe, it} from 'node:test';
import {deriveAddress} from '../deployment/deriveAddress.ts'
import assert from 'node:assert/strict';
import {handleDeriveAddressEndpoint} from "./handleDeriveAddressEndpoint.ts";


describe("Derive address endpoint tests", () => {
    function callEndpoint(request: any): void {
        const host = 'localhost';
        const port = 8000;

        const url = new URL(request.url, `http://${host}:${port}`);
        const searchParams = url.searchParams;

        return handleDeriveAddressEndpoint(searchParams);
    }

    function assertResponseIs200(response: any) {
        assert.equal(response.status, 200);
        assert.equal(response.body['message'], "Wallet created successfully.");
        assert.equal(response.body['execution_result_code'], 0);
        assert.equal(response.body['status'], 'success');
        assert.equal(response.body['walletAddress'], 'addr_test1wz85pmuldpc0km0rcdjcu8c8a2c0rvcklut6puhhq0wu9ygvfat33');
    }

    it("answers successfully when correct parameters are passed", () => {
        const request = {
            url: '/deriveAddress?zkLoginId=21140065873708661981141523561235886173184262775540053915030560953831497869414',
        };

        const actualResponse = callEndpoint(request);

        assertResponseIs200(actualResponse)
    });
});