pragma circom 2.2.3;

template Converter256BitsToNFieldElements(numberOfLimbs) {
    signal input inputBits[256];
    signal output outputLimbs[numberOfLimbs];

    assert (256 % numberOfLimbs == 0);

    var sizeOfLimbs = 256 / numberOfLimbs;

    signal accumulator[numberOfLimbs][sizeOfLimbs];
    var indexOfLimb;
    var k;

    for (indexOfLimb=0; indexOfLimb < numberOfLimbs; indexOfLimb++) {
        accumulator[indexOfLimb][0] <== inputBits[sizeOfLimbs*indexOfLimb];
        for (k=1; k < sizeOfLimbs; k++) {
             accumulator[indexOfLimb][k] <== (2 * accumulator[indexOfLimb][k-1]) + inputBits[k+sizeOfLimbs*indexOfLimb];
        }
        outputLimbs[indexOfLimb] <== accumulator[indexOfLimb][sizeOfLimbs-1];
    }
}