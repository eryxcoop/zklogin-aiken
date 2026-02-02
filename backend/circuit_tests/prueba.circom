pragma circom 2.2.3;
include "../node_modules/circomlib/circuits/sha256/sha256.circom";
include "./rsa_verify.circom";

template xxx() {
    signal input headerDotPayloadBitArray[1024]; // [0, 1, 0, ... 0, 1]
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

    // RsaVerifyPkcs1v15(w, nb, e_bits, hashLen)
    component rsaVerify = RsaVerifyPkcs1v15(64, 32, 17, 4);
    rsaVerify.exp <== public_key_exponent;
    rsaVerify.sign <== signature;
    rsaVerify.modulus <== public_key_modulus;
    rsaVerify.hashed <== hashed;
}

component main = xxx();