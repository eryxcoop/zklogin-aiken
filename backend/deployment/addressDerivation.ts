import {readFileSync} from "node:fs";
import {applyParamsToScript} from "@meshsdk/core-csl";
import {serializePlutusScript} from "@meshsdk/core";
import {ZKLOGIN_ID} from "./transactionData"

export function deriveScriptAddress(parsedJson, validatorScriptIndex: number) {
    const parameterized_script = applyParamsToScript(
        parsedJson.validators[validatorScriptIndex].compiledCode,
        [ZKLOGIN_ID]
    );
    const scriptAddr = serializePlutusScript(
        {code: parameterized_script, version: "V3"}
    ).address;
    return scriptAddr;
}

async function main() {
    const compiledContractPath = "./plutus.json";
    const validatorScriptIndex = 0;

    const jsonString = readFileSync(compiledContractPath, 'utf-8');
    const parsedJson = JSON.parse(jsonString);
    const scriptAddr = deriveScriptAddress(parsedJson, validatorScriptIndex);
    console.log(scriptAddr);
    return 0;
}

main();