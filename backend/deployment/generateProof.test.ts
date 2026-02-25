import {before, describe, it} from 'node:test';
import {generateProof} from './generateProof.ts'
import {session_data} from '../tests/xxxx.ts';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

async function assertProofFileExists(proofFileToCheck) {
    try {
        await fs.access(proofFileToCheck, fs.constants.F_OK);
    } catch (error) {
        assert.fail(`Proof file ${proofFileToCheck} does not exist (${error.message})`);
    }
}

async function assertProofFileIsValid(proofFileToValidatePath: string) {
    await assertProofFileExists(proofFileToValidatePath);
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
        const temporaryWorkingDirectoryPath = 'deployment/test_data';
        const requestedProofFile = path.join(temporaryWorkingDirectoryPath, 'zk_redeemer.ts');

        await generateProof(
            inputZkLoginData,
            temporaryWorkingDirectoryPath,
            requestedProofFile
        );

        await assertProofFileIsValid(requestedProofFile);
    });
});
