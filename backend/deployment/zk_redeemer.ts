import type {MConStr, Data} from "@meshsdk/common";
import {mConStr0} from "@meshsdk/core";
type Proof = MConStr<any, string[]>;
type ZKRedeemer = MConStr<any, Data[] | Proof[]>;
function mProof(piA: string, piB: string, piC: string): Proof {
    if (piA.length != 96 || piB.length != 192 || piC.length != 96) {
        throw new Error("Wrong proof");
    }
    return mConStr0([piA, piB, piC]);
}
export function mZKRedeemer(redeemer: Data, piA: string, piB: string, piC: string): ZKRedeemer {
    return mConStr0([redeemer, proofs(piA, piB, piC)]);
}
function proofs(piA: string, piB: string, piC: string): Proof[] {
    return [
        mProof(piA, piB, piC),
    ];
}