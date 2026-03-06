import type {Network, UTxO} from "@meshsdk/core";
import {BlockfrostProvider, MeshTxBuilder, MeshWallet, serializePlutusScript} from "@meshsdk/core";
import {applyParamsToScript} from "@meshsdk/core-csl";
import blueprint from "../plutus.json" with {type: "json"};
import "dotenv/config";
import {SPONSOR_WALLET_SK} from "./sponsorWalletCredentials.ts";

const blockfrostKey = process.env.BLOCKFROST_PROJECT_ID;
if (!blockfrostKey) throw new Error("BLOCKFROST_PROJECT_ID is not set. Check that you have set it in your .env file");
export const blockchainProvider = new BlockfrostProvider(blockfrostKey);

export function networkFromBlockfrostKey(): Network{
    if (blockfrostKey.startsWith("mainnet")) return "mainnet";
    if (blockfrostKey.startsWith("preprod")) return "preprod";
    if (blockfrostKey.startsWith("preview")) return "preview";
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

export function getTxBuilder() {
    return new MeshTxBuilder({
        fetcher: blockchainProvider,
        submitter: blockchainProvider,
    });
}

export const sponsorWallet = new MeshWallet({
    networkId: 0,
    fetcher: blockchainProvider,
    submitter: blockchainProvider,
    key: {
        type: "root",
        bech32: SPONSOR_WALLET_SK
    },
});
