pragma circom 2.2.3;
include "../node_modules/circomlib/circuits/sha256/sha256.circom";
include "./rsa_verify.circom";
include "./converter_256_bits_to_n_field_elements.circom";

template verifySignatureIsValidForHeaderDotPayload(headerDotPayloadBitArraySize) {
    // The modulus is expressed as an array of numbers.
    // The size of the array is the number of limbs.
    // Each element of the array is a number that has at most 64 bits
    // So the modulus is a number that can be expressed in 32 * 64 = 2048 bits
    var modulusAmountOfLimbs = 32;
    var sizeOfLimbsInBits = 64;
    var amountOfBitsOfExponent = 17;
    signal input headerDotPayloadBitArray[headerDotPayloadBitArraySize]; // [0, 1, 0, ... 0, 1]
    signal input signature[modulusAmountOfLimbs];
    signal input public_key_modulus[modulusAmountOfLimbs];
    signal input public_key_exponent[modulusAmountOfLimbs];

    component sha = Sha256(headerDotPayloadBitArraySize);

    sha.in <== headerDotPayloadBitArray;

    signal hashOfHeaderDotPayload[256];

    hashOfHeaderDotPayload <== sha.out;

    var hashOfHeaderDotPayloadAmountOfLimbs = 4;
    component converter = Converter256BitsToNFieldElements(hashOfHeaderDotPayloadAmountOfLimbs);
    converter.inputBits <== hashOfHeaderDotPayload;

    // RsaVerifyPkcs1v15(w, nb, e_bits, hashLen)
    component rsaVerify = RsaVerifyPkcs1v15(sizeOfLimbsInBits, modulusAmountOfLimbs, amountOfBitsOfExponent, hashOfHeaderDotPayloadAmountOfLimbs);
    rsaVerify.exp <== public_key_exponent;
    rsaVerify.sign <== signature;
    rsaVerify.modulus <== public_key_modulus;

    // Here we convert from little indian to big indian
    rsaVerify.hashed[0] <== converter.outputLimbs[3];
    rsaVerify.hashed[1] <== converter.outputLimbs[2];
    rsaVerify.hashed[2] <== converter.outputLimbs[1];
    rsaVerify.hashed[3] <== converter.outputLimbs[0];
}

component main = verifySignatureIsValidForHeaderDotPayload(1024);