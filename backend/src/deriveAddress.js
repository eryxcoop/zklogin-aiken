import {derivateAddress} from "../deployment/addressDerivation.ts";

export function handleDeriveAddressAction(searchParams, res) {
    try {
        const zkLoginId = searchParams.get("zkLoginId");
        const derivedAddress = derivateAddress(BigInt(zkLoginId));
        console.log("Execution of script succeeded");
        const responseObject = {
            message: 'Wallet created successfully.',
            execution_result_code: 0,
            status: 'success',
            walletAddress: derivedAddress
        };
    } catch (error) {
        console.log("Execution of script failed");
        const responseObject = {
            message: error.message,
            execution_result_code: error,
            status: 'error',
            walletAddress: '----'
        };
    }
    const statusCode = responseObject.status === "error" ? 422 : 200; // 422 Unprocessable Content. The request was well-formed (i.e., syntactically correct) but could not be processed.
    res.writeHead(statusCode, {"Content-Type": "application/json"});
    res.end(JSON.stringify(responseObject));
}