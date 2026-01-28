pragma circom 2.2.3;
include "nonce.circom";
include "zkLoginId.circom";
include "feature_inclusion_in_jwt_payload.circom";

template ZkLogin(payloadSize, nonceSize, issSize, audSize, subSize) {
    // Public
    signal input eph_pk_high;
    signal input eph_pk_low;
    signal input zkLoginId;
    signal input max_epoch;

    //Private
    signal input rand;
    signal input nonce;
    signal input salt;
    signal input iss_ascii[issSize];
    signal input aud_ascii[audSize];
    signal input sub_ascii[subSize];

    // jwt parsing
    signal input jwt_payload_ascii[payloadSize];
    signal input nonce_ascii[nonceSize];
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
    parser.nonce <== nonce_ascii;

    // signature verification
    // signal input OIDP_pk;
    // signal input jwt_signature;

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
    decodedSignature == HASH*/
}

component main {public [eph_pk_high, eph_pk_low, zkLoginId, max_epoch]} = ZkLogin(384,44,27,72,21);

