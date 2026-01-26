pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/comparators.circom";

template CalculateTotal(n) {
    signal input nums[n];
    signal output sum;

    signal sums[n];
    sums[0] <== nums[0];

    for (var i=1; i < n; i++) {
        sums[i] <== sums[i - 1] + nums[i];
    }

    sum <== sums[n - 1];
}

template SliceFixed(inSize, outSize) {
    signal input in[inSize];
    signal input offset;
    
    signal output out[outSize];
    
    component selector[outSize];
    component eqs[inSize][outSize];
    for(var i = 0; i < outSize; i++) {
        selector[i] = CalculateTotal(inSize);
        
        for(var j = 0; j < inSize; j++) {
            eqs[j][i] = IsEqual();
            eqs[j][i].in[0] <== j;
            eqs[j][i].in[1] <== offset + i;
            
            selector[i].nums[j] <== eqs[j][i].out * in[j];
        }

        out[i] <== selector[i].sum;
    }
}

template Slice(inSize, outSize) {
    signal input in[inSize];
    signal input offset;
    signal input length;
    
    signal output out[outSize];
    
    component selector[outSize];
    component eqs[inSize][outSize];
    component lt[outSize];
    signal mask[inSize][outSize];
    for(var i = 0; i < outSize; i++) {
        selector[i] = CalculateTotal(inSize);
        
        lt[i] = LessThan(8);
        lt[i].in[0] <== i;
        lt[i].in[1] <== length;
        
        for(var j = 0; j < inSize; j++) {
            eqs[j][i] = IsEqual();
            eqs[j][i].in[0] <== j;
            eqs[j][i].in[1] <== offset + i;
            
            mask[j][i] <== eqs[j][i].out * lt[i].out;
            
            selector[i].nums[j] <== mask[j][i] * in[j];
        }

        out[i] <== selector[i].sum;
    }
}
