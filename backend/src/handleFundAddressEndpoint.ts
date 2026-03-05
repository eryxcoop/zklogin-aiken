import {lockTxWithDatum} from "../deployment/lockWithDatum.ts";

export async function handleFundAddressEndpoint(request, alternativeEndpointLogic: any = null) {
    try {
        const scriptAddr = request.body['zkLoginAddress'];

        let transactionHash: string;
        if (alternativeEndpointLogic !== null) {
            transactionHash = alternativeEndpointLogic(scriptAddr);
        } else {
            transactionHash = await lockTxWithDatum(scriptAddr);
        }

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