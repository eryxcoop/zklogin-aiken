import { assert } from "chai";
import { wasm as wasm_tester } from "circom_tester";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const assert = chai.assert;

describe("Poseidon Circuit test", function () {
    let circuit;

    beforeAll( async () => {
        circuit = await wasm_tester(path.join(__dirname, "prueba.circom"));
    });

    it("XXX", async () => {
        const witness = await circuit.calculateWitness({inputs: []}, true);

        //const res2 = poseidon([1,2,0,0,0]);

        // header.loadout
        // eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk1NDRkMGZmMDU5MGYwMjUzMDE2NDNmMzI3NWJmNjg3NzY3NjU4MjIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI5MjA3MTkyMzA0MjEtbzZrdDUyMzVjczhwbTBic2ZkdGt0MGk1ZmxhN20wNzIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI5MjA3MTkyMzA0MjEtbzZrdDUyMzVjczhwbTBic2ZkdGt0MGk1ZmxhN20wNzIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDI1NjMxNzQzNTY1ODczMDA2MTgiLCJub25jZSI6ImIvaTFmVUtVTEhpMzB0R25yZU80Y3BJQ0FoOXdmUFVkdUJ2bWNvYmpMWk09IiwibmJmIjoxNzY5NjI3NTA4LCJpYXQiOjE3Njk2Mjc4MDgsImV4cCI6MTc2OTYzMTQwOCwianRpIjoiZTQ4NGQxZTFhYjMxYmJmYzgwZGVlZjQyYzg1YzI0NTE3MmI5NTI0YiJ9

        //assert(F.eq(F.e("1018317224307729531995786483840663576608797660851238720571059489595066344487"), F.e(res2)));
        //await circuit.assertOut(w, {out : F.toObject(res2)});
        await circuit.checkConstraints(witness);
    });
});