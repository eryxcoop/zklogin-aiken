import {readFileSync} from "node:fs";
import {applyParamsToScript} from "@meshsdk/core-csl";
import {serializePlutusScript} from "@meshsdk/core";
import * as Cardano from '@emurgo/cardano-serialization-lib-browser';

/**
 * Converts any Cardano address (Bech32 or Base58) to Hex format
 * @param addressString - The string address (e.g., addr1..., stake1..., or DdzFF...)
 * @returns The hex representation of the address
 */
export function addressToHex(addressString: string): string {
    try {
        // 1. Create an Address object from the string (handles Bech32/Base58 automatically)
        const addr = Cardano.Address.from_bech32(addressString);

        // 2. Get raw bytes and convert to hex
        return Buffer.from(addr.to_bytes()).toString('hex');
    } catch (e) {
        // If from_bech32 fails, try Byron (Base58)
        try {
            const addr = Cardano.Address.from_bytes(Buffer.from(addressString, 'hex'));
            // Note: For actual Base58 input, you'd use Cardano.ByronAddress.from_base58()
            return Buffer.from(addr.to_bytes()).toString('hex');
        } catch (err) {
            throw new Error("Invalid Cardano address format");
        }
    }
}

export function deriveAddress(zkloginid: bigint) {
    const compiledContractPath = "./plutus.json";
    const validatorScriptIndex = 0;
    let jsonString: string;

    try {
        jsonString = readFileSync(compiledContractPath, 'utf-8');
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw new Error("plutus.json does not exist, run 'aiken build' as stated in README.md");
        }
        throw error;
    }
    const parsedJson = JSON.parse(jsonString);

    const parameterized_script = applyParamsToScript(
        parsedJson.validators[validatorScriptIndex].compiledCode,
        [zkloginid]
    );
    const scriptAddr = serializePlutusScript(
        {code: parameterized_script, version: "V3"}
    ).address;
    const hexAddr = addressToHex(scriptAddr);
    return {derivedAddress: scriptAddr, derivedAddressInHex: hexAddr}
}
