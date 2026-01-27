import {AMOUNT_TO_SEND_TO_SCRIPT, getScript, getTxBuilder} from "./spend";
import {BlockfrostProvider, mConStr0, MeshWallet} from "@meshsdk/core";

let blockfrostKey = process.env.BLOCKFROST_PROJECT_ID;
const blockchainProvider = new BlockfrostProvider(blockfrostKey);

async function lockTxWithDatum() {
    const {scriptAddr} = getScript();

    const wallet = new MeshWallet({
        networkId: 0,
        fetcher: blockchainProvider,
        submitter: blockchainProvider,
        key: {
            type: "root",
            bech32: "xprv1dzs5hhar28g9npexd9jchdv28scvsv7pgcwjjlrk3mwd75svvexq34q43upfat3l6lugea6w29yw2q5lmz4efm5s9jp3u9ljeq8zjv92nyx63ysjtxagtrw8lt4js7pxeteqcystyvx9hcwvred95aggdyss3t6r"
        },
    });

    const lockTxBuilder = getTxBuilder();
    const unsignedTx = await lockTxBuilder
        .txOut(scriptAddr, [{
            unit: "lovelace",
            quantity: AMOUNT_TO_SEND_TO_SCRIPT
        }])
        .txOutInlineDatumValue(mConStr0([]))
        .changeAddress("addr_test1qqd3yru5fdy97ascnrae2dtaxk03t9j2zumcv25x6fzze2fqqtlgdr0qadpj9jjt9sn8kyl475npqj4x770879fc5sss0yjd36")
        .selectUtxosFrom(await wallet.getUtxos())
        .complete();

    const signedTx = await wallet.signTx(unsignedTx);
    const deployedTxHash = await wallet.submitTx(signedTx);

    console.log(`1 tADA locked into the contract at Tx ID: ${deployedTxHash}`);
}

lockTxWithDatum()