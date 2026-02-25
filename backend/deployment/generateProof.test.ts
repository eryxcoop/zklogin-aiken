import {before, describe, it} from 'node:test';
import {generateProof} from './generateProof.ts'
import {session_data} from '../tests/xxxx.ts';
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

async function assertProofFileIsValid(proofFileToValidatePath: string) {
    const expectedProof = /import \{MConStr\} from "@meshsdk\/common";\nimport \{Data, mConStr0\} from "@meshsdk\/core";\n\ntype Proof = MConStr<any, string\[\]>;\n\ntype ZKRedeemer = MConStr<any, Data\[\] \| Proof\[\]>;\n\nfunction mProof\(piA: string, piB: string, piC: string\): Proof \{\n    if \(piA\.length != 96 \|\| piB\.length != 192 \|\| piC\.length != 96\) \{\n        throw new Error\("Wrong proof"\);\n    \}\n\n    return mConStr0\(\[piA, piB, piC\]\);\n\}\n\nexport function mZKRedeemer\(redeemer: Data\): ZKRedeemer \{\n    return mConStr0\(\[redeemer, proofs\(\)\]\);\n\}\n\nfunction proofs\(\): Proof\[\] \{\n    return \[\n\t\tmProof\(\n\t\t\t"[0-9a-f]{96}",\n\t\t\t"[0-9a-f]{192}",\n\t\t\t"[0-9a-f]{96}",\n\t\t\),\n    \];\n\}\n/;
    const proofContent = await fs.readFile(proofFileToValidatePath, 'utf8');
    assert.match(proofContent, expectedProof);
}

describe("Generate proof tests", function () {
    before(async () => {
        const testDataPath = 'deployment/test_data';
        await fs.mkdir(testDataPath, {recursive: true});
        const testDataFiles = await fs.readdir(testDataPath);
        await Promise.all(
            testDataFiles.map((fileName) =>
                fileName === '.gitkeep'
                    ? Promise.resolve()
                    : fs.rm(`${testDataPath}/${fileName}`, {recursive: true, force: true}),
            ),
        );
    });

    it("happy path", async () => {
        const inputZkLoginData = session_data();
        const requestedProofFile = 'deployment/test_data/zk_redeemer.ts';

        const inputZkLoginDataTempFile = await generateProof(inputZkLoginData, 'deployment/test_data', requestedProofFile);

        const expectedProofFile = 'deployment/test_data/zk_redeemer.ts';

        assert.ok(await checkFileExists(requestedProofFile));

        assert.ok(await checkFileExists(inputZkLoginDataTempFile));
        await assertProofFileIsValid(requestedProofFile);
    });
});
