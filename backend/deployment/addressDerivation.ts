import {readFileSync} from "node:fs";
import {applyParamsToScript} from "@meshsdk/core-csl";
import {serializePlutusScript} from "@meshsdk/core";
import {ZKLOGIN_ID} from "./transactionData"

async function main() {
    const compiledContractPath = "./plutus.json";
    const validatorScriptIndex = 0;

    const jsonString = readFileSync(compiledContractPath, 'utf-8');
    const parsedJson = JSON.parse(jsonString);
    const parameterized_script = applyParamsToScript(
        parsedJson.validators[validatorScriptIndex].compiledCode,
        [ZKLOGIN_ID]
    );
    const scriptAddr = serializePlutusScript(
        {code: parameterized_script, version: "V3"}
    ).address;
    console.log(scriptAddr);
    return 0;
}

main();