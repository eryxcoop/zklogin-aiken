import {mConStr0, resolveSlotNo} from "@meshsdk/core";
import type {UTxO} from "@meshsdk/core";

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
import {mZKRedeemer} from "./zk_redeemer.ts";
import {blockchainProvider, getScriptBackend, getTxBuilder, networkFromBlockfrostKey, sponsorWallet} from "./common.ts"

const MAXIMUM_ASSUMED_FEE = 2000000

export async function transfer(
    destinationAddress,
    amount_to_spend,
    zkLoginId: bigint,
    ephemeralPublicKey,
    ephemeralPrivateKey,
    maxEpoch,
    zkProof
) {

    const {scriptCbor, scriptAddr} = getScriptBackend(zkLoginId);
    console.log("Sending ADA to address ", destinationAddress, " from address ", scriptAddr)

    // --- Obtain public and private keys --- //

    const eph_private_key = PrivateKey.from_normal_bytes(Buffer.from(ephemeralPrivateKey, "hex"));

    const eph_public_key_bytes = Uint8Array.from(Buffer.from(ephemeralPublicKey, "hex"));
    const eph_public_key = PublicKey.from_bytes(eph_public_key_bytes)

    const scriptUtxos = (await blockchainProvider.fetchAddressUTxOs(scriptAddr));
    const scriptUtxosWithDatum  = scriptUtxos.filter(
        (utxo)=> utxo.output.plutusData !== undefined && utxo.output.dataHash !== undefined );

    if (scriptUtxosWithDatum.length === 0) {
        throw Error("No UTxOs with datum found");
    }

    const inputScriptUTxOWithDatum = pickSourceUTxO(scriptUtxosWithDatum, amount_to_spend);

    let collaterals = await sponsorWallet.getCollateral();
    const collateral = collaterals[0];

    let max_epoch_POSIX_time = new Date(maxEpoch);
    const max_epoch_slot = resolveSlotNo(networkFromBlockfrostKey(), max_epoch_POSIX_time.getTime());

    let redeemer = mConStr0([maxEpoch, Buffer.from(eph_public_key_bytes).toString("hex")]);
    let zk_redeemer = mZKRedeemer(redeemer, zkProof);

    let return_quantity = (Number(inputScriptUTxOWithDatum.output.amount[0].quantity) - amount_to_spend - MAXIMUM_ASSUMED_FEE).toString();

    const txBuilder = getTxBuilder();
    await txBuilder
        .spendingPlutusScript("V3")
        .txIn(
            inputScriptUTxOWithDatum.input.txHash,
            inputScriptUTxOWithDatum.input.outputIndex,
            inputScriptUTxOWithDatum.output.amount,
            inputScriptUTxOWithDatum.output.address
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
        .txOut(destinationAddress, [{
            unit: "lovelace",
            quantity: amount_to_spend.toString()
        }])
        .txOutInlineDatumValue(mConStr0([]))
        .txOut(scriptAddr, [{
            unit: "lovelace",
            quantity: return_quantity,

        }])
        .txOutInlineDatumValue(mConStr0([]))
        .complete();

    // --- Sign transaction with dummy wallet for collateral --- //
    const partiallySigned = await sponsorWallet.signTx(txBuilder.txHex, true);

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

    // --- Submit transaction --- //
    console.log("The transaction is being submited")
    const signedTxHex = signedTx.to_hex();
    const response = await sponsorWallet.submitTx(signedTxHex);
    console.log("Tx hash:", response);

    return response;
}

const reminder = (utxo: UTxO, amountToSpend: number) => {
    return Number(utxo.output.amount[0].quantity) - amountToSpend - MAXIMUM_ASSUMED_FEE
}

// This utxo picking algorithm chooses the utxo with just enough funds to fulfill the transaction.
// If none exists, throws an error
function pickSourceUTxO(scriptUtxosWithDatum: UTxO[], amount: number) {
    const base = scriptUtxosWithDatum.find(utxo => reminder(utxo, amount) >= 0);
    if (base === undefined) {
        throw Error("There isn't a single UTxO with enough funds to spend this much ADA");
    }
    return scriptUtxosWithDatum.reduce((min: UTxO, current: UTxO) => {
        return (reminder(current, amount) >= 0 && (reminder(current, amount) < reminder(min, amount))) ? current : min
    }, base);
}

