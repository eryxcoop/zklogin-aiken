use aiken/collection/list
use cardano/transaction.{Transaction}
use src_backend/types.{ZkLoginRedeemer}

pub fn verify_ephemeral_signature(redeemer: ZkLoginRedeemer, tx: Transaction) -> Bool {
    list.has(tx.extra_signatories, redeemer.ephemeral_key_hash)
}