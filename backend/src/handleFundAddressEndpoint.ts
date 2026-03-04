import {lockTxWithDatum} from "../deployment/lockWithDatum.ts";

export async function handleFundAddressEndpoint(request) {
    try {
        const scriptAddr = request.body['zkLoginAddress'];
        const transactionHash = await lockTxWithDatum(scriptAddr);

        return {
            status: 200,
            body: {
                'message': 'Wallet funding successful',
                'transactionHash': transactionHash
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