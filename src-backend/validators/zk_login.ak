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

test spend_passes_when_tx_is_signed_with_an_ephemeral_key_matching_redeemer_ephemeral_key() {
    let redeemer = ZkLoginRedeemer{ephemeral_key_hash: #"1234"}
    let placeholder_utxo = OutputReference{transaction_id: #"", output_index: 0}
    let signatories_containing_redeemer_key_hash = [#"1234"] // extra_signatories is a field that is filled by the node
    zk_login.spend(
        None,
        redeemer,
        placeholder_utxo,
        Transaction{..transaction.placeholder, extra_signatories: signatories_containing_redeemer_key_hash},
    )
}

test spend_fails_when_tx_is_not_signed_by_any_extra_signatories() fail {
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

// The user trying to spend this utxo doesn't know the eph key pair or
// provides an incorrect ephemeral key in the redeemer
test spend_fails_when_redeemer_ephemeral_key_does_not_match_any_extra_signatures() fail {
    let redeemer = ZkLoginRedeemer{ephemeral_key_hash: #"1234"}
    let placeholder_utxo = OutputReference{transaction_id: #"", output_index: 0}
    let signatories_that_dont_match_redeemer_key_hash = [#"4567", #"1237"]
    zk_login.spend(
        None,
        redeemer,
        placeholder_utxo,
        Transaction{..transaction.placeholder, extra_signatories: signatories_that_dont_match_redeemer_key_hash},
    )
}