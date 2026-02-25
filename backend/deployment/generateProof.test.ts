import { before, describe, it } from 'node:test';
import {generateProof} from './generateProof.ts'
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';

async function checkFileExists(filePath) {
    try {
        await fs.access(filePath, fs.constants.F_OK);
        return true;
    } catch (error) {
        return false;
    }
}

describe("Generate proof tests", function () {
    before(async () => {
        const testDataPath = 'deployment/test_data';
        await fs.mkdir(testDataPath, { recursive: true });
        const testDataFiles = await fs.readdir(testDataPath);
        await Promise.all(
            testDataFiles.map((fileName) =>
                fileName === '.gitkeep'
                    ? Promise.resolve()
                    : fs.rm(`${testDataPath}/${fileName}`, { recursive: true, force: true }),
            ),
        );
    });

    it("happy path", async () => {
        const expectedProofFile = 'deployment/test_data/zk_redeemer.ts';
        const inputZkLoginData = { proof: 'abc123', maxEpoch: 123 };
        const expectedProofContent = 'dummy content';
        const proofPath = await generateProof(inputZkLoginData, expectedProofFile);

        assert.equal(proofPath, expectedProofFile);
        assert.ok(await checkFileExists(proofPath));

        const proofContent = await fs.readFile(proofPath, 'utf8');
        assert.deepEqual(proofContent, expectedProofContent);
    });
});
