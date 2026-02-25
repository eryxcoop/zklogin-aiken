import * as fs from 'node:fs/promises';
import * as path from 'node:path';

export async function generateProof(inputZkLoginData: Record<string, unknown>, proofFile) {

    // Create file with json data
    const inputZkLoginFileContent = JSON.stringify(inputZkLoginData, null, 2);

    // Invoke external tool to create proof

    // Move proof file to expected location
    //await fs.rename(proofFile, proofFile);
    const proofDir = path.dirname(proofFile);
    await fs.mkdir(proofDir, {recursive: true});
    await fs.writeFile(proofFile, 'dummy content', 'utf8');

    return proofFile;
}
