import {transfer} from "../deployment/spend.ts";

export async function handleTransferFundsEndpoint(request) {
    try {
        const destinationAddress = request.body['destinationAddress'];
        const amountToTransfer = request.body['amount'];
        const zkLoginId = request.body['zkLoginId'];

        const transactionHash = await transfer(destinationAddress, amountToTransfer, zkLoginId);

        return {
            status: 200,
            body: {
                'message': 'Funds transfer mocked',
                'transactionHash': transactionHash
            }
        }
    } catch (error) {
        return {
            status: 500,
            body: {
                'message': 'Funds transfer failed.',
                'error': error.message
            }
        };
    }
}