# zkLogin 
This repo contains an implementation of the zkLogin protocol in the cardano blockchain. The key contributions are the Aiken source code that regulates the fund spending of the zkLogin addresses and the Circom circuits that verify the autenticity of the owner, but this repo also contains a frontend that allows any user with a Google account to easily test the implementation. 

## Dependencies
* ```npm```
* ```aiken-zk``` (https://github.com/eryxcoop/cardano-zk-aiken). Clone the repo and follow the steps in https://github.com/eryxcoop/cardano-zk-aiken/tree/main/aiken-zk (Prerequisites and Installation sections).
* ```aiken```
* ```git lfs``` (https://git-lfs.com/)
* ```snarkjs``` **globally** (also a dependency of aiken-zk)


## User flow for the 3rd milestone 
To try the new features introduced in the milestone 3 of the Catalyst proposal (https://milestones.projectcatalyst.io/projects/1400130/milestones/3) you should follow the next steps:

Note: all of this has been tested on the preview network. 

* Run ```git lfs pull```, if it fails, install git lfs (listed in the dependencies).
* Go to the ```frontend``` directory and run ```npm install```.
* Run ```npm run dev```. This will start a server that will let you enter the application flow (most likely in http://localhost:5173/).
* Go to the ```backend``` directory and run ```npm install```.
* Install ```aiken-zk``` (listed in dependencies) if you haven't already.
* Run ```node --watch --trace-uncaught --trace-warnings src/server.ts``` to start the backend server (most likely in http://localhost:8000/).
* Follow the steps 1-5 for generating the temporal credentials for the zkLogin Access and your zkLogin address. At this point you will have your own zkLogin address! You can retrieve it anytime as long as you store the salt from step 4. 
* If at any point you want to reset the flow, just click the red button in the top right corner that says "Reset LocalState".
* Moving on to **step 6**, press the "Generate ZK Proof" button to request the backend to generate the proof. This task is expensive and may take some time (no more than 2 minutes). When it's done, you can see the resulting proof on the screen and move to the next step. This proof will be useful to sign all the transactions in the current zkLogin session (until the expiration time is reached). 
* The **step 7** is a "custom faucet" created specifically for zkLogin due to a mesh.js limitation: the UTxOs that a zkLogin address spend must have a datum. This is not a Cardano limitation, but for now it's important that any UTxO sent to a zkLogin address has a datum, even if it's empty. By pressing "Execute Transaction Block" you will receive 50 ADA in the zkLogin address. Check it out in CardanoScan before moving to the next step. 
* Finally, **step 8** lets you send ADA to any address from your zkLogin address. After you've done it, you should see the hash of the last transaction.


## Running the tests
* Go to the `backend` directory and run `npm run test`


## For developers only: generating a new verification key
* Download `pot23_final_21.ptau` from https://github.com/p0tion-tools/cardano-ppot. Move the file to `backend/ceremony.ptau`.
* Go to `backend/circuits`. Run `./compile-proof-verify.sh -c zk_login.circom unused_parameter ../backend/ceremony.ptau`.
* Go to `backend/curve_compress` and run `node compressedVerificationKey.cjs ../circuits/build/verification_key.json`.
* Manually copy each value of the output into `zk_login.ak` (under `SnarkVerificationKey`).
* Replace `backend/verification_key.zkey` with the new one found in `circuits/build/zk_login_final.zkey`.