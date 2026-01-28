import {AMOUNT_TO_SEND_TO_SCRIPT} from "./transactionData";
import {getScript, getTxBuilder, sponsorWallet} from "./common"
import {mConStr0} from "@meshsdk/core";
import "dotenv/config";

async function lockTxWithDatum() {
    const {scriptAddr} = getScript();
    const lockTxBuilder = getTxBuilder();
    const unsignedTx = await lockTxBuilder
        .txOut(scriptAddr, [{
            unit: "lovelace",
            quantity: AMOUNT_TO_SEND_TO_SCRIPT
        }])
        .txOutInlineDatumValue(mConStr0([]))
        .changeAddress("addr_test1qqd3yru5fdy97ascnrae2dtaxk03t9j2zumcv25x6fzze2fqqtlgdr0qadpj9jjt9sn8kyl475npqj4x770879fc5sss0yjd36")
        .selectUtxosFrom(await sponsorWallet.getUtxos())
        .complete();
    const signedTx = await sponsorWallet.signTx(unsignedTx);
    const deployedTxHash = await sponsorWallet.submitTx(signedTx);

    console.log(`${AMOUNT_TO_SEND_TO_SCRIPT} tADA locked into the contract at Tx ID: ${deployedTxHash}`);
}

lockTxWithDatum()