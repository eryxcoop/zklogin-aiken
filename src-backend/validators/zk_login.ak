use cardano/transaction.{OutputReference, Transaction}
use src_backend/types.{ZkLoginRedeemer}
use src_backend/ephemeral_auth.{verify_ephemeral_signature}

validator zk_login {
  spend(
    _datum: Option<Data>,
    redeemer: ZkLoginRedeemer,
    _own_ref: OutputReference,
    self: Transaction,
  ) {
    verify_ephemeral_signature(redeemer, self)
  }
}

test spend_works_when_valid_ephemeral_key_hash_is_present_in_extra_signatories() {
  let redeemer = ZkLoginRedeemer{ephemeral_key_hash: #"1234"}
  let placeholder_utxo = OutputReference{transaction_id: #"", output_index: 0}
  let list_with_signatory = [redeemer.ephemeral_key_hash]
  zk_login.spend(
      None,
      redeemer,
      placeholder_utxo,
      Transaction{..transaction.placeholder, extra_signatories: list_with_signatory},
  )
}

test spend_fails_when_ephemeral_key_hash_is_absent_in_extra_signatories() fail {
  let redeemer = ZkLoginRedeemer{ephemeral_key_hash: #"1234"}
  let placeholder_utxo = OutputReference{transaction_id: #"", output_index: 0}
  let empty_signatories = []
  zk_login.spend(
      None,
      redeemer,
      placeholder_utxo,
      Transaction{..transaction.placeholder, extra_signatories: empty_signatories},
  )
}