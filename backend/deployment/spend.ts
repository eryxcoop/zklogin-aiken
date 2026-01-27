import {
    BlockfrostProvider,
    mConStr0,
    MeshTxBuilder,
    MeshWallet,
    resolveSlotNo,
    serializePlutusScript,
    UTxO
} from "@meshsdk/core";
import {applyParamsToScript} from "@meshsdk/core-csl";
import blueprint from "../plutus.json";
import {
    PrivateKey,
    PublicKey,
    Transaction,
    Vkey,
    Vkeywitness,
    Vkeywitnesses,
} from "@emurgo/cardano-serialization-lib-nodejs";
import "dotenv/config";
import {blake2b} from "blakejs";
import {mZKRedeemer} from "./zk_redeemer";

export const AMOUNT_TO_SEND_TO_SCRIPT: string = (500 * 1000000).toString();

let blockfrostKey = process.env.BLOCKFROST_PROJECT_ID;
const blockchainProvider = new BlockfrostProvider(blockfrostKey);

function createDummyWallet() {
    return new MeshWallet({
        networkId: 0,
        fetcher: blockchainProvider,
        submitter: blockchainProvider,
        key: {
            type: "mnemonic",
            words: ["solution", "solution", "solution", "solution", "solution", "solution", "solution", "solution", "solution", "solution", "solution", "solution", "solution", "solution", "solution", "solution", "solution", "solution", "solution", "solution", "solution", "solution", "solution", "solution"],
        },
    });
}

export function getScript() {
    const scriptCbor = applyParamsToScript(
        blueprint.validators[0].compiledCode,
        [BigInt("14148750501214927097030011212605728027483349936086135333593501826084812421527")]
    );

    const scriptAddr = serializePlutusScript(
        {code: scriptCbor, version: "V3"},
    ).address;

    return {scriptCbor, scriptAddr};
}

// reusable function to get a transaction builder
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

async function main() {
    // Future parameters
    const max_epoch = 1769535438000;
    const eph_public_key_hex = "0f31c5411bbcb96fcdebec480c26511bf5eaaa055d2424c57c38e3c737d0580b";
    const eph_private_key_hex = "1e474cb19b4e9a86dd267b16d5afc5554fba4fa6277224c958c9d3be066a8a1d";

    const {scriptCbor, scriptAddr} = getScript();
    console.log("Enviando ADA al address ", scriptAddr)
    let dummyWallet = createDummyWallet();

    // --- Obtain public and private keys --- //

    const eph_private_key = PrivateKey.from_normal_bytes(Buffer.from(eph_private_key_hex, "hex"));

    const eph_public_key_bytes = Uint8Array.from(Buffer.from(eph_public_key_hex, "hex"));
    const eph_public_key = PublicKey.from_bytes(eph_public_key_bytes)

    const scriptUtxos = (await blockchainProvider.fetchAddressUTxOs(scriptAddr));
    const scriptUtxo = scriptUtxos.filter((utxo)=> utxo.output.amount[0].quantity == AMOUNT_TO_SEND_TO_SCRIPT)[0];
    console.log("scriptWithDatum: ",JSON.stringify(scriptUtxo, null, 2));

    let collaterals = await dummyWallet.getCollateral();
    const collateral = collaterals[0];

    let max_epoch_POSIX_time = new Date(max_epoch);
    console.log("max_epoch_POSIX_time", max_epoch_POSIX_time.getTime())
    const max_epoch_slot = resolveSlotNo('preview', max_epoch_POSIX_time.getTime());
    console.log("max_epoch_slot", max_epoch_slot)

    let redeemer = mConStr0([max_epoch, Buffer.from(eph_public_key_bytes).toString("hex")]);
    let zk_redeemer = mZKRedeemer(redeemer);

    const txBuilder = getTxBuilder();
    await txBuilder
        .spendingPlutusScript("V3")
        .txIn(
            scriptUtxo.input.txHash,
            scriptUtxo.input.outputIndex,
            scriptUtxo.output.amount,
            scriptUtxo.output.address
        )
        .txInScript(scriptCbor)
        .txInRedeemerValue(zk_redeemer)
        .txInInlineDatumPresent()
        .requiredSignerHash(
            Buffer.from(blake2b(eph_public_key_bytes, undefined, 28)).toString("hex")
        )
        .changeAddress(scriptAddr)
        .txInCollateral(
            collateral.input.txHash,
            collateral.input.outputIndex,
            collateral.output.amount,
            collateral.output.address
        )
        .invalidHereafter(Number(max_epoch_slot))
        .txOut("addr1wqrqca4ww7cwheu0aa7768a68v3rg9vv99ht8hms2yjdj3gs5l58f", [{
            unit: "lovelace",
            quantity: "1000000"
        }])
        .complete();

    // --- Sign transaction with dummy wallet for collateral --- //
    const partiallySigned = await dummyWallet.signTx(txBuilder.txHex, true);

    // --- Sign transaction with ephemeral private key --- //
    const unsignedTx = Transaction.from_bytes(
        Buffer.from(partiallySigned, "hex")
    );

    let txBody = unsignedTx.body();
    const bodyBytes = txBody.to_bytes();
    const txHash = blake2b(bodyBytes, undefined, 32);

    const signature = eph_private_key.sign(txHash);
    const vkey = Vkey.new(eph_public_key);
    const vkeyWitness = Vkeywitness.new(vkey, signature);

    const witnesses = unsignedTx.witness_set();
    const vkeys = witnesses.vkeys() ?? Vkeywitnesses.new();

    vkeys.add(vkeyWitness);

    witnesses.set_vkeys(vkeys);

    const signedTx = Transaction.new(
        txBody,
        witnesses,
        unsignedTx.auxiliary_data()
    );

    // console.log(signedTx.to_json());

    // --- Submit transaction --- //
    console.log("Se va a submitear la transaccion")
    const signedTxHex = signedTx.to_hex();
    const response = await dummyWallet.submitTx(signedTxHex);
    console.log("Tx hash:", response);
}



main()
