import {BlockfrostProvider, MeshTxBuilder, MeshWallet, serializePlutusScript} from "@meshsdk/core";
import {applyParamsToScript} from "@meshsdk/core-csl";
import blueprint from "../plutus.json" with {type: "json"};
import "dotenv/config";
import {SPONSOR_WALLET_SK} from "./sponsorWalletCredentials.ts";

export type Network = 'preview' | 'preprod';

export function getBlockfrostKey(network: Network): string {
    const envVar = network === 'preview' ? 'BLOCKFROST_PROJECT_ID_PREVIEW' : 'BLOCKFROST_PROJECT_ID_PREPROD';
    const key = process.env[envVar];
    if (!key) throw new Error(`${envVar} is not set. Check that you have set it in your .env file`);
    return key;
}

export function getScriptBackend(zkLoginId: bigint) {
    const scriptCbor = applyParamsToScript(
        blueprint.validators[0].compiledCode,
        [zkLoginId]
    );

    const scriptAddr = serializePlutusScript(
        {code: scriptCbor, version: "V3"},
    ).address;

    return {scriptCbor, scriptAddr};
}

export function getTxBuilder(network: Network) {
    const provider = new BlockfrostProvider(getBlockfrostKey(network));
    return new MeshTxBuilder({
        fetcher: provider,
        submitter: provider,
    });
}

export function getSponsorWallet(network: Network) {
    const provider = new BlockfrostProvider(getBlockfrostKey(network));
    return new MeshWallet({
        networkId: 0,
        fetcher: provider,
        submitter: provider,
        key: {
            type: "root",
            bech32: SPONSOR_WALLET_SK
        },
    });
}
