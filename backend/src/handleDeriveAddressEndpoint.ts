import {deriveAddress} from "../deployment/deriveAddress.ts";

export function handleDeriveAddressEndpoint(searchParams) {
    let responseObject;
    try {
        const zkLoginId = searchParams.get("zkLoginId");
        const derivedAddress = deriveAddress(BigInt(zkLoginId));
        console.log("Execution of script succeeded");
        responseObject = {
            message: 'Wallet created successfully.',
            execution_result_code: 0,
            status: 'success',
            walletAddress: derivedAddress
        };
        return {
            status: 200,
            body: responseObject,
        };
    } catch (error) {
        console.log("Execution of script failed");
        responseObject = {
            message: error.message,
            execution_result_code: error,
            status: 'error',
            walletAddress: '----'
        };
        return {
            status: 422,
            body: responseObject,
        };
    }
}