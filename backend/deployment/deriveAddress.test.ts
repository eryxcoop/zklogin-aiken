import { describe, it } from 'node:test';
import {deriveAddress} from './deriveAddress.ts'

describe("Derive address tests", function () {

    it("happy path", () => {
        deriveAddress(BigInt("21140065873708661981141523561235886173184262775540053915030560953831497869414"));
    });

});