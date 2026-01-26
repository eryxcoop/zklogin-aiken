import type {PublicKey} from "@mysten/sui.js/cryptography";
import {toHEX} from "@mysten/bcs";
import { poseidonHash } from "./poseidon.ts";
import { toString as u8aToString } from "uint8arrays/to-string";

//const NONCE_LENGTH = 27;

export function toBigIntBE(bytes: Uint8Array) {
    const hex = toHEX(bytes);
    if (hex.length === 0) {
        return BigInt(0);
    }
    return BigInt(`0x${hex}`);
}


export function generateNonce(publicKey: PublicKey, maxEpoch: number, randomness: string) {
    const publicKeyBytes = toBigIntBE(publicKey.toRawBytes());
    const eph_public_key_high = publicKeyBytes / 2n ** 128n;
    const eph_public_key_low = publicKeyBytes % 2n ** 128n;
    const nonce = poseidonHash([BigInt(maxEpoch), BigInt(randomness), eph_public_key_high, eph_public_key_low]);
    // const Z = toBigEndianBytes(bigNum, 20);
    console.log("----------------- Nonce: ", nonce)
    console.log("----------------- pk_high: ", eph_public_key_high)
    console.log("----------------- pk_low: ", eph_public_key_low)
    console.log("----------------- max_ep: ", BigInt(maxEpoch))
    console.log("----------------- randomness: ", BigInt(randomness))
    return bigintToBase64_32(nonce);
    // return base64url.encode(nonce.toString());
}

function bigintToBase64_32(n: bigint) {
    if (n < 0n) throw new Error("negative");
    if (n >= (1n << 256n)) Error("overflow");

    const bytes = new Uint8Array(32);
    let x = n;

    for (let i = 31; i >= 0; i--) {
        bytes[i] = Number(x & 0xffn);
        x >>= 8n;
    }

    return u8aToString(bytes, "base64pad");
}