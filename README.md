# zkLogin 
This repo contains an implementation of the zkLogin protocol in the cardano blockchain. The key contributions are the Aiken source code that regulates the fund spending of the zkLogin addresses and the Circom circuits that verify the autenticity of the owner, but this repo also contains a frontend that allows any user with a Google account to easily test the implementation. 

## Dependencies
* ```node >= 22.22.1```
* ```npm```
* ```aiken-zk``` (https://github.com/eryxcoop/cardano-zk-aiken). Clone the repo and follow the steps in https://github.com/eryxcoop/cardano-zk-aiken/tree/main/aiken-zk (Prerequisites and Installation sections).
* ```aiken```
* ```snarkjs``` **globally** (also a dependency of aiken-zk)


## User flow 
To try a full zkLogin protocol flow, you should follow the next steps:

Note: all of this has been tested on the preview network. 

* Give permission to execute and run  ```./fetch_vk.sh``` to fetch the Verification Key needed for proof generation (890MB).
* Go to the ```frontend``` directory and run ```npm install```.
* Run ```npm run dev```. This will start a server that will let you enter the application flow (most likely in http://localhost:5173/).
* Go to the ```backend``` directory and run ```npm install```.
* Install ```aiken-zk``` (listed in dependencies) if you haven't already.
* Run ```aiken build```. This should create a ```plutus.json``` file in the backend directory. 
* Create a ```.env``` file in the ```backend``` directory based on the ```.env.example``` and set your own Blockfrost key.
* Run ```npm run dev``` to start the backend server (most likely in http://localhost:8000/).
* Follow the steps 1-5 for generating the temporal credentials for the zkLogin Access and your zkLogin address. At this point you will have your own zkLogin address! You can retrieve it anytime as long as you store the salt from step 4. 
* If at any point you want to reset the flow, just click the red button in the top right corner that says "Reset LocalState".
* Moving on to **step 6**, press the "Generate ZK Proof" button to request the backend to generate the proof. This task is expensive and may take some time (no more than 2 minutes). When it's done, you can see the resulting proof on the screen and move to the next step. This proof will be useful to sign all the transactions in the current zkLogin session (until the expiration time is reached). 
* The **step 7** is a faucet. By pressing "Execute Transaction Block" you will receive 50 ADA in the zkLogin address. Check it out in CardanoScan before moving to the next step. 
* Finally, **step 8** lets you send ADA to any address from your zkLogin address. After you've done it, you should see the hash of the last transaction.


## Running the tests
* Go to the `backend` directory and run `npm run test`


## For developers only 
### Generating a new verification key
* Download `pot23_final_21.ptau` from https://github.com/p0tion-tools/cardano-ppot. Move the file to `backend/ceremony.ptau`.
* Go to `backend/circuits`. Run `./compile-proof-verify.sh -c zk_login.circom unused_parameter ../backend/ceremony.ptau`.
* Go to `backend/curve_compress` and run `node compressedVerificationKey.cjs ../circuits/build/verification_key.json`.
* Manually copy each value of the output into `zk_login.ak` (under `SnarkVerificationKey`).
* Replace `backend/verification_key.zkey` with the new one found in `circuits/build/zk_login_final.zkey`.

### Contribution guidelines
You can find out how to contribute to the project by reading [this document](https://github.com/eryxcoop/zklogin-aiken/blob/main/Developer%20documentation.pdf).

## Example transaction
Here we can see an example of a successful transaction using a zkLogin account in the `preview` network:
* zkLogin address: `addr_test1wq8lpz2a3g84nhtxk5svp7d4k7gcjm89q3tyc8de3xk5urq5fdvqx`
* Destination address: `addr_test1wq8lpz2a3g84nhtxk5svp7d4k7gcjm89q3tyc8de3xk5urq5fdvqx` (same one)
* Tx hash: `c398b2c063a1db62324e41e671331eacac1fec10b4edf1b6c33ffef84c3202f7`
* CardanoScan: https://preview.cardanoscan.io/transaction/c398b2c063a1db62324e41e671331eacac1fec10b4edf1b6c33ffef84c3202f7

## Integration support
If you just want to use zkLogin as an individual, follow the steps listed in User Flow.
If you want to integrate zkLogin protocol to a wallet, dApp or another system, contact us at `crypto-racoons@eryxsoluciones.com.ar`.

## Current limitations
Right now the biggest limitation zkLogin faces is the absence of an oracle for Google public keys, which is the way of dealing with Google's key rotation. Until that matter is solved there must be manual migrations before each change in the provider's credentials. There's also the issue of the sponsor wallet: the script that controls the address cannot provide collateral by itself since the collateral UTxOs must be controlled by a sk, so any application of this protocol must have a policy around that fact. If you want to know more, contact us at contact us at `crypto-racoons@eryxsoluciones.com.ar`. 