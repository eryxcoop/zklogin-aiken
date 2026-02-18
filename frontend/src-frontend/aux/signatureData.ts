import {jwtDecode} from "jwt-decode";
import {base64urlToBigInt} from "./base64toBigInt.ts";

export default class SignatureData {
    private jwtString: string;

    constructor(jwtString: string) {
        this.jwtString = jwtString
    }

    jwt_header() {
        return this.jwtString.split(".")[0];
    }

    jwt_payload() {
        return this.jwtString.split(".")[1];
    }

    jwt_signature() {
        return this.jwtString.split(".")[2];
    }

    jwt_header_dot_payload() {
        return this.jwt_header() + "." + this.jwt_payload();
    }

    async verifySignatureCircuitInputs() {
        const headerDotPayloadBitArray = this.string_to_bit_array(this.jwt_header_dot_payload());
        const jwtHeaderDecoded = jwtDecode(this.jwt_header(), {header: true});
        const keyId = jwtHeaderDecoded.kid;
        const googlePublicKey = await this.fetchGoogleJWKS()
        const publicKey = googlePublicKey["keys"].find((candidateKey: object) => candidateKey["kid"] === keyId);
        const publicKeyModulusInBase64 = publicKey["n"];
        console.log("publicKeyModulusInBase64: ", publicKeyModulusInBase64)
        const publicKeyModulusAsBigInt = base64urlToBigInt(publicKeyModulusInBase64);
        const publicKeyExponentInBase64 = publicKey["e"];
        const publicKeyExponentAsBigInt = base64urlToBigInt(publicKeyExponentInBase64);
        const signatureAsBigint = base64urlToBigInt(this.jwt_signature());

        // hashed data. decimal
        const public_key_exponent_array = this.a_bigint_to_limbs(32, 64, publicKeyExponentAsBigInt);
        const signature_array = this.a_bigint_to_limbs(32, 64, signatureAsBigint);
        const public_key_modulus_array = this.a_bigint_to_limbs(32, 64, publicKeyModulusAsBigInt);
        return {
            "headerDotPayloadBitArray": headerDotPayloadBitArray,
            "public_key_exponent": public_key_exponent_array,
            "signature": signature_array,
            "public_key_modulus": public_key_modulus_array,
        };
    }

    // -------- AUX ------- //
    string_to_bit_array(number: string) {
        const encoder = new TextEncoder(); // UTF-8
        const bytes = encoder.encode(number);

        const bits = [];
        for (const byte of bytes) {
            for (let i = 7; i >= 0; i--) {
                bits.push((byte >> i) & 1);
            }
        }
        return bits;
    }

    a_bigint_to_limbs(amountOfLimbs: number, limbSizeInBits: number, bigint: bigint) {
        let mod = 1n;
        for (let idx = 0; idx < limbSizeInBits; idx++) {
            mod = mod * 2n;
        }

        let ret = [];
        let x_temp = bigint;
        for (let idx = 0; idx < amountOfLimbs; idx++) {
            ret.push(x_temp % mod);
            x_temp = x_temp / mod;
        }
        return ret;
    }

    // ------- FETCH GOOGLE KEYS ------- //
    async fetchGoogleJWKS() {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/certs");
        if (!res.ok) {
            throw new Error("Failed to fetch Google JWKS");
        }
        return res.json();
    }
}