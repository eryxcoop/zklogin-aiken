import {wasm as wasm_tester} from "circom_tester";
import {fileURLToPath} from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function a_bigint_to_limbs(amountOfLimbs, limbSizeInBits, bigint) {
    let mod = 1n;
    for (var idx = 0; idx < limbSizeInBits; idx++) {
        mod = mod * 2n;
    }

    let ret = [];
    var x_temp = bigint;
    for (var idx = 0; idx < amountOfLimbs; idx++) {
        ret.push(x_temp % mod);
        x_temp = x_temp / mod;
    }
    return ret;
}


describe("Circuit test", function () {
    let circuit;
    let circuit_converter;

    beforeAll(async () => {
        circuit = await wasm_tester(path.join(__dirname, "prueba.circom"));
        circuit_converter = await wasm_tester(path.join(__dirname, "test_converter_256_bits_to_n_field_elements.circom"));
    }, 1000000);

    it("verifies jwt signature using RS256", async () => {
        //eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTc3MDEyOTA4OX0
        const headerDotPayloadBitArray = [0,1,1,0,0,1,0,1,0,1,1,1,1,0,0,1,0,1,0,0,1,0,1,0,0,1,1,0,1,0,0,0,0,1,1,0,0,0,1,0,0,1,0,0,0,1,1,1,0,1,1,0,0,0,1,1,0,1,1,0,1,0,0,1,0,1,0,0,1,1,1,1,0,1,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,1,0,1,0,1,0,1,0,1,0,1,1,1,1,0,1,0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,0,1,0,1,0,0,1,1,1,0,0,1,1,0,1,0,0,1,0,1,0,0,1,0,0,1,0,1,1,1,0,0,1,1,0,1,0,0,1,0,0,1,0,1,1,0,1,1,1,0,0,1,0,1,0,0,1,0,0,0,1,1,0,1,0,1,0,1,1,0,0,0,1,1,0,1,0,0,0,0,1,1,0,1,0,0,1,0,0,1,0,0,1,1,0,1,1,0,0,1,0,0,1,0,0,1,0,1,1,0,1,0,1,1,0,1,1,1,0,0,0,0,0,1,0,1,1,0,0,0,0,1,0,1,0,1,1,0,0,1,0,0,0,0,1,1,0,1,0,0,1,0,1,0,0,0,1,1,1,0,0,1,0,0,1,0,1,1,1,0,0,1,1,0,0,1,0,1,0,1,1,1,1,0,0,1,0,1,0,0,1,0,1,0,0,1,1,1,1,0,1,0,0,1,1,0,0,1,0,0,0,1,0,1,0,1,1,1,0,1,0,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,0,0,1,1,1,1,0,1,1,0,1,0,0,1,0,1,0,0,1,0,0,1,0,1,1,1,1,0,0,0,0,1,0,0,1,1,0,1,0,1,1,0,1,0,1,0,0,1,0,0,1,1,0,1,0,0,1,1,0,0,0,0,0,1,0,0,1,1,1,0,0,1,0,1,0,1,0,0,0,1,0,1,1,0,0,1,0,0,1,1,0,0,1,1,0,1,0,0,1,1,1,1,0,1,0,0,0,1,0,0,0,1,1,0,1,0,1,1,0,1,1,1,0,1,1,1,0,1,0,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,1,0,1,1,1,0,1,1,0,1,0,0,1,0,1,1,0,0,0,1,0,0,1,1,0,1,1,0,1,0,1,0,0,0,1,1,0,0,1,1,1,0,1,0,0,0,1,0,1,1,0,1,0,0,1,0,1,0,0,1,1,0,1,0,0,1,0,0,1,0,0,1,1,0,1,1,0,0,1,0,0,1,0,0,1,0,1,1,0,1,0,1,1,0,1,1,1,0,0,0,0,0,1,1,1,0,1,1,0,0,1,1,0,0,0,0,1,0,1,0,0,0,1,1,1,0,0,1,1,0,1,0,0,0,1,1,0,0,1,1,1,0,1,0,1,0,0,1,0,0,1,0,0,0,1,1,1,0,0,1,1,1,0,0,1,0,1,1,0,1,1,0,0,0,1,0,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,1,0,1,1,1,0,1,1,0,1,0,0,1,0,1,0,1,1,0,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,1,1,0,1,0,0,0,1,1,0,0,0,0,1,0,1,0,1,0,1,1,1,0,0,1,1,0,1,0,0,0,1,1,0,1,0,0,1,0,1,0,0,1,1,1,1,0,1,1,0,1,1,1,0,0,1,0,1,0,0,1,0,0,1,1,1,1,0,0,1,0,1,1,0,0,1,0,0,0,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,0,1,1,0,1,0,0,1,0,0,1,0,1,1,0,1,1,0,1,0,1,1,0,1,1,0,0,0,1,1,0,1,0,0,0,0,1,1,0,0,1,0,0,0,1,0,0,0,0,1,1,0,1,0,0,1,0,0,1,0,0,1,1,0,1,1,0,0,1,0,0,1,1,0,1,0,1,0,1,0,1,0,0,0,1,1,0,0,0,1,1,0,0,1,1,0,0,1,1,0,1,0,0,1,1,0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,1,1,1,1,0,0,1,0,1,0,0,1,1,1,1,0,1,0,1,0,1,0,0,0,1,0,0,0,0,0,1,0,0,1,1,0,1,0,0,0,1,0,0,1,1,1,1,0,1,0,1,1,0,0,0,0,0,1,1,0,0,0,0];
        let public_key_modulus = BigInt("0xBB5494D4B7D52CF1C2A333311F6328E2580E11E3F3366D2D46078B7B357A7DF02DD20BA75532F0EE89CB467AEAD3F2335BBC9647B424AE604BEE34CA127E6EFAA2A16F029F06CB48B3E6CC636664A75F209D3C4A2F1A12DAD15CCC690F2CF822CEC92E7A63208519E259AA0B7327A191DDEAA86125BD6FD50CBE406964E0D272D5923468F73FB8D11433B95684F00900166C59CE8C37C7E54960A763CA4909D224FDC024B40D14D7BB6EBD576EB855FFF78EFADE75988A46483094BF71340C315C5834C7F5C5C34D3951655122476070A5938E904FD9D3F0559E16582FBD68655DF86CA7D68D022DE95FE2B1231A85DB00012002A786531ADC2256E35DF6DC9B");
        let public_key_exponent = BigInt(65537);
        let signature = BigInt("5145559121648581779772074153094490247393445260452952141482684307469231428748548144983684147091020528283748226457169802377763197677906082875379043113855634752062186025818864488745257351456651783340753505130064101035830740199094856463226782725519549056338442963660265485420759911223585393698016426247702101842926601471191270412325619723591911258864004588065914607780968553021546595631752559089255150912010385265002613684225837756637514982674733376021179464774090472654689419916992370827091889421252937825753980860643068000942650360058170396691631601029310791359435532906100455010378178799578875298407393407890159548193");
        // hashed data. decimal
        let hashed = BigInt("0xe5ae8342fb5e645fadf301f7d265e299dc08068c17b35f79aed65922722bbdd5");
        let public_key_exponent_array = a_bigint_to_limbs(32, 64, public_key_exponent);
        let signature_array = a_bigint_to_limbs(32, 64, signature);
        let public_key_modulus_array = a_bigint_to_limbs(32, 64, public_key_modulus);
        let hashed_array = a_bigint_to_limbs(4, 64, hashed);
        const witness = await circuit.calculateWitness({
            "headerDotPayloadBitArray": headerDotPayloadBitArray,
            "public_key_exponent": public_key_exponent_array,
            "signature": signature_array,
            "public_key_modulus": public_key_modulus_array,
            "hashed": hashed_array
        }, true);
        //const res2 = poseidon([1,2,0,0,0]);

        // header.loadout
        // eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk1NDRkMGZmMDU5MGYwMjUzMDE2NDNmMzI3NWJmNjg3NzY3NjU4MjIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI5MjA3MTkyMzA0MjEtbzZrdDUyMzVjczhwbTBic2ZkdGt0MGk1ZmxhN20wNzIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI5MjA3MTkyMzA0MjEtbzZrdDUyMzVjczhwbTBic2ZkdGt0MGk1ZmxhN20wNzIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDI1NjMxNzQzNTY1ODczMDA2MTgiLCJub25jZSI6ImIvaTFmVUtVTEhpMzB0R25yZU80Y3BJQ0FoOXdmUFVkdUJ2bWNvYmpMWk09IiwibmJmIjoxNzY5NjI3NTA4LCJpYXQiOjE3Njk2Mjc4MDgsImV4cCI6MTc2OTYzMTQwOCwianRpIjoiZTQ4NGQxZTFhYjMxYmJmYzgwZGVlZjQyYzg1YzI0NTE3MmI5NTI0YiJ9

        //assert(F.eq(F.e("1018317224307729531995786483840663576608797660851238720571059489595066344487"), F.e(res2)));
        // await circuit.assertOut(witness, {hash : F.toObject(res2)});
        await circuit.checkConstraints(witness);
    }, 1000000);

    it("can converter a bigint zero into 256 limbs of 1 bit (256bits)", async () => {
        const inputBits = a_bigint_to_limbs(256, 1, BigInt("0x0000000000000000000000000000000000000000000000000000000000000000"));
        const witness = await circuit_converter.calculateWitness({
            "inputBits": inputBits,
            "outputLimbs": [0,0]
        }, true);
        // await circuit.assertOut(witness, {hash : F.toObject(res2)});
        await circuit_converter.checkConstraints(witness);
    }, 1000000);

    it("can converter a bigint zero into 256 limbs of 1 bit (256bits) xxx", async () => {
        const oneTailedWith127Zeroes = 2n**127n;
        let input = oneTailedWith127Zeroes*(2n**128n) + oneTailedWith127Zeroes;
        const witness = await circuit_converter.calculateWitness({
            "inputBits": a_bigint_to_limbs(256, 1, input).reverse(),
            "outputLimbs": a_bigint_to_limbs(2, 128, input).reverse()
        }, true);
        // await circuit.assertOut(witness, {hash : F.toObject(res2)});
        await circuit_converter.checkConstraints(witness);
    }, 1000000);
});