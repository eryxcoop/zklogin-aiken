pragma circom 2.2.3;

template Converter256BitsToNFieldElements(numberOfLimbs) {
    signal input inputBits[256];
    signal output outputLimbs[numberOfLimbs];

    assert (256 % numberOfLimbs == 0);

    var sizeOfLimbs = 256 / numberOfLimbs;

    signal accumulator[numberOfLimbs][sizeOfLimbs];
    var indexOfLimb;
    var k;

    /*
    nL = 2 sL = 3
     iL = 0
     |
    [1,0,0 , 1,0,0]
     0 1 2   3 4 5
     2*(2*(1) + 0) + 0 = 2**2*1 + 2**1*0 + 2**0*0

    accumulator 3 posiciones
    accumulator[0][0] = 1
    accumulator[0][1] = 2*(1) + 0
    accumulator[0][2] = 2*(2*(1) + 0) + 0 = 2**2*1 + 2**1*0 + 2**0*0
    */

    for (indexOfLimb = 0; indexOfLimb < numberOfLimbs; indexOfLimb++) {
        accumulator[indexOfLimb][0] <== inputBits[indexOfLimb*sizeOfLimbs];
        for (k = 1; k < sizeOfLimbs; k++) {
             accumulator[indexOfLimb][k] <== (2 * accumulator[indexOfLimb][k-1]) + inputBits[indexOfLimb*sizeOfLimbs+k];
        }
        outputLimbs[indexOfLimb] <== accumulator[indexOfLimb][sizeOfLimbs-1];
    }
}