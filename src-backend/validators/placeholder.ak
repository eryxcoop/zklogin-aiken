use aiken/collection/list
use aiken/crypto.{VerificationKeyHash}
use cardano/transaction.{OutputReference, Transaction}

pub type Redeemer {
  ephemeral_key_hash: VerificationKeyHash,
}

validator hello_world {
  spend(
    _datum: Option<Data>,
    redeemer: Redeemer,
    _own_ref: OutputReference,
    self: Transaction,
  ) {
    let must_be_signed = list.has(self.extra_signatories, redeemer.ephemeral_key_hash)
    must_be_signed
  }
}

test verifies_ephemeral_key_hash() {
    let redeemer = Redeemer{ephemeral_key_hash: "1234"}
    let placeholder_utxo = OutputReference{transaction_id: "", output_index: 0}
    hello_world.spend(
        None,
        redeemer,
        placeholder_utxo,
        Transaction{..transaction.placeholder, extra_signatories: [redeemer.ephemeral_key_hash]},
    )
}
