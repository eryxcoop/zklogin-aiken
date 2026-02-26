// Import the built-in http module
import * as http from "http";
import {handleDeriveAddressEndpoint} from "./handleDeriveAddressEndpoint.ts";
import {handleGenerateProofEndpoint} from "./handleGenerateProofEndpoint.ts";

const DERIVE_ADDRESS_PATHNAME = "/deriveAddress"
const GENERATE_PROOF_PATHNAME = "/generateProof"

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
    console.log("Options request processed");
}

function urlFromRequest(host, port, req) {
    const url = new URL(req.url, `http://${host}:${port}`);
    return url;
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
        const request = await convertNodeServerRequestToRequest(nodeServerRequest);
        const response = await handleGenerateProofEndpoint(request);
        nodeServerResponse.writeHead(response.status, {"Content-Type": "application/json"});
        nodeServerResponse.end(JSON.stringify(response.body));
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

