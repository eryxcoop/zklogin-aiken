import {transfer} from "../deployment/spend.ts";

export async function handleTransferFundsEndpoint(request) {
    try {
        const destinationAddress = request.body['destinationAddress'];
        const amountToTransfer = request.body['amount'];
        const zkLoginId = request.body['zkLoginId'];
        const ephemeralPublicKey = request.body['ephemeralPublicKey'];
        const ephemeralPrivateKey = request.body['ephemeralPrivateKey'];
        const maxEpoch = request.body['maxEpoch'];
        const zkProof = request.body['zkProof'];

        console.log("destinationAddress", destinationAddress)
        console.log("amountToTransfer", amountToTransfer)
        console.log("zkLoginId", zkLoginId)
        console.log("ephemeralPublicKey", ephemeralPublicKey)
        console.log("ephemeralPrivateKey", ephemeralPrivateKey)
        console.log("maxEpoch", maxEpoch)
        console.log("zkProof", zkProof)


        const transactionHash = await transfer(
            destinationAddress,
            Number(amountToTransfer)*1000000,
            BigInt(zkLoginId),
            ephemeralPublicKey,
            ephemeralPrivateKey,
            maxEpoch,
            zkProof
        );

        process.stdout.write("done.\n");
        return {
            status: 200,
            body: {
                'message': 'Funds transfer successful',
                'transactionHash': transactionHash
            }
        }
    } catch (error) {
        process.stdout.write(`Failed with: ${error}`);
        return {
            status: 500,
            body: {
                'message': `Funds transfer failed with error: ${error}.`,
                'error': error.message
            }
        };
    }
}