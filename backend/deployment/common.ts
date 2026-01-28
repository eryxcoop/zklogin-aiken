import {BlockfrostProvider, MeshTxBuilder, MeshWallet, serializePlutusScript, UTxO} from "@meshsdk/core";
import {applyParamsToScript} from "@meshsdk/core-csl";
import blueprint from "../plutus.json";
import { ZKLOGIN_ID } from "./transactionData";
import "dotenv/config";

const blockfrostKey = process.env.BLOCKFROST_PROJECT_ID;
export const blockchainProvider = new BlockfrostProvider(blockfrostKey);

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
        bech32: "xprv1dzs5hhar28g9npexd9jchdv28scvsv7pgcwjjlrk3mwd75svvexq34q43upfat3l6lugea6w29yw2q5lmz4efm5s9jp3u9ljeq8zjv92nyx63ysjtxagtrw8lt4js7pxeteqcystyvx9hcwvred95aggdyss3t6r"
    },
});