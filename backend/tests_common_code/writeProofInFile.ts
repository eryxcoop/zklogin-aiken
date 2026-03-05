import * as fss from "node:fs";

export function writeProofInFile(requestedProofFile) {
    const PROOF_CONTENT_EXAMPLE = {
        "piA": "aabc97767174918c50d8579b7ea849c10ce732b8238152e403801270ce84ddbe577f1d2e5a48e515df2b050f050a77dd",
        "piB": "b406e9c9582d7eef49845a18e154ee02696c79b1188f2f04a75d8cdd901a65748d2f4e560113545b444721cbfaa2afbc036ff780dccdc4c323ccd99aabcda8fa8f184d6462ce200a24050e36e4e40fd1c1e9b22d1b8f5483f295cafbcfb25b64",
        "piC": "a3df9d021c5dd29547d5fc91007c6033c9d64553ac0286c9bf91bac86ea7eb51f135de24ddf201cead325044c8d55067",
    }
    fss.writeFileSync(requestedProofFile, JSON.stringify(PROOF_CONTENT_EXAMPLE), 'utf8');
}