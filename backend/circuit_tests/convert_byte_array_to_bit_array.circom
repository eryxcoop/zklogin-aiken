pragma circom 2.2.3;
include "../node_modules/circomlib/circuits/bitify.circom";

template ConvertByteArrayToBitArray() {
    signal input byte_array[1];
    signal output bit_array[8];

    component converter = Num2Bits(8);
    converter.in <== byte_array[0];
    bit_array <== converter.out;
}
