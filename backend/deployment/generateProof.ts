import * as fs from 'node:fs/promises';
import * as path from 'node:path';

export async function generateProof(inputZkLogin: Record<string, unknown>, proofPath) {
    const proofDir = path.dirname(proofPath);
    const serializedProof = JSON.stringify(inputZkLogin, null, 2);

    await fs.mkdir(proofDir, {recursive: true});
    await fs.writeFile(proofPath, serializedProof, 'utf8');

    return proofPath;
}
