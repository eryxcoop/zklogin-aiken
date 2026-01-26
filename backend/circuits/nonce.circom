pragma circom 2.2.3;
include "./node_modules/poseidon-bls12381-circom/circuits/poseidon255.circom";


template Nonce {
    signal input max_epoch;
    signal input randomness;
    signal input eph_pk_high;
    signal input eph_pk_low;
    signal output nonce;

    component poseidon = Poseidon255(4);
    poseidon.in[0] <== max_epoch;
    poseidon.in[1] <== randomness;
    poseidon.in[2] <== eph_pk_high;
    poseidon.in[3] <== eph_pk_low;

    nonce <== poseidon.out;
}

//component main = Nonce();