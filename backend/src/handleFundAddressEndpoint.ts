import {generateProof} from "../deployment/generateProof.ts";
import {execSync} from "node:child_process";
import * as fs from 'node:fs/promises';

export async function handleFundAddressEndpoint(request) {
    try {

        return {
            status: 200,
            body: {
                'message': 'Wallet funding mocked',
            }
        }
    } catch (error) {
        return {
            status: 500,
            body: {
                'message': 'Wallet funding failed.',
                'error': error.message
            }
        };
    }
}