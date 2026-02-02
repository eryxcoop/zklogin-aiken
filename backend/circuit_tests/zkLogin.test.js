import {assert} from "chai";
import {wasm as wasm_tester} from "circom_tester";
import {fileURLToPath} from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const assert = chai.assert;
function bigint_to_array(n, k, x) {
    let mod = 1n;
    for (var idx = 0; idx < n; idx++) {
        mod = mod * 2n;
    }

    let ret = [];
    var x_temp = x;
    for (var idx = 0; idx < k; idx++) {
        ret.push(x_temp % mod);
        x_temp = x_temp / mod;
    }
    return ret;
}


describe("Circuit test", function () {
    let circuit;

    beforeAll(async () => {
        circuit = await wasm_tester(path.join(__dirname, "prueba.circom"));
    }, 1000000);

    it("XXX", async () => {
        //eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTc3MDEyOTA4OX0
        const headerDotPayloadBitArray = [0,1,1,0,0,1,0,1,0,1,1,1,1,0,0,1,0,1,0,0,1,0,1,0,0,1,1,0,1,0,0,0,0,1,1,0,0,0,1,0,0,1,0,0,0,1,1,1,0,1,1,0,0,0,1,1,0,1,1,0,1,0,0,1,0,1,0,0,1,1,1,1,0,1,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,1,0,1,0,1,0,1,0,1,0,1,1,1,1,0,1,0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,0,1,0,1,0,0,1,1,1,0,0,1,1,0,1,0,0,1,0,1,0,0,1,0,0,1,0,1,1,1,0,0,1,1,0,1,0,0,1,0,0,1,0,1,1,0,1,1,1,0,0,1,0,1,0,0,1,0,0,0,1,1,0,1,0,1,0,1,1,0,0,0,1,1,0,1,0,0,0,0,1,1,0,1,0,0,1,0,0,1,0,0,1,1,0,1,1,0,0,1,0,0,1,0,0,1,0,1,1,0,1,0,1,1,0,1,1,1,0,0,0,0,0,1,0,1,1,0,0,0,0,1,0,1,0,1,1,0,0,1,0,0,0,0,1,1,0,1,0,0,1,0,1,0,0,0,1,1,1,0,0,1,0,0,1,0,1,1,1,0,0,1,1,0,0,1,0,1,0,1,1,1,1,0,0,1,0,1,0,0,1,0,1,0,0,1,1,1,1,0,1,0,0,1,1,0,0,1,0,0,0,1,0,1,0,1,1,1,0,1,0,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,0,0,1,1,1,1,0,1,1,0,1,0,0,1,0,1,0,0,1,0,0,1,0,1,1,1,1,0,0,0,0,1,0,0,1,1,0,1,0,1,1,0,1,0,1,0,0,1,0,0,1,1,0,1,0,0,1,1,0,0,0,0,0,1,0,0,1,1,1,0,0,1,0,1,0,1,0,0,0,1,0,1,1,0,0,1,0,0,1,1,0,0,1,1,0,1,0,0,1,1,1,1,0,1,0,0,0,1,0,0,0,1,1,0,1,0,1,1,0,1,1,1,0,1,1,1,0,1,0,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,1,0,1,1,1,0,1,1,0,1,0,0,1,0,1,1,0,0,0,1,0,0,1,1,0,1,1,0,1,0,1,0,0,0,1,1,0,0,1,1,1,0,1,0,0,0,1,0,1,1,0,1,0,0,1,0,1,0,0,1,1,0,1,0,0,1,0,0,1,0,0,1,1,0,1,1,0,0,1,0,0,1,0,0,1,0,1,1,0,1,0,1,1,0,1,1,1,0,0,0,0,0,1,1,1,0,1,1,0,0,1,1,0,0,0,0,1,0,1,0,0,0,1,1,1,0,0,1,1,0,1,0,0,0,1,1,0,0,1,1,1,0,1,0,1,0,0,1,0,0,1,0,0,0,1,1,1,0,0,1,1,1,0,0,1,0,1,1,0,1,1,0,0,0,1,0,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,1,0,1,1,1,0,1,1,0,1,0,0,1,0,1,0,1,1,0,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,1,1,0,1,0,0,0,1,1,0,0,0,0,1,0,1,0,1,0,1,1,1,0,0,1,1,0,1,0,0,0,1,1,0,1,0,0,1,0,1,0,0,1,1,1,1,0,1,1,0,1,1,1,0,0,1,0,1,0,0,1,0,0,1,1,1,1,0,0,1,0,1,1,0,0,1,0,0,0,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,0,1,1,0,1,0,0,1,0,0,1,0,1,1,0,1,1,0,1,0,1,1,0,1,1,0,0,0,1,1,0,1,0,0,0,0,1,1,0,0,1,0,0,0,1,0,0,0,0,1,1,0,1,0,0,1,0,0,1,0,0,1,1,0,1,1,0,0,1,0,0,1,1,0,1,0,1,0,1,0,1,0,0,0,1,1,0,0,0,1,1,0,0,1,1,0,0,1,1,0,1,0,0,1,1,0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,1,1,1,1,0,0,1,0,1,0,0,1,1,1,1,0,1,0,1,0,1,0,0,0,1,0,0,0,0,0,1,0,0,1,1,0,1,0,0,0,1,0,0,1,1,1,1,0,1,0,1,1,0,0,0,0,0,1,1,0,0,0,0];
        let public_key_modulus = BigInt("27333278531038650284292446400685983964543820405055158402397263907659995327446166369388984969315774410223081038389734916442552953312548988147687296936649645550823280957757266695625382122565413076484125874545818286099364801140117875853249691189224238587206753225612046406534868213180954324992542640955526040556053150097561640564120642863954208763490114707326811013163227280580130702236406906684353048490731840275232065153721031968704703853746667518350717957685569289022049487955447803273805415754478723962939325870164033644600353029240991739641247820015852898600430315191986948597672794286676575642204004244219381500407");
        let public_key_exponent = BigInt(65537);
        let signature = BigInt("27166015521685750287064830171899789431519297967327068200526003963687696216659347317736779094212876326032375924944649760206771585778103092909024744594654706678288864890801000499430246054971129440518072676833029702477408973737931913964693831642228421821166326489172152903376352031367604507095742732994611253344812562891520292463788291973539285729019102238815435155266782647328690908245946607690372534644849495733662205697837732960032720813567898672483741410294744324300408404611458008868294953357660121510817012895745326996024006347446775298357303082471522757091056219893320485806442481065207020262668955919408138704593");
        // hashed data. decimal
        let hashed = BigInt("83814198383102558219731078260892729932246618004265700685467928187377105751529");
        let public_key_exponent_array = bigint_to_array(64, 32, public_key_exponent);
        let signature_array = bigint_to_array(64, 32, signature);
        let public_key_modulus_array = bigint_to_array(64, 32, public_key_modulus);
        let hashed_array = bigint_to_array(64, 4, hashed);
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
});