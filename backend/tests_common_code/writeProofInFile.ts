import * as fss from "node:fs";

export function writeProofInFile(requestedProofFile) {
    const PROOF_CONTENT_EXAMPLE = "import {MConStr} from \"@meshsdk/common\";\n" +
        "import {Data, mConStr0} from \"@meshsdk/core\";\n" +
        "\n" +
        "type Proof = MConStr<any, string[]>;\n" +
        "\n" +
        "type ZKRedeemer = MConStr<any, Data[] | Proof[]>;\n" +
        "\n" +
        "function mProof(piA: string, piB: string, piC: string): Proof {\n" +
        "    if (piA.length != 96 || piB.length != 192 || piC.length != 96) {\n" +
        "        throw new Error(\"Wrong proof\");\n" +
        "    }\n" +
        "\n" +
        "    return mConStr0([piA, piB, piC]);\n" +
        "}\n" +
        "\n" +
        "export function mZKRedeemer(redeemer: Data): ZKRedeemer {\n" +
        "    return mConStr0([redeemer, proofs()]);\n" +
        "}\n" +
        "\n" +
        "function proofs(): Proof[] {\n" +
        "    return [\n" +
        "\t\tmProof(\n" +
        "\t\t\t\"aabc97767174918c50d8579b7ea849c10ce732b8238152e403801270ce84ddbe577f1d2e5a48e515df2b050f050a77dd\",\n" +
        "\t\t\t\"b406e9c9582d7eef49845a18e154ee02696c79b1188f2f04a75d8cdd901a65748d2f4e560113545b444721cbfaa2afbc036ff780dccdc4c323ccd99aabcda8fa8f184d6462ce200a24050e36e4e40fd1c1e9b22d1b8f5483f295cafbcfb25b64\",\n" +
        "\t\t\t\"a3df9d021c5dd29547d5fc91007c6033c9d64553ac0286c9bf91bac86ea7eb51f135de24ddf201cead325044c8d55067\",\n" +
        "\t\t),\n" +
        "    ];\n" +
        "}\n"
    fss.writeFileSync(requestedProofFile, PROOF_CONTENT_EXAMPLE, 'utf8');
}