use aiken/collection/list
use aiken/crypto.{blake2b_224}
use cardano/transaction.{Transaction}
use types.{ZkLoginRedeemer}

pub fn verify_ephemeral_signature(redeemer: ZkLoginRedeemer, tx: Transaction) -> Bool {
    let hashed_ephemeral_public_key = blake2b_224(redeemer.ephemeral_public_key)
    list.has(tx.extra_signatories, hashed_ephemeral_public_key)
}