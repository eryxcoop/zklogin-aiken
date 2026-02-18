import {base64url} from "jose";

export function base64ToBigInt(base64: string) {

    const binary = atob(base64);

    let result = 0n;
    for (let i = 0; i < binary.length; i++) {
        result = (result << 8n) + BigInt(binary.charCodeAt(i));
    }

    return result;
}

export function base64urlToBigInt(b64url: string): bigint {
    const bytes = base64url.decode(b64url); // Uint8Array

    let result = 0n;
    for (let i = 0; i < bytes.length; i++) {
        result = (result << 8n) + BigInt(bytes[i]);
    }

    return result;
}