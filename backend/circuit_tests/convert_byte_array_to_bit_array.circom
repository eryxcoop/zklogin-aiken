pragma circom 2.2.3;
include "../node_modules/circomlib/circuits/bitify.circom";

template ConvertByteArrayToBitArray(byteArraySize) {
    signal input byte_array[byteArraySize];
    var bit_array_size = byteArraySize * 8;
    signal output bit_array[bit_array_size];

    component converter[byteArraySize];
    for (var current_byte = 0; current_byte < byteArraySize; current_byte++) {
        converter[current_byte] = Num2Bits(8);
        converter[current_byte].in <== byte_array[current_byte];
        var bit_array_offset = current_byte * 8;
        for (var bit_offset = 0; bit_offset < 8; bit_offset++) {
            var bit_index = bit_array_offset + 7 - bit_offset;
            bit_array[bit_index] <== converter[current_byte].out[bit_offset];
        }
    }
}
