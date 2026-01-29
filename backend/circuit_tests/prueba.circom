pragma circom 2.2.3;
include "../node_modules/circomlib/circuits/sha256/sha256.circom";

template xxx() {
    signal output hash[256];
    component sha = Sha256(2);

    sha.in <== [0,1];

    hash <== sha.out;
}

component main = xxx();