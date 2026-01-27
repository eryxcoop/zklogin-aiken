// import {readFileSync} from "node:fs";
// import {applyParamsToScript} from "@meshsdk/core-csl";
// import {serializePlutusScript} from "@meshsdk/core";


async function main() {
    // const compiledContractPath = "./plutus.json";
    // const validatorScriptIndex = 0;
    //
    // const jsonString = readFileSync(compiledContractPath, 'utf-8');
    // const parsedJson = JSON.parse(jsonString);
    // const parameterized_script = applyParamsToScript(
    //     parsedJson.validators[validatorScriptIndex].compiledCode,
    //     ["14148750501214927097030011212605728027483349936086135333593501826084812421527"]
    // );
    // const scriptAddr = serializePlutusScript(
    //     {code: parameterized_script, version: "V3"}
    // ).address;
    // console.log(scriptAddr);
    let walletAddress = 'addr1q9sp3v7h0xt82l9ex9jsc9xzt2v5v74j9r7p9x8mrw5v9fppp58y7xg6g7k65c5pgvvxdplm7w07czz7e4dfflpnldwsw6x9ru';
    console.log(walletAddress); // Write wallet address to stdout
    return 0;
}

main();