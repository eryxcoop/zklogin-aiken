from dataclasses import dataclass
from pycardano import (
    Address,
    BlockFrostChainContext,
    Network,
    PaymentSigningKey,
    PaymentVerificationKey,
    PlutusData,
    PlutusV3Script,
    Redeemer,
    ScriptHash,
    TransactionBuilder,
    TransactionOutput,
    UTxO,
    PlutusData,
)
from pycardano.hash import (
    VerificationKeyHash,
    TransactionId,
    ScriptHash,
)
import json
import os
import sys

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

def unlock(
        utxo: UTxO,
        from_script: PlutusV3Script,
        redeemer: Redeemer,
        signing_key: PaymentSigningKey,
        owner: VerificationKeyHash,
        context: BlockFrostChainContext,
) -> TransactionId:
    # read addresses
    with open("me.addr", "r") as f:
        input_address = Address.from_primitive(f.read())

    # build transaction
    builder = TransactionBuilder(context=context)
    builder.add_script_input(
        utxo=utxo,
        script=from_script,
        redeemer=redeemer,
    )
    builder.add_input_address(input_address)
    builder.add_output(
        TransactionOutput(
            address=input_address,
            amount=utxo.output.amount.coin,
        )
    )
    builder.required_signers = [owner]
    signed_tx = builder.build_and_sign(
        signing_keys=[signing_key],
        change_address=input_address,
    )

    # submit transaction
    context.submit_tx(signed_tx)
    return signed_tx.id

def get_utxo_from_str(context, tx_id: str, contract_address: Address) -> UTxO:
    for utxo in context.utxos(str(contract_address)):
        if str(utxo.input.transaction_id) == tx_id:
            return utxo
    raise Exception(f"UTxO not found for transaction {tx_id}")

@dataclass
class HelloWorldRedeemer(PlutusData):
    CONSTR_ID = 0
    msg: bytes
    ephemeral_key_hash: bytes

context = BlockFrostChainContext(
    project_id=os.environ["BLOCKFROST_PROJECT_ID"],
    base_url="https://cardano-preview.blockfrost.io/api/",
)

signing_key = PaymentSigningKey.load("me.sk")
payment_verification_key = PaymentVerificationKey.from_signing_key(signing_key).hash()
print(type(payment_verification_key))
print(payment_verification_key)

validator = read_validator()

# get utxo to spend
utxo = get_utxo_from_str(context, sys.argv[1], Address(
    payment_part = validator["script_hash"],
    network=Network.TESTNET,
))

# build redeemer
redeemer = Redeemer(data=HelloWorldRedeemer(msg=b"Hello, World!", ephemeral_key_hash=bytes(payment_verification_key)))

# execute transaction
tx_hash = unlock(
    utxo=utxo,
    from_script=validator["script_bytes"],
    redeemer=redeemer,
    signing_key=signing_key,
    owner=PaymentVerificationKey.from_signing_key(signing_key).hash(),
    context=context,
)

print(
    f"2 tADA unlocked from the contract\n\tTx ID: {tx_hash}\n\tRedeemer: {redeemer.to_cbor_hex()}"
)