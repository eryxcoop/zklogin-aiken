import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import {execSync} from 'node:child_process';

function executeExternalToolToCreateProof(inputZkLoginFilePath, proofFilePath) {
    const toolExecutionCommandLine = `aiken-zk prove meshjs circuits/zk_login.circom verification_key.zkey ${inputZkLoginFilePath} ${proofFilePath}`;
    execSync(toolExecutionCommandLine, {encoding: 'utf8'});
}

async function createCircuitParametersFileForExternalTool(inputZkLoginData: Record<string, unknown>, temporaryWorkingDirectoryPath: string, inputZkLoginFilePath) {
    const inputZkLoginFileContent = JSON.stringify(inputZkLoginData, null, 2);
    await fs.mkdir(temporaryWorkingDirectoryPath, {recursive: true});
    await fs.writeFile(inputZkLoginFilePath, inputZkLoginFileContent, 'utf8');
}

export async function generateProof(inputZkLoginData: Record<string, unknown>, temporaryWorkingDirectoryPath: string, proofFilePath) {
    const inputZkLoginFilePath = path.join(temporaryWorkingDirectoryPath, `input_zkLogin_${Date.now()}.json`);
    await createCircuitParametersFileForExternalTool(inputZkLoginData, temporaryWorkingDirectoryPath, inputZkLoginFilePath);
    executeExternalToolToCreateProof(inputZkLoginFilePath, proofFilePath);
}
