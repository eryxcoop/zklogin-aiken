pragma circom 2.2.3;

include "../node_modules/poseidon-bls12381-circom/circuits/poseidon255.circom";

// TODO: esto es un serialize, la parte interna de la suma acumulada la queremos usar aparte para el nonce
template ASCII2BigInt(strLength){

    var packedLength = (strLength <= 31) ? 1 : ((strLength <= 62) ? 2 : (strLength <= 93 ? 3 : 4));

    signal input ascii[strLength];
    signal output packedBigInt;

    signal sum[packedLength][31];

    for (var j = 0; j < packedLength; j++){
        sum[j][0] <== ascii[j * 31] * (1 << 30*8);
        for (var i = 1; i < 31; i++){
            var ascii_index = j * 31 + i;
            if (ascii_index < strLength) {
                sum[j][i] <== sum[j][i-1] + ascii[ascii_index] * (1 << ((30-i) * 8));
            } else {
                sum[j][i] <== sum[j][i-1];
            }
        }
    }

    // -------- HASH -------- //

    component pos = Poseidon255(packedLength);
    for (var i = 0; i < packedLength; i++){
        pos.in[i] <== sum[i][30];
    }
    packedBigInt <== pos.out;
}

//component main = ASCII2BigInt(50);