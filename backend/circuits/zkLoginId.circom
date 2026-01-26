pragma circom 2.2.3;
include "./node_modules/poseidon-bls12381-circom/circuits/poseidon255.circom";
include "./ascii_to_bigint.circom";

template ZkLoginId {
    signal input salt;
    signal input sub;
    signal input aud;
    signal input iss;
    signal output zkLoginId;

    component poseidon = Poseidon255(4);
    poseidon.in[0] <== iss;
    poseidon.in[1] <== aud;
    poseidon.in[2] <== sub;
    poseidon.in[3] <== salt;

    zkLoginId <== poseidon.out;
}

template ZkLoginIdAscii(audSize, issSize, subSize) {
    signal input salt;
    signal input iss_ascii[issSize];
    signal input aud_ascii[audSize];
    signal input sub_ascii[subSize];
    signal iss;
    signal aud;
    signal sub;
    signal output zkLoginId;

    component sub2field = ASCII2BigInt(subSize);
    sub2field.ascii <== sub_ascii;
    sub <== sub2field.packedBigInt;

    component aud2field = ASCII2BigInt(audSize);
    aud2field.ascii <== aud_ascii;
    aud <== aud2field.packedBigInt;

    component iss2field = ASCII2BigInt(issSize);
    iss2field.ascii <== iss_ascii;
    iss <== iss2field.packedBigInt;

    component zkLoginIdComputation = ZkLoginId();
    zkLoginIdComputation.salt <== salt;
    zkLoginIdComputation.aud <== aud;
    zkLoginIdComputation.iss <== iss;
    zkLoginIdComputation.sub <== sub;
    zkLoginId <== zkLoginIdComputation.zkLoginId;
}

//component main = ZkLoginIdAscii(72,27,21);