pragma circom 2.2.3;
include "./converter_256_bits_to_n_field_elements.circom";

template Test() {
    signal input inputBits[256];
    signal input outputLimbs[2];

    component converter = Converter256BitsToNFieldElements(2);
    converter.inputBits <== inputBits;
    converter.outputLimbs === outputLimbs;
}

component main {public [inputBits, outputLimbs]} = Test();