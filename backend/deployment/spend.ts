import {
    Lucid, Blockfrost, Constr, Data, CML,
} from "@lucid-evolution/lucid";
import type {LucidEvolution, SpendingValidator, UTxO} from "@lucid-evolution/lucid";
import {blake2b} from "blakejs";
import {getScriptBackend} from "./common.ts";
import {SPONSOR_WALLET_SK, SPONSOR_WALLET_ADDR} from "./sponsorWalletCredentials.ts";
import "dotenv/config";

// Derive sponsor payment signing key (ed25519) from xprv root key
function deriveSponsorSigningKey(): string {
    const rootKey = CML.Bip32PrivateKey.from_bech32(SPONSOR_WALLET_SK);
    const accountKey = rootKey
        .derive(0x80000000 + 1852)
        .derive(0x80000000 + 1815)
        .derive(0x80000000 + 0);
    return accountKey.derive(0).derive(0).to_raw_key().to_bech32();
}

const sponsorSigningKey = deriveSponsorSigningKey();

let lucidInstance: LucidEvolution | null = null;

async function getLucid(): Promise<LucidEvolution> {
    if (!lucidInstance) {
        const blockfrostKey = process.env.BLOCKFROST_PROJECT_ID;
        if (!blockfrostKey) throw new Error("BLOCKFROST_PROJECT_ID is not set");
        lucidInstance = await Lucid(
            new Blockfrost("https://cardano-preview.blockfrost.io/api/v0", blockfrostKey),
            "Preview"
        );
        lucidInstance.selectWallet.fromAddress(SPONSOR_WALLET_ADDR, []);
    }
    return lucidInstance;
}

function getScriptBackendLucid(zkLoginId: bigint) {
    // Reuse MeshJS's script parameterization to ensure the same CBOR/address
    const {scriptCbor, scriptAddr} = getScriptBackend(zkLoginId);

    const validator: SpendingValidator = {
        type: "PlutusV3",
        script: scriptCbor,
    };

    return {validator, scriptAddr};
}

export async function transfer(
    destinationAddress,
    amount_to_spend,
    zkLoginId: bigint,
    ephemeralPublicKey,
    ephemeralPrivateKey,
    maxEpoch,
    zkProof
) {
    const lucid = await getLucid();
    const {validator, scriptAddr} = getScriptBackendLucid(zkLoginId);

    console.log("Sending ADA to address ", destinationAddress, " from address ", scriptAddr);

    // --- Fetch ALL UTxOs at script address (no datum filter needed with V3!) --- //
    const scriptUtxos = await lucid.utxosAt(scriptAddr);
    if (scriptUtxos.length === 0) {
        throw Error("No UTxOs found at script address");
    }

    // --- Ephemeral key handling --- //
    const ephPubKeyBytes = Uint8Array.from(Buffer.from(ephemeralPublicKey, "hex"));
    const ephPubKeyHash = Buffer.from(blake2b(ephPubKeyBytes, undefined, 28)).toString("hex");

    const ephPrivKey = CML.PrivateKey.from_normal_bytes(Buffer.from(ephemeralPrivateKey, "hex"));
    const ephPrivKeyBech32 = ephPrivKey.to_bech32();

    // --- Build redeemer (same structure as before: Constr0[Constr0[maxEpoch, pubKeyHex], [Constr0[piA, piB, piC]]]) --- //
    const innerRedeemer = new Constr(0, [BigInt(maxEpoch), ephemeralPublicKey]);
    const proof = new Constr(0, [zkProof.piA, zkProof.piB, zkProof.piC]);
    const zkRedeemer = new Constr(0, [innerRedeemer, [proof]]);
    const redeemer = Data.to(zkRedeemer);

    // --- Max epoch to POSIX time for transaction validity --- //
    const maxEpochPosixTime = new Date(maxEpoch).getTime();

    // --- Build transaction --- //
    const tx = await lucid
        .newTx()
        .collectFrom(scriptUtxos, redeemer)
        .attach.SpendingValidator(validator)
        .addSignerKey(ephPubKeyHash)
        .pay.ToAddress(
            destinationAddress,
            {lovelace: BigInt(amount_to_spend)}
        )
        .validTo(maxEpochPosixTime)
        .complete({changeAddress: scriptAddr});

    // --- Sign with sponsor wallet (collateral) and ephemeral key (required signer) --- //
    const signedTx = await tx
        .sign.withPrivateKey(sponsorSigningKey)
        .sign.withPrivateKey(ephPrivKeyBech32)
        .complete();

    // --- Submit transaction --- //
    console.log("The transaction is being submitted");
    const txHash = await signedTx.submit();
    console.log("Tx hash:", txHash);

    return txHash;
}
