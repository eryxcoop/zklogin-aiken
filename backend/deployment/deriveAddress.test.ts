import { describe, it } from 'node:test';
import {deriveAddress} from './deriveAddress.ts'
import * as assert from 'node:assert/strict';

describe("Derive address tests", function () {

    it("happy path", async () => {
        const derivedAddress = await deriveAddress(BigInt('21140065873708661981141523561235886173184262775540053915030560953831497869414'));

        const addressBeginning = derivedAddress.slice(0, 5);
        const expectedBeginning = 'addr_';
        assert.equal(addressBeginning, expectedBeginning);
    });

});