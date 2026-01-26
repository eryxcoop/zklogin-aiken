import {decodeJwt} from "jose";
import {poseidonHash} from "./poseidon.ts";

const PACK_WIDTH = 248;
// const MAX_KEY_CLAIM_NAME_LENGTH = 32;
// const MAX_KEY_CLAIM_VALUE_LENGTH = 115;
// const MAX_AUD_VALUE_LENGTH = 145;

function bytesBEToBigInt(bytes: number[]): bigint {
    const hex = bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
    if (hex.length === 0) {
        return BigInt(0);
    }
    return BigInt('0x' + hex);
}

export function chunkArrayCustom<T>(array: T[], chunk_size: number): T[][] {
    const amountOfChunks = Math.ceil(array.length / chunk_size);
    const chunks = Array(amountOfChunks);
    for (let i = 0; i < chunks.length; i++) {
        chunks[i] = array.slice(i * chunk_size, (i + 1) * chunk_size);
    }
    return chunks;
}

// hashes an ASCII string to a field element
export function hashASCIIStrToField(str: string/*, maxSize: number*/) {
    // if (str.length > maxSize) {
    //     throw new Error(`String ${str} is longer than ${maxSize} chars`);
    // }

    const extendedLength = Math.trunc((str.length + 30) / 31) * 31;

    const strAscii = str
        .padEnd(extendedLength, String.fromCharCode(0))
        .split('')
        .map((c) => c.charCodeAt(0));

    console.log(str, strAscii)

    const chunkSize = PACK_WIDTH / 8;
    const chunks = chunkArrayCustom(strAscii, chunkSize);
    const packed = chunks.map((chunk) => bytesBEToBigInt(chunk));
    const hash = poseidonHash(packed);
    return hash;
}

export function computeZkLoginId(jwt: string, userSalt: string | bigint) {
    const decodedJWT = decodeJwt(jwt);
    if (!decodedJWT.sub || !decodedJWT.iss || !decodedJWT.aud) {
        throw new Error('Missing jwt data');
    }

    if (Array.isArray(decodedJWT.aud)) {
        throw new Error('Not supported aud. Aud is an array, string was expected.');
    }

    const zkLoginId = poseidonHash([
        hashASCIIStrToField(decodedJWT.iss),
        hashASCIIStrToField(decodedJWT.aud),
        hashASCIIStrToField(decodedJWT.sub),
        BigInt(userSalt)]);
    return zkLoginId.toString();
}