// Import the built-in http module
import http from "http";
import {ZKLOGIN_ID} from "../deployment/transactionData.ts";
import {derivateAddress} from "../deployment/addressDerivation.ts";

const host = 'localhost';
const port = 8000;

// Request listener: handles every incoming HTTP request
const requestListener = function (req, res) {
    // Set CORS headers to allow requests from localhost:5173
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // Allow localhost:5173
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // Allow specific methods
    res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // Allow Content-Type header

    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        console.log("Options request processed");
        return;
    }

    let responseObject = {
        message: 'Something bad happened',
        status: 'error',
        walletAddress: ''
    };

    if (req.method === "GET") {
        try {
            const url = new URL(req.url, `http://${host}:${port}`);
            const zkLoginId = url.searchParams.get("zkLoginId");
            const derivedAddress = derivateAddress(BigInt(zkLoginId));
            console.log("Execution of script succeeded");
            responseObject = {
                message: 'Wallet created successfully.',
                execution_result_code: 0,
                status: 'success',
                walletAddress: derivedAddress
            };
        } catch(error) {
            console.log("Execution of script failed");
            responseObject = {
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
};

// Create the server with our request listener
const server = http.createServer(requestListener);

// Start listening for connections
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
