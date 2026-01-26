import {readFileSync} from "node:fs";
import {applyParamsToScript} from "@meshsdk/core-csl";
import {serializePlutusScript} from "@meshsdk/core";


async function main() {
    const compiledContractPath = "./plutus.json";
    const validatorScriptIndex = 0;

    const jsonString = readFileSync(compiledContractPath, 'utf-8');
    const parsedJson = JSON.parse(jsonString);
    const parameterized_script = applyParamsToScript(
        parsedJson.validators[validatorScriptIndex].compiledCode,
        [BigInt("14148750501214927097030011212605728027483349936086135333593501826084812421527")]
    );
    const scriptAddr = serializePlutusScript(
        {code: parameterized_script, version: "V3"}
    ).address;
    console.log(scriptAddr);
    return scriptAddr;
}

main();