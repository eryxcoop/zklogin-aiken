import {jwtDecode} from "jwt-decode";
import {base64url} from "jose";

export function google_public_key() {
    return {
        "keys": [{
            "n": "u81qxSoubYoVt-J3VaJXxgsLQmyAXa9pnkxygDA59Z4WNhsfPfbXHlsAta3a-eikfRgswP-kzIhYoASDjH09AgpsnCVZXdjRp3VcZpQ7cm0KAmYniknOB3C56t2PuazYhmHjqwjYvuYbfP1lCzJRLCwsmM5vwJZTWiO_kDqTnPh7z0guZgrFe5xw2syKWxoi4TRXmCwffo-FsukYU4nNV19wDCccI6_hI2OWPWqG77tLV1RJnr_4xZPQDzk33qMOzCrIi0hlsk0ONs6CkOQ9YHLW8QXVabjTm6ojUp4cRRhVXUr_9FmrXJrc2Ws2sizhSqjrPzLFZBtKvZqueBmEYQ",
            "alg": "RS256",
            "use": "sig",
            "kty": "RSA",
            "kid": "c27ba40b09529ad4f16822ce83167c1bc3910122",
            "e": "AQAB"
        }, {
            "use": "sig",
            "alg": "RS256",
            "e": "AQAB",
            "kty": "RSA",
            "kid": "c816d337b8365a06a851ad80016c171099492609",
            "n": "upqfXMzThiSPdQfFN2--TPprv6IAPDAHoSA7S2fCr5DYJbG-CRomlIvtblCq_3_AU_Fk-BREd3yQtMBrT5w60bAmwYThBu0gdKCB0ApAXkHbVpmUvtTC6zBVcmentXkYN0TXME6RyDNPFXO6G28CUOenyLfQp9hmqF_lyfvRNpsptH_4uK70tZ6BSkobeBp3QrIYJs_qjhHfeSw9oisYFgz-w4yxfDrsezPmhuDd_VpmHZqEOkIE1OP0gOMz99e7e-bIiHHcGUQ19L0LSxirqht0z00dXFUFwBSeOOfrUJfA8n4o2IoFYPwNibOCK1FMl1ThfUVcZHpHEiC5yfPBfQ"
        }]
    }

}

function jwt() {
    return "eyJhbGciOiJSUzI1NiIsImtpZCI6ImMyN2JhNDBiMDk1MjlhZDRmMTY4MjJjZTgzMTY3YzFiYzM5MTAxMjIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI5MjA3MTkyMzA0MjEtbzZrdDUyMzVjczhwbTBic2ZkdGt0MGk1ZmxhN20wNzIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI5MjA3MTkyMzA0MjEtbzZrdDUyMzVjczhwbTBic2ZkdGt0MGk1ZmxhN20wNzIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDI1NjMxNzQzNTY1ODczMDA2MTgiLCJub25jZSI6IlRNM3loSzloT01KUDIvRkllWWJMZjZURHlGL2o2MkJFOUcrSVZpUTZUZkU9IiwibmJmIjoxNzcwNzUzMDQyLCJpYXQiOjE3NzA3NTMzNDIsImV4cCI6MTc3MDc1Njk0MiwianRpIjoiYWZmMWZmMDVhMTY4MDRkYzZkNzRmNzk5YTE1NDgyZDNlNTNhOTE2MCJ9.F7VTcpWo8U9Rn1jxtf59ZVSe07_7r1G-k4hNSj0lu2YPK9i_JTWg8kILqU_s73SqNgBh0YSEBUOmu3b8hVvf01qBMBtx9M7nZsH__ULjaCS7lbQ_Y9nQHKN_QYRMET2S5xTp4z2O7qLCw7YATvIwmu8uVfslXIinw4vjMMy7FWecH5anA_0MEdDhDpWREa2hKQEF27o3LBLYjT3zLbPJkaukfbj2Sfo9fdHGg8duD8Kor71ITPZ9dDAQXb1N5iYhyFysYpbGwGFK_EN6e0TY07u61JDmino-w3KMRYw9PEVvyhMZ2auwicku02N4pwq44nsVDy4ZmqGu0k7g4TV_qA"
}

