pragma circom 2.2.3;
include "../node_modules/circomlib/circuits/sha256/sha256.circom";
include "./rsa_verify.circom";
include "./converter_256_bits_to_n_field_elements.circom";

template xxx() {
    signal input headerDotPayloadBitArray[32]; // [0, 1, 0, ... 0, 1]
    signal input signature[32];
    signal input public_key_modulus[32];
    signal input public_key_exponent[32];

    component sha = Sha256(1024);

    sha.in <== headerDotPayloadBitArray;

    signal hashOfheaderDotPayload[256];

    hashOfheaderDotPayload <== sha.out;

    var numberOfLimbs = 4;
    component converter = Converter256BitsToNFieldElements(numberOfLimbs);
    converter.inputBits <== hashOfheaderDotPayload;

    // RsaVerifyPkcs1v15(w, nb, e_bits, hashLen)
    component rsaVerify = RsaVerifyPkcs1v15(64, 32, 17, numberOfLimbs);
    rsaVerify.exp <== public_key_exponent;
    rsaVerify.sign <== signature;
    rsaVerify.modulus <== public_key_modulus;

    // Here we convert from little indian to big indian
    rsaVerify.hashed[0] <== converter.outputLimbs[3];
    rsaVerify.hashed[1] <== converter.outputLimbs[2];
    rsaVerify.hashed[2] <== converter.outputLimbs[1];
    rsaVerify.hashed[3] <== converter.outputLimbs[0];
}

component main = xxx();