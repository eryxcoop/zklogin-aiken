import {BlockfrostProvider, MeshTxBuilder, MeshWallet, serializePlutusScript, UTxO, Network} from "@meshsdk/core";
import {applyParamsToScript} from "@meshsdk/core-csl";
import blueprint from "../plutus.json";
import { ZKLOGIN_ID } from "./transactionData";
import "dotenv/config";
import {SPONSOR_WALLET_SK} from "./sponsorWalletCredentials";

const blockfrostKey = process.env.BLOCKFROST_PROJECT_ID;
export const blockchainProvider = new BlockfrostProvider(blockfrostKey);

export function networkFromBlockfrostKey(): Network{
    if (blockfrostKey.startsWith("mainnet")) return "mainnet";
    if (blockfrostKey.startsWith("preprod")) return "preprod";
    if (blockfrostKey.startsWith("preview")) return "preview";
}

export function getScript() {
    const scriptCbor = applyParamsToScript(
        blueprint.validators[0].compiledCode,
        [ZKLOGIN_ID]
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

async function getUtxoByTxHashAndAddress(blockchainProvider: BlockfrostProvider, txHash: string, address: string): Promise<UTxO> {
    const utxos = await blockchainProvider.fetchUTxOs(txHash);

    const matchingUtxos = utxos.filter((utxo) => utxo.output.address === address);

    if (matchingUtxos.length === 0) {
        throw new Error(`UTxO not found for address: ${address}`);
    }

    return matchingUtxos[0];
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