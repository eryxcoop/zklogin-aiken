use cardano/transaction.{OutputReference, Transaction}
use src_backend/types.{ZkLoginRedeemer}
use src_backend/ephemeral_auth.{verify_ephemeral_signature}

validator zkLogin {
  spend(
    _datum: Option<Data>,
    redeemer: ZkLoginRedeemer,
    _own_ref: OutputReference,
    self: Transaction,
  ) {
    verify_ephemeral_signature(redeemer, self)
  }
}

test verifies_ephemeral_key_hash() {
    let redeemer = ZkLoginRedeemer{ephemeral_key_hash: #"1234"}
    let placeholder_utxo = OutputReference{transaction_id: #"", output_index: 0}
    zkLogin.spend(
        None,
        redeemer,
        placeholder_utxo,
        Transaction{..transaction.placeholder, extra_signatories: [redeemer.ephemeral_key_hash]},
    )
}
