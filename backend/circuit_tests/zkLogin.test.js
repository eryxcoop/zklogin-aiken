import { assert } from "chai";
import { wasm as wasm_tester } from "circom_tester";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const assert = chai.assert;

describe("Poseidon Circuit test", function () {
    let circuit;

    // this.timeout(1000000);

    beforeAll( async () => {
        circuit = await wasm_tester(path.join(__dirname, "prueba.circom"));
    });

    it("XXX", async () => {
        const witness = await circuit.calculateWitness({inputs: []}, true);

        //const res2 = poseidon([1,2,0,0,0]);

        //assert(F.eq(F.e("1018317224307729531995786483840663576608797660851238720571059489595066344487"), F.e(res2)));
        //await circuit.assertOut(w, {out : F.toObject(res2)});
        await circuit.checkConstraints(witness);
    });
});