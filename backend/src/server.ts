// Import the built-in http module
import * as http from "http";
import {handleDeriveAddressEndpoint} from "./handleDeriveAddressEndpoint.ts";
import {handleGenerateProofEndpoint} from "./handleGenerateProofEndpoint.ts";
import {handleFundAddressEndpoint} from "./handleFundAddressEndpoint.ts";

const DERIVE_ADDRESS_PATHNAME = "/deriveAddress"
const GENERATE_PROOF_PATHNAME = "/generateProof"
const FUND_ADDRESS_PATHNAME = "/fundWithFaucet"

const host = 'localhost';
const port = 8000;

function setCORSHeaders(res) {
    // Set CORS headers to allow requests from localhost:5173
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // Allow localhost:5173
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // Allow specific methods
    res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // Allow Content-Type header
}

function handleCORS(res) {
    res.writeHead(200);
    res.end();
}

function urlFromRequest(host, port, request) {
    return new URL(request.url, `http://${host}:${port}`);
}

async function convertNodeServerRequestToRequest(nodeServerRequest) {
    const body: Record<string, unknown> = await new Promise((resolve, reject) => {
        let data = '';
        nodeServerRequest.on('data', chunk => {
            data += chunk;
        });
        nodeServerRequest.on('end', () => {
            try {
                resolve(JSON.parse(data));
            } catch (error) {
                reject(error);
            }
        });
        nodeServerRequest.on('error', reject);
    });
    return {
        url: nodeServerRequest.url,
        method: nodeServerRequest.method,
        headers: nodeServerRequest.headers,
        body: body,
    }
}

// Request listener: handles every incoming HTTP request
const requestListener = async function (nodeServerRequest, nodeServerResponse) {
    // Handle CORS
    setCORSHeaders(nodeServerResponse);
    if (nodeServerRequest.method === "OPTIONS") {
        handleCORS(nodeServerResponse);
        return;
    }

    const url = urlFromRequest(host, port, nodeServerRequest);

    if (nodeServerRequest.method === "GET" && url.pathname === DERIVE_ADDRESS_PATHNAME) {
        const searchParams = url.searchParams;
        const response = handleDeriveAddressEndpoint(searchParams);
        nodeServerResponse.writeHead(response.status, {"Content-Type": "application/json"});
        nodeServerResponse.end(JSON.stringify(response.body));
    } else if (nodeServerRequest.method === "POST" && url.pathname === GENERATE_PROOF_PATHNAME) {
        process.stdout.write("Received request to generate proof... ");
        const request = await convertNodeServerRequestToRequest(nodeServerRequest);
        const response = await handleGenerateProofEndpoint(request);
        nodeServerResponse.writeHead(response.status, {"Content-Type": "application/json"});
        nodeServerResponse.end(JSON.stringify(response.body));
        process.stdout.write("done.\n");
    } else if (nodeServerRequest.method === "POST" && url.pathname === FUND_ADDRESS_PATHNAME) {
        process.stdout.write("Received request to fund address... ");
        // TODO: Sacar codigo repetido de request y response
        const request = await convertNodeServerRequestToRequest(nodeServerRequest);
        const response = await handleFundAddressEndpoint(request);
        nodeServerResponse.writeHead(response.status, {"Content-Type": "application/json"});
        nodeServerResponse.end(JSON.stringify(response.body));
        process.stdout.write("done.\n");
    } else {
        throw Error(`Unknown combination of request method (${nodeServerRequest.method}) and path name (${url.pathname})`)
    }
};

// Create the server with our request listener
const server = http.createServer(requestListener);

// Start listening for connections
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

