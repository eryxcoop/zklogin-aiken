import * as fs from 'node:fs/promises';
import * as path from 'node:path';

export async function generateProof(inputZkLogin: Record<string, unknown>, inputZkLoginFileName) {
    const proofDir = path.dirname(inputZkLoginFileName);
    const inputZkLoginFileContent = JSON.stringify(inputZkLogin, null, 2);

    await fs.mkdir(proofDir, {recursive: true});
    await fs.writeFile(inputZkLoginFileName, inputZkLoginFileContent, 'utf8');

    return inputZkLoginFileName;
}
