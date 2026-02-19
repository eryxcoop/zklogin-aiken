// Import the built-in http module
import http from "http";
import {handleDeriveAddressAction} from "./deriveAddress.js";

const DERIVE_ADDRESS_PATHNAME = "/deriveAddress"
const GENERATE_PROOF_PATHNAME = "/deriveAddress"

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

    const url = new URL(req.url, `http://${host}:${port}`);
    const method = req.method;
    const searchParams = url.searchParams;
    const pathname = url.pathname;

    if (method === "GET" && pathname === DERIVE_ADDRESS_PATHNAME) {
        handleDeriveAddressAction(searchParams, res);
    } else if (method === "POST" && pathname === GENERATE_PROOF_PATHNAME) {

    } else {
        throw Error("Unknown combination of request method and path name")
    }
};

// Create the server with our request listener
const server = http.createServer(requestListener);

// Start listening for connections
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

