export const BUILD_ZKLOGIN_SIGNATURE = `async function lockTxWithDatum() {
    const {scriptAddr} = getScript();
    const lockTxBuilder = getTxBuilder();
    const unsignedTx = await lockTxBuilder
        .txOut(scriptAddr, [{
            unit: "lovelace",
            quantity: LOVELACE_TO_SEND_TO_SCRIPT
        }])
        .txOutInlineDatumValue(mConStr0([]))
        .changeAddress(SPONSOR_WALLET_ADDR)
        .selectUtxosFrom(await sponsorWallet.getUtxos())
        .complete();
    const signedTx = await sponsorWallet.signTx(unsignedTx);
    const deployedTxHash = await sponsorWallet.submitTx(signedTx);
}
`

export const AXIOS_ZKPROOF = `const zkProofResult = await axios.post(
  "https://prover-dev.mystenlabs.com/v1",
  {
    jwt: oauthParams?.id_token as string,
    extendedEphemeralPublicKey: extendedEphemeralPublicKey,
    maxEpoch: maxEpoch,
    jwtRandomness: randomness,
    salt: userSalt,
    keyClaimName: "sub",
  },
  {
    headers: {
      "Content-Type": "application/json",
    },
  }
).data;

const partialZkLoginSignature = zkProofResult as PartialZkLoginSignature
`

export const GENERATE_NONCE = `import { generateNonce } from "@mysten/zklogin";

 // Generate Nonce for acquiring JWT:
 const nonce = generateNonce(
   ephemeralKeyPair.getPublicKey(),
   maxEpoch,
   randomness
 );`