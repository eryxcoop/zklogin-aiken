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
        handleDeriveAddressAction(searchParams, response);
        return response;
    }

    function assertResponseIs200(response: any) {
        assert.equal(response.status, 200);
    }

    it.skip("xxx", () => {
        const request = {};

        // Call endpoint
        const actualResponse = callEndpoint(request);

        assertResponseIs200(actualResponse)
    });
});