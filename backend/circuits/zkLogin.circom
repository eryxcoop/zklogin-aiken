pragma circom 2.2.3;
include "nonce.circom";
include "zkLoginId.circom";
include "feature_inclusion_in_jwt_payload.circom";

// JWT que es una tira de bits. Se interpreta en ascii. Entonces es una array de 8bits
template ZkLogin(payloadSize, nonceSize, issSize, audSize, subSize) {
    // Public
    signal input eph_pk_high;
    signal input eph_pk_low;
    signal input zkLoginId;
    signal input max_epoch;

    //Private
    signal input rand;
    signal input salt;
    // opcionales
    signal input iss_ascii[issSize];
    signal input aud_ascii[audSize];
    signal input sub_ascii[subSize];

    signal input nonce; // podrías no pasarlo

    // jwt parsing
    //signal input jwt_ascii
    // extraer payload_ascii
    signal input jwt_payload_ascii[payloadSize];
    signal input nonce_ascii[nonceSize];
    // opcionales, solo con el size alcanza y sabiendo el órden
    signal input iss_offset;
    signal input aud_offset;
    signal input sub_offset;
    signal input nonce_offset;
    component parser = FeatureInclusionInJwtPayload(payloadSize, nonceSize, issSize, audSize, subSize);
    parser.payload <== jwt_payload_ascii;
    parser.subOffset <== sub_offset;
    parser.sub <== sub_ascii;
    parser.audOffset <== aud_offset;
    parser.aud <== aud_ascii;
    parser.issOffset <== iss_offset;
    parser.iss <== iss_ascii;
    parser.nonceOffset <== nonce_offset;
    // podría ser un output en array de 8bits ascii "nonce":"xY9a"
    // parser.nonce === "xY9a" === [8bits] === [x, Y, 9, a,] === [01111000, ...] === [78, ...]
    parser.nonce <== nonce_ascii;

    // signature verification
    // signal input OIDP_pk;
    // signal input jwt_signature;
    // agarrar jwt extraer la parte header.payload en [8bit]
    // transformar [8bit] a [bit]

    // zkLoginId derivation check
    component id_derivation = ZkLoginIdAscii(audSize, issSize, subSize);
    id_derivation.iss_ascii <== iss_ascii;
    id_derivation.aud_ascii <== aud_ascii;
    id_derivation.sub_ascii <== sub_ascii;
    id_derivation.salt <== salt;
    zkLoginId === id_derivation.zkLoginId;

    // nonce derivation check
    component nonce_derivation = Nonce();
    nonce_derivation.eph_pk_high <== eph_pk_high;
    nonce_derivation.eph_pk_low <== eph_pk_low;
    nonce_derivation.randomness <== rand;
    nonce_derivation.max_epoch <== max_epoch;
    // parser.nonce en ascii "xY9a" === [78, ...]
    // paso 1: "xY9a" a base64. Si leo "x" en ascii (78)(01111000) entonces escribo "x" en base64 (49)(110001) y así. [49, 24, ...]
    // paso 2: [49, 24, 61, 26] en 1 sola signal. 2^6*(2^6*(2^6*(49)+ 24)+61)+26 = nonce_bigint (1 signal)
    // paso 3: chequear que nonce_bigint = Poseidon("...")
    nonce_derivation.nonce === nonce;
}

template checkJwtSignature(headerSize, payloadSize, signatureSize) {
    signal jwt_header_dot_payload;
    signal jwt_signature;
    signal input OIDC_provider_pk;

    var headerDotPayloadSize = headerSize + 1 + payloadSize;
    var jwtSize = headerDotPayloadSize + 1 + signatureSize;

    component jwt_header_dot_payloadExtract = SliceFixed(jwtSize, headerDotPayloadSize);
    jwt_header_dot_payloadExtract.in <== jwt;
    jwt_header_dot_payloadExtract.offset <== 0;
    jwt_header_dot_payload <== jwt_header_dot_payloadExtract.out;


    /*Verificar firma jwt(jwt, pubkey)
    HeaderB4url
    PayloadB64url
    pubkey
    Firma: base64url
    sha256(HeaderB64url.PayloadB64.url) = HASH
    decrypt(pubkey, signatureB64url) = decodedSignature
    decodedSignature === HASH*/
}

component main {public [eph_pk_high, eph_pk_low, zkLoginId, max_epoch]} = ZkLogin(384,44,27,72,21);