export function jwt_header() {
    return jwt().split(".")[0];
}

function jwt_payload() {
    return jwt().split(".")[1];
}

export function jwt_signature() {
    return jwt().split(".")[2];
}

export function jwt_header_dot_payload() {
    return jwt_header() + "." + jwt_payload();
}

export function string_to_bit_array(string) {
    const encoder = new TextEncoder(); // UTF-8
    const bytes = encoder.encode(string);

    const bits = [];
    for (const byte of bytes) {
        for (let i = 7; i >= 0; i--) {
            bits.push((byte >> i) & 1);
        }
    }
    return bits;
}

function ephemeral_public_key() {
    return "94330401d8a0b43194ac06f7ae8f4258f5c31ba1fb298f2acba6360f2ebb4902";
}

function ephemeral_private_key() {
    return "67cc6ccf81d981a0cfde5214b9609a4c59aae94f775dd0cca5adcdd67396d267";
}

export function session_data() {
    return {
        "nonce": "34739653940406343420017127027297608784054948105845934869119037571030413102577",
        "eph_pk_high": "196990631791862443712883730551705387608",
        "eph_pk_low": "326673917313243123152262565065062566146",
        "max_epoch": 1770760522000,
        "rand": "140348283489804050251578078041461730362",
        "salt": "12345678901234567890",
        "zkLoginId": "21140065873708661981141523561235886173184262775540053915030560953831497869414",
        "iss_ascii": [104, 116, 116, 112, 115, 58, 47, 47, 97, 99, 99, 111, 117, 110, 116, 115, 46, 103, 111, 111, 103, 108, 101, 46, 99, 111, 109],
        "aud_ascii": [57, 50, 48, 55, 49, 57, 50, 51, 48, 52, 50, 49, 45, 111, 54, 107, 116, 53, 50, 51, 53, 99, 115, 56, 112, 109, 48, 98, 115, 102, 100, 116, 107, 116, 48, 105, 53, 102, 108, 97, 55, 109, 48, 55, 50, 46, 97, 112, 112, 115, 46, 103, 111, 111, 103, 108, 101, 117, 115, 101, 114, 99, 111, 110, 116, 101, 110, 116, 46, 99, 111, 109],
        "sub_ascii": [49, 48, 50, 53, 54, 51, 49, 55, 52, 51, 53, 54, 53, 56, 55, 51, 48, 48, 54, 49, 56],
        "jwt_payload_ascii": [123, 34, 105, 115, 115, 34, 58, 34, 104, 116, 116, 112, 115, 58, 47, 47, 97, 99, 99, 111, 117, 110, 116, 115, 46, 103, 111, 111, 103, 108, 101, 46, 99, 111, 109, 34, 44, 34, 97, 122, 112, 34, 58, 34, 57, 50, 48, 55, 49, 57, 50, 51, 48, 52, 50, 49, 45, 111, 54, 107, 116, 53, 50, 51, 53, 99, 115, 56, 112, 109, 48, 98, 115, 102, 100, 116, 107, 116, 48, 105, 53, 102, 108, 97, 55, 109, 48, 55, 50, 46, 97, 112, 112, 115, 46, 103, 111, 111, 103, 108, 101, 117, 115, 101, 114, 99, 111, 110, 116, 101, 110, 116, 46, 99, 111, 109, 34, 44, 34, 97, 117, 100, 34, 58, 34, 57, 50, 48, 55, 49, 57, 50, 51, 48, 52, 50, 49, 45, 111, 54, 107, 116, 53, 50, 51, 53, 99, 115, 56, 112, 109, 48, 98, 115, 102, 100, 116, 107, 116, 48, 105, 53, 102, 108, 97, 55, 109, 48, 55, 50, 46, 97, 112, 112, 115, 46, 103, 111, 111, 103, 108, 101, 117, 115, 101, 114, 99, 111, 110, 116, 101, 110, 116, 46, 99, 111, 109, 34, 44, 34, 115, 117, 98, 34, 58, 34, 49, 48, 50, 53, 54, 51, 49, 55, 52, 51, 53, 54, 53, 56, 55, 51, 48, 48, 54, 49, 56, 34, 44, 34, 110, 111, 110, 99, 101, 34, 58, 34, 84, 77, 51, 121, 104, 75, 57, 104, 79, 77, 74, 80, 50, 47, 70, 73, 101, 89, 98, 76, 102, 54, 84, 68, 121, 70, 47, 106, 54, 50, 66, 69, 57, 71, 43, 73, 86, 105, 81, 54, 84, 102, 69, 61, 34, 44, 34, 110, 98, 102, 34, 58, 49, 55, 55, 48, 55, 53, 51, 48, 52, 50, 44, 34, 105, 97, 116, 34, 58, 49, 55, 55, 48, 55, 53, 51, 51, 52, 50, 44, 34, 101, 120, 112, 34, 58, 49, 55, 55, 48, 55, 53, 54, 57, 52, 50, 44, 34, 106, 116, 105, 34, 58, 34, 97, 102, 102, 49, 102, 102, 48, 53, 97, 49, 54, 56, 48, 52, 100, 99, 54, 100, 55, 52, 102, 55, 57, 57, 97, 49, 53, 52, 56, 50, 100, 51, 101, 53, 51, 97, 57, 49, 54, 48, 34, 125],
        "nonce_ascii": [84, 77, 51, 121, 104, 75, 57, 104, 79, 77, 74, 80, 50, 47, 70, 73, 101, 89, 98, 76, 102, 54, 84, 68, 121, 70, 47, 106, 54, 50, 66, 69, 57, 71, 43, 73, 86, 105, 81, 54, 84, 102, 69, 61],
        "nonce_offset": 238,
        "iss_offset": 8,
        "aud_offset": 125,
        "sub_offset": 206
    };
}

