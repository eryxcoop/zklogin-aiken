import {mConStr0, MeshWallet, resolveSlotNo} from "@meshsdk/core";

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
import {sponsorWallet, blockchainProvider, getScript, getTxBuilder} from "./common"
import {MAX_EPOCH, EPH_PUBLIC_KEY_HEX, EPH_PRIVATE_KEY_HEX} from "./transactionData"

async function main() {

    const {scriptCbor, scriptAddr} = getScript();
    console.log("Sending ADA to address ", scriptAddr)

    // --- Obtain public and private keys --- //

    const eph_private_key = PrivateKey.from_normal_bytes(Buffer.from(EPH_PRIVATE_KEY_HEX, "hex"));

    const eph_public_key_bytes = Uint8Array.from(Buffer.from(EPH_PUBLIC_KEY_HEX, "hex"));
    const eph_public_key = PublicKey.from_bytes(eph_public_key_bytes)

    const scriptUtxos = (await blockchainProvider.fetchAddressUTxOs(scriptAddr));
    const scriptUtxosWithDatum  = scriptUtxos.filter(
        (utxo)=> utxo.output.plutusData !== undefined && utxo.output.dataHash !== undefined );

    if (scriptUtxosWithDatum.length === 0) {
        console.error("No UTxOs with datum found");
        return 1;
    }

    const inputScriptUTxOWithDatum = scriptUtxosWithDatum[0];
    // console.log("inputScriptUTxOWithDatum: ",JSON.stringify(inputScriptUTxOWithDatum, null, 2));

    let collaterals = await sponsorWallet.getCollateral();
    const collateral = collaterals[0];

    let max_epoch_POSIX_time = new Date(MAX_EPOCH);
    // console.log("max_epoch_POSIX_time", max_epoch_POSIX_time.getTime())
    const max_epoch_slot = resolveSlotNo('preview', max_epoch_POSIX_time.getTime());
    // console.log("max_epoch_slot", max_epoch_slot)

    let redeemer = mConStr0([MAX_EPOCH, Buffer.from(eph_public_key_bytes).toString("hex")]);
    let zk_redeemer = mZKRedeemer(redeemer);

    let amount_to_spend = 1000000
    let fee_cap = 2000000
    let return_quantity = (Number(inputScriptUTxOWithDatum.output.amount[0].quantity) - amount_to_spend - fee_cap).toString();

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
        .txOut(scriptAddr, [{
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

    // console.log(signedTx.to_json());

    // --- Submit transaction --- //
    console.log("The transaction is being submited")
    const signedTxHex = signedTx.to_hex();
    const response = await sponsorWallet.submitTx(signedTxHex);
    console.log("Tx hash:", response);
}

main()
