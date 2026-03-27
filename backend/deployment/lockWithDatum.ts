import {ADA_TO_SEND_TO_SCRIPT, LOVELACE_TO_SEND_TO_SCRIPT} from "./transactionData.ts";
import {getTxBuilder, sponsorWallet} from "./common.ts"
import "dotenv/config";
import {SPONSOR_WALLET_ADDR} from "./sponsorWalletCredentials.ts";

export async function lockTxWithDatum(scriptAddr) {
    const lockTxBuilder = getTxBuilder();
    const unsignedTx = await lockTxBuilder
        .txOut(scriptAddr, [{
            unit: "lovelace",
            quantity: LOVELACE_TO_SEND_TO_SCRIPT
        }])
        .changeAddress(SPONSOR_WALLET_ADDR)
        .selectUtxosFrom(await sponsorWallet.getUtxos())
        .complete();
    const signedTx = await sponsorWallet.signTx(unsignedTx);
    const deployedTxHash = await sponsorWallet.submitTx(signedTx);
    console.log(`${ADA_TO_SEND_TO_SCRIPT} tADA locked into the contract at Tx ID: ${deployedTxHash}`);
    return deployedTxHash;
}