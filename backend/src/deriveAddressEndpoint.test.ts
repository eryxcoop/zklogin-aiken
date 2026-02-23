import {describe, it} from 'node:test';
import {deriveAddress} from '../deployment/deriveAddress.ts'
import assert from 'node:assert/strict';
import {handleDeriveAddressAction} from "./handleDeriveAddressAction.ts";


describe("Derive address endpoint tests", () => {
    function callEndpoint(request: any): void {
        const host = 'localhost';
        const port = 8000;

        const url = new URL(request.url, `http://${host}:${port}`);
        const searchParams = url.searchParams;

        function Response() {
            this.status = undefined;
            this.writeHead = (statusCode, headers: any) => {
                this.status = statusCode;
            };
            this.end = (something: string) => {
            };
        };
        let response = new Response();
        return handleDeriveAddressAction(searchParams, response);
    }

    function assertResponseIs200(response: any) {
        assert.equal(response.status, 200);
        assert.equal(response.body['message'], "Wallet created successfully.");
        assert.equal(response.body['execution_result_code'], 0);
        assert.equal(response.body['status'], 'success');
        assert.equal(response.body['walletAddress'], 'addr_test1wz85pmuldpc0km0rcdjcu8c8a2c0rvcklut6puhhq0wu9ygvfat33');
    }

    it("xxx", () => {
        const request = {
            url: '/deriveAddress?zkLoginId=21140065873708661981141523561235886173184262775540053915030560953831497869414',
        };

        // Call endpoint
        const actualResponse = callEndpoint(request);

        assertResponseIs200(actualResponse)
    });
});