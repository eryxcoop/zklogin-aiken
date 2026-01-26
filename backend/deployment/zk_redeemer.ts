import {MConStr} from "@meshsdk/common";
import {Data, mConStr0} from "@meshsdk/core";

type Proof = MConStr<any, string[]>;

type ZKRedeemer = MConStr<any, Data[] | Proof[]>;

function mProof(piA: string, piB: string, piC: string): Proof {
    if (piA.length != 96 || piB.length != 192 || piC.length != 96) {
        throw new Error("Wrong proof");
    }

    return mConStr0([piA, piB, piC]);
}

export function mZKRedeemer(redeemer: Data): ZKRedeemer {
    return mConStr0([redeemer, proofs()]);
}

function proofs(): Proof[] {
    return [
		mProof(
            "af0edcd733271e1585d02fe9748a041cb822324639928e879242b7f43c2e2dda89dc5cae4ae702a04d33a9057ce5d8b5",
        "99443c9347f13641671ede901896c7f50143699860411be24cd5064256c2e7cda176f6486503235aa4dcea2347c94bb219ab9d6c37167cbaf25593be17831aa6d671071bdc707acdb12b422bfcdbe26c9fc44ab0062f98a2d9dd1b275fc69895",
        "8d6dd46b5f2553f2bc61dfcb6cbfbc63b6e5d45df0d7456ac9b30bb21429c9e2f6d89b4e075a7692edcdd3f40e3dd38b",
		),
    ];
}
