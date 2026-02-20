import {readFileSync} from "node:fs";
import {applyParamsToScript} from "@meshsdk/core-csl";
import {serializePlutusScript} from "@meshsdk/core";
import {ZKLOGIN_ID} from "./transactionData.ts"

export function deriveAddress(zkloginid: bigint) {
    const compiledContractPath = "./plutus.json";
    const validatorScriptIndex = 0;
    let jsonString: string;

    try {
        jsonString = readFileSync(compiledContractPath, 'utf-8');
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw new Error("plutus.json does not exist, run 'aiken build' as stated in README.md");
        }
        throw error;
    }
    const parsedJson = JSON.parse(jsonString);

    const parameterized_script = applyParamsToScript(
        parsedJson.validators[validatorScriptIndex].compiledCode,
        [zkloginid]
    );
    const scriptAddr = serializePlutusScript(
        {code: parameterized_script, version: "V3"}
    ).address;
    return scriptAddr
}

deriveAddress(ZKLOGIN_ID);