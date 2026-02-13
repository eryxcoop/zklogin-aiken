pragma circom 2.2.3;
include "../node_modules/circomlib/circuits/bitify.circom";

template ConvertByteArrayToBitArray(byteArraySize) {
    signal input byte_array[byteArraySize];
    var bit_array_size = byteArraySize * 8;
    signal output bit_array[bit_array_size];

    component converter = Num2Bits(8);
    converter.in <== byte_array[0];
    bit_array <== converter.out;
}
