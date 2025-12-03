#!/usr/bin/env python3
from dataclasses import dataclass
from pycardano import (
    Address,
    BlockFrostChainContext,
    Network,
    PaymentSigningKey,
    PaymentVerificationKey,
    PlutusData,
    PlutusV3Script,
    ScriptHash,
    TransactionBuilder,
    TransactionOutput,
    Unit,
    Value,
)
from pycardano.hash import (
    VerificationKeyHash,    
    TransactionId,
    ScriptHash,
)

import json
import os
import cbor2

def read_validator() -> dict:
    with open("src-backend/plutus.json", "r") as f:
        validator = json.load(f)
    script_bytes = PlutusV3Script(
        bytes.fromhex(validator["validators"][0]["compiledCode"])
    )
    script_hash = ScriptHash(bytes.fromhex(validator["validators"][0]["hash"]))
    return {
        "type": "PlutusV3",
        "script_bytes": script_bytes,
        "script_hash": script_hash,
    }

def lock(
        amount: int,
        script: PlutusV3Script,
        signing_key: PaymentSigningKey,
        context: BlockFrostChainContext,
) -> TransactionId:
    # read addresses
    with open("me.addr", "r") as f:
        input_address = Address.from_primitive(f.read())

    contract_address = Address(
        payment_part = script,
        network=Network.TESTNET,
    )

    # build transaction
    builder = TransactionBuilder(context=context)
    builder.add_input_address(input_address)
    builder.add_output(
        TransactionOutput(
            address=contract_address,
            amount=amount,
        )
    )
    signed_tx = builder.build_and_sign(
        signing_keys=[signing_key],
        change_address=input_address,
    )

    # submit transaction
    try:
        tx_id = context.submit_tx(signed_tx)
        print("TX enviada:", tx_id)
    except:  
        print("Fallo al enviar TX:", TransactionFailedException)
        if TransactionFailedException.response is not None:
            print("Detalles del error:", TransactionFailedException.response.text)

    return signed_tx.id

empty_datum = Unit()
serialized_datum_hex = empty_datum.to_cbor().hex()

context = BlockFrostChainContext(
    project_id=os.environ["BLOCKFROST_PROJECT_ID"],
    base_url="https://cardano-preview.blockfrost.io/api/",
)

signing_key = PaymentSigningKey.load("me.sk")

validator = read_validator()

owner = PaymentVerificationKey.from_signing_key(signing_key).hash()

tx_hash = lock(
    amount=Value(2_000_000),
    script=validator["script_hash"],
    signing_key=signing_key,
    context=context,
)

print(
    f"2 tADA locked into the contract\n\tTx ID: {tx_hash}\n\t"
)