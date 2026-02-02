pragma circom 2.2.3;

template Converter256BitsToNFieldElements(numberOfLimbs) {
    signal input in[256];
    signal output out[numberOfLimbs];

    assert (256 % numberOfLimbs == 0);

    var sizeOfLimbs = 256 / numberOfLimbs;

    signal accumulator[numberOfLimbs][sizeOfLimbs];
    var indexOfLimb;
    var k;

    for (indexOfLimb=0; indexOfLimb < numberOfLimbs; indexOfLimb++) {
        accumulator[indexOfLimb][0] <== in[sizeOfLimbs*indexOfLimb];
        for (k=1; k < sizeOfLimbs; k++) {
             accumulator[indexOfLimb][k] <== (2 * accumulator[indexOfLimb][k-1]) + in[k+sizeOfLimbs*indexOfLimb];
        }
        out[indexOfLimb] <== accumulator[indexOfLimb][sizeOfLimbs-1];
    }
}