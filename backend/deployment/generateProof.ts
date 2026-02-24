import * as fs from 'node:fs/promises';
import * as path from 'node:path';

export async function generateProof(inputZkLoginData: Record<string, unknown>, proofFile) {

    // Create file with json data
    const proofDir = path.dirname(proofFile);
    const inputZkLoginFileContent = JSON.stringify(inputZkLoginData, null, 2);
    await fs.mkdir(proofDir, {recursive: true});
    await fs.writeFile(proofFile, inputZkLoginFileContent, 'utf8');

    // Invoke external tool to create proof

    // Move proof file to expected location
    //await fs.rename(proofFile, proofFile);

    return proofFile;
}
