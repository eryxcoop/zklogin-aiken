use aiken/crypto.{VerificationKeyHash}

pub type ZkLoginRedeemer {
  ephemeral_key_hash: VerificationKeyHash,
}