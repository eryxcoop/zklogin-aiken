import {ZKLOGIN_ID} from "./transactionData";
import {deriveAddress} from "./deriveAddress";

const userWalletAddress = deriveAddress(ZKLOGIN_ID);

console.log(userWalletAddress);