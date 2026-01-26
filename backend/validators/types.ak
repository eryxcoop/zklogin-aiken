use aiken/crypto.{VerificationKey}

pub type ZkLoginRedeemer {
  max_epoch: Int,
  ephemeral_public_key: VerificationKey
}