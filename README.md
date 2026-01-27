# zkLogin 
This repo contains an implementation of the zkLogin protocol in the cardano blockchain. The key contributions are the Aiken source code that regulates the fund spending of the zkLogin addresses and the Circom circuits that verify the autenticity of the owner. 

## Dependencies
* npm
* aiken-zk (https://github.com/eryxcoop/cardano-zk-aiken). Clone the repo and follow the steps in https://github.com/eryxcoop/cardano-zk-aiken/tree/main/aiken-zk (Prerequisites and Installation sections).
* aiken

## Note
Most of the flow in the next section is going to be automated in the milestone 3 so that the user can interact only with the frontend. 

## User flow for the 2nd milestone 
To try the new features introduced in the milestone 2 of the Catalyst proposal (https://milestones.projectcatalyst.io/projects/1400130/milestones/2) you should follow the next steps:

* Go to the ```frontend``` directory and run ```npm install```.
* Run ```npm run dev```. This will start a server that will let you enter the application flow (most likely in http://localhost:5173/).
* Follow the steps for generating the temporal credentials for the zkLogin Access. If at any point you want to reset the flow, just click the red button in the top right corner that says "Reset LocalState".
* In step 2, the application will ask you to login with your google account ("Sing In With Google"). This will redirect you to our example wallet called "zkLogin". 
* In step 4 you will be asked to generate or provide a ```salt```. If you generate a random value, store it for future use of the same zkLogin address.
* In step 5, after generating the zkLoginId, open the browser console and press the button "Print session data". This will print 2 json strings in the console that will be used later for generating the zk proof and generating the zkLogin transaction.
* Let's go to the backend now. Go to the ```backend``` directory and run ```npm install```. 
* Copy the first json printed in the console in the ```circuit_inputs/input_zkLogin.json``` file. 
* Install ```aiken-zk``` (listed in dependencies) if you haven't already.

#### Option 1: Run the Aiken test
* Go to the ```backend``` directory. 
* Run ```aiken-zk prove aiken circuits/zkLogin.circom verification_key.zkey circuit_inputs/input_zkLogin.json proof.ak```. If you installed ```aiken-zk``` and all its dependencies correctly, you should find a ```proof.ak``` in the ```backend``` directory. This file contains a Groth16 zk proof formatted ready for an aiken test!  
* Open the ```validators/zk_login.ak``` file and paste the contents of ```proof.ak``` in the ```test_example()``` method, replacing the previous one. Also, in the function ```fn test_proof_is_valid(proof: Proof) -> Bool``` of the same file, you should replace the values of:
  * ```zkLoginId```: found in the step 5 of the frontend
  * ```max_epoch```: at this point should be in the ```input_zkLogin.json``` file
  * ```ephemeral_public_key```: found in the console in the frontend, the second json printed. It should be a hexadecimal number.
* Run ```aiken check```. If everything went as expected, you should have the test passing!

#### Option 2: Deploy a real transaction
* In the ```backend``` directory run ```aiken build```. This should generate a ```plutus.json``` file in the ```backend``` directory.
* Run ```aiken-zk prove meshjs circuits/zkLogin.circom verification_key.zkey circuit_inputs/input_zkLogin.json deployment/zk_redeemer.ts```. This will generate a file in ```backend/deployment/zk_redeemer.ts``` with an integrated zk proof.
* Fill the ```.env``` file with your own Blockfrost key. Create or look for it in https://blockfrost.io.
* Fill your own data in ```deployment/transactionData.ts```. The fields are:
  * ```zkLoginId```: found in the step 5 of the frontend
  * ```max_epoch```: at this point should be in the ```input_zkLogin.json``` file
  * ```ephemeral_public_key``` and ```ephemeral_private_key```: found in the console in the frontend, the second json printed. It should be a hexadecimal number.
* Run ```npx tsx deployment/addressDerivation.ts```. This will generate your zkLogin address based on the zkLoginId you provided in the previous step.  
* Run ```npx tsx deployment/lockWithDatum.ts```. This will send funds to your zkLoginAddress.
* Run ```npx tsx deployment/spend.ts```. This will unlock funds from your zkLoginAddress into another address (which you can pick by changing the ```txOut``` in the ```spend.ts``` file).