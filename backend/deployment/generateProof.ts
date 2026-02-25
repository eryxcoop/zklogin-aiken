import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import {execSync} from 'node:child_process';

export async function generateProof(inputZkLoginData: Record<string, unknown>, temporaryWorkingDirectoryPath: string, proofFilePath) {

    // Determine path where to create file with circuit parameters
    // Create file with json data
    const inputZkLoginFileContent = JSON.stringify(inputZkLoginData, null, 2);
    await fs.mkdir(temporaryWorkingDirectoryPath, {recursive: true});
    const inputZkLoginFilePath = path.join(temporaryWorkingDirectoryPath, `input_zkLogin_${Date.now()}.json`);
    await fs.writeFile(inputZkLoginFilePath, inputZkLoginFileContent, 'utf8');

    // Invoke external tool to create proof
    // const toolGeneratedProofFile = ???
    const toolExecutionCommandLine = `aiken-zk prove meshjs circuits/zk_login.circom verification_key.zkey ${inputZkLoginFilePath} ${proofFilePath}`;
    execSync(toolExecutionCommandLine, {encoding: 'utf8'});

    return inputZkLoginFilePath;
}
