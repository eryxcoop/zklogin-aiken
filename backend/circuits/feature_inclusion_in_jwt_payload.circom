pragma circom 2.2.3;

include "slice.circom";
include "../node_modules/circomlib/circuits/bitify.circom";

template FeatureInclusionInJwtPayload(payloadSize, nonceSize, issSize, audSize, subSize) {

    signal input payload[payloadSize];

    // ------------- SUB ----------- //

    signal input subOffset;
    signal input sub[subSize];

    component subExtract = SliceFixed(payloadSize, subSize);
    subExtract.offset <== subOffset;
    subExtract.in <== payload;
    sub === subExtract.out;

    // ------------- AUD ----------- //
    signal input audOffset;
    signal input aud[audSize];

    component audExtract = SliceFixed(payloadSize, audSize);
    audExtract.offset <== audOffset;
    audExtract.in <== payload;
    aud === audExtract.out;

    // ------------- ISS ----------- //
    signal input issOffset;
    signal input iss[issSize];

    component issExtract = SliceFixed(payloadSize, issSize);
    issExtract.offset <== issOffset;
    issExtract.in <== payload;
    iss === issExtract.out;

    // ------------- nonce ----------- //
    signal input nonceOffset;
    signal input nonce[nonceSize];

    component nonceExtract = SliceFixed(payloadSize, nonceSize);
    nonceExtract.offset <== nonceOffset;
    nonceExtract.in <== payload;
    nonce === nonceExtract.out;
}

//component main = FeatureInclusionInJwtPayload(439, 27, 21, 72);