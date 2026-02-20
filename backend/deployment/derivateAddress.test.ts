import { describe, it } from 'node:test';
import {derivateAddress} from './derivateAddress.ts'

describe("Circuit test", function () {

    it("verifies jwt signature using RS256", async () => {
        derivateAddress(BigInt("21140065873708661981141523561235886173184262775540053915030560953831497869414"));
    }, 1000000);

});