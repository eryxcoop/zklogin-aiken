pragma circom 2.2.3;
include "../node_modules/circomlib/circuits/sha256/sha256.circom";
include "./rsa_verify.circom";
include "./converter_256_bits_to_n_field_elements.circom";

template xxx() {
    signal input headerDotPayloadBitArray[32]; // [0, 1, 0, ... 0, 1]
    signal input public_key_exponent[32];
    signal input signature[32];
    signal input public_key_modulus[32];
    signal input hashed[4];
    signal output hash[256];

    component sha = Sha256(1024);

    sha.in <== headerDotPayloadBitArray;

    // e5ae8342fb5e645fadf301f7d265e299dc08068c17b35f79aed65922722bbdd5
    hash <== [1,1,1,0,0,1,0,1,1,0,1,0,1,1,1,0,1,0,0,0,0,0,1,1,0,1,0,0,0,0,1,0,1,1,1,1,1,0,1,1,0,1,0,1,1,1,1,0,0,1,1,0,0,1,0,0,0,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,1,1,1,1,1,0,1,1,1,1,1,0,1,0,0,1,0,0,1,1,0,0,1,0,1,1,1,1,0,0,0,1,0,1,0,0,1,1,0,0,1,1,1,0,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,1,1,0,0,0,0,0,1,0,1,1,1,1,0,1,1,0,0,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,0,0,1,1,0,1,0,1,1,1,0,1,1,0,1,0,1,1,0,0,1,0,1,1,0,0,1,0,0,1,0,0,0,1,0,0,1,1,1,0,0,1,0,0,0,1,0,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,0,1,0,1];

    hash === sha.out;

    component converter = Converter256BitsToNFieldElements(4);

    converter.inputBits <== sha.out;
    converter.outputLimbs[0] === hashed[3];
    converter.outputLimbs[1] === hashed[2];
    converter.outputLimbs[2] === hashed[1];
    converter.outputLimbs[3] === hashed[0];

    // RsaVerifyPkcs1v15(w, nb, e_bits, hashLen)
    component rsaVerify = RsaVerifyPkcs1v15(64, 32, 17, 4);
    rsaVerify.exp <== public_key_exponent;
    rsaVerify.sign <== signature;
    rsaVerify.modulus <== public_key_modulus;
    rsaVerify.hashed[0] <== converter.outputLimbs[3];
    rsaVerify.hashed[1] <== converter.outputLimbs[2];
    rsaVerify.hashed[2] <== converter.outputLimbs[1];
    rsaVerify.hashed[3] <== converter.outputLimbs[0];
}

component main = xxx();