export function a_bigint_to_limbs(amountOfLimbs, limbSizeInBits, bigint) {
    let mod = 1n;
    for (let idx = 0; idx < limbSizeInBits; idx++) {
        mod = mod * 2n;
    }

    let ret = [];
    var x_temp = bigint;
    for (let idx = 0; idx < amountOfLimbs; idx++) {
        ret.push(x_temp % mod);
        x_temp = x_temp / mod;
    }
    return ret;
}

function base64ToBigInt(numberEncodedInBase64) {
    const publicKeyModulusAsByteArray = base64url.decode(numberEncodedInBase64);
    const publicKeyModulusAsHex = Buffer.from(publicKeyModulusAsByteArray).toString('hex');
    return BigInt('0x' + publicKeyModulusAsHex);
}

export function verifySignatureCircuitInputs() {
    const headerDotPayloadBitArray = string_to_bit_array(jwt_header_dot_payload());
    const jwtHeaderDecoded = jwtDecode(jwt_header(), {header: true});
    const keyId = jwtHeaderDecoded.kid;
    const publicKey = google_public_key()["keys"].find((candidateKey) => candidateKey["kid"] === keyId);
    const publicKeyModulusInBase64 = publicKey["n"];
    const publicKeyModulusAsBigInt = base64ToBigInt(publicKeyModulusInBase64);
    const publicKeyExponentInBase64 = publicKey["e"];
    const publicKeyExponentAsBigInt = base64ToBigInt(publicKeyExponentInBase64);
    const signatureAsBigint = base64ToBigInt(jwt_signature());

    // hashed data. decimal
    let public_key_exponent_array = a_bigint_to_limbs(32, 64, publicKeyExponentAsBigInt);
    let signature_array = a_bigint_to_limbs(32, 64, signatureAsBigint);
    let public_key_modulus_array = a_bigint_to_limbs(32, 64, publicKeyModulusAsBigInt);
    return {
        "headerDotPayloadBitArray": headerDotPayloadBitArray,
        "public_key_exponent": public_key_exponent_array,
        "signature": signature_array,
        "public_key_modulus": public_key_modulus_array,
    };
}