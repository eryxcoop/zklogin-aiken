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
        const inputZkLoginData = { proof: 'abc123', maxEpoch: 123 };
        const requestedProofFile = 'deployment/test_data/zk_redeemer.ts';

        const inputZkLoginDataTempFile = await generateProof(inputZkLoginData, 'deployment/test_data', requestedProofFile);

        const expectedProofFile = 'deployment/test_data/zk_redeemer.ts';
        const expectedProofContent = 'dummy content';

        assert.ok(await checkFileExists(requestedProofFile));

        assert.ok(await checkFileExists(inputZkLoginDataTempFile));

        const proofContent = await fs.readFile(requestedProofFile, 'utf8');
        assert.deepEqual(proofContent, expectedProofContent);
    });
});
