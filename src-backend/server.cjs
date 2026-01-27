// Import the built-in http module
const { exec } = require("child_process");
const http = require("http");

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

    console.log("About to execute external script");
    exec("node create-wallet-on-chain.cjs", (error, stdout, stderr) => {
        if (error) {
            console.log("Execution of script failed");
            responseObject = {
                message: stderr,
                execution_result_code: error,
                status: 'error',
                walletAddress: ''
            };
        } else {
            console.log("Execution of script succeeded");
            responseObject = {
                message: 'Wallet created successfully.',
                execution_result_code: 0,
                status: 'success',
                walletAddress: stdout
            };
        }

        console.log("Responding with:", responseObject);

        const statusCode = responseObject.status === "error" ? 422 : 200; // 422 Unprocessable Content. The request was well-formed (i.e., syntactically correct) but could not be processed.
        res.writeHead(statusCode, { "Content-Type": "application/json" });
        res.end(JSON.stringify(responseObject));
    })
};

// Create the server with our request listener
const server = http.createServer(requestListener);

// Start listening for connections
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
