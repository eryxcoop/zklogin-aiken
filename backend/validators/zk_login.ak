use aiken/collection/list
use ak_381/groth16.{Proof, SnarkVerificationKey, groth_verify}
use aiken/interval.{entirely_before}
use aiken/primitive/bytearray.{to_int_big_endian, take, drop}
use cardano/transaction.{OutputReference, Transaction}
use types.{ZkLoginRedeemer}
use ephemeral_auth.{verify_ephemeral_signature}
use aiken/crypto.{blake2b_224}

pub type ZK<redeemer_type> {
  redeemer: redeemer_type,
  proofs: List<Proof>,
}

validator zk_login(zk_login_id: Int) {
    spend(
        _datum: Option<Data>,
        redeemer: ZK<ZkLoginRedeemer>,
        _own_ref: OutputReference,
        self: Transaction,
    ) {
        let eph_pk_high_bytearray = take(redeemer.redeemer.ephemeral_public_key, 16)
        let eph_pk_low_bytearray = drop(redeemer.redeemer.ephemeral_public_key, 16)

        let eph_pk_high = to_int_big_endian(eph_pk_high_bytearray)
        let eph_pk_low = to_int_big_endian(eph_pk_low_bytearray)

        let verifies_ephemeral_signature = verify_ephemeral_signature(redeemer.redeemer, self)

        let max_epoch_is_valid = self.validity_range == entirely_before(redeemer.redeemer.max_epoch)

        expect _redeemer = zk_verify_or_fail(redeemer, [Single(eph_pk_high), Single(eph_pk_low), Single(zk_login_id), Single(redeemer.redeemer.max_epoch)])

        verifies_ephemeral_signature && max_epoch_is_valid
    }
}

type ZKInputType {
    Single(Int)
    Many(List<Int>)
}

fn zk_verify_or_fail(
    zk_redeemer: ZK<ZkLoginRedeemer>,
    public_inputs: List<ZKInputType>
) -> ZK<ZkLoginRedeemer> {

    let vk: SnarkVerificationKey =
        SnarkVerificationKey {
            nPublic: 4,
            vkAlpha: #"80b1bf6930d14b52fa03f6e4db586b8919df657b7a07f7b58931667caed3397b3466d55dde3eab193eca46e686dd6d50",
            vkBeta: #"aace77a76ed46078db19b14185743d3eb8414b8e5e0b70c9eeca91ff625a7578b7ef6cbe98320048185b56e57579821b06385bb3a753ad0b10013543c6baee66f8bb344b3b76f197cf49faa8927c8a33d73d22c665c5e8593e23cfe5f315c133",
            vkGamma: #"93e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8",
            vkDelta: #"8a605555988296912649b55949ab4e25385fa65805f783cb20b03aaf73de3e2d5ab78e266bb8cc9d2d07f8d2b31784bb09aa935888d4f6b6c9d75fecd42f37ede49b3e75495364a0351db8b363a420b12b4897635b44b259cd8285b71f14df7f",
            vkAlphaBeta: [],
            vkIC: [
                #"871957692225a1fd2ad5feb698f5f6aabe3d7000a353cf3b66737eabb61608a94554daa648d05f1b9eac5d6094c87cd1",
                #"8f74073cb85f049bc821b56b67a8c6d0a98fef401c900009b0196f0c463f69570c11135d103766a61e275a46204d0b87",
                #"8326bc07e571fdb90fa69bb7b882e34296839a232963b7a1fb45eaa416022ce1bc67bbf3a199e21d9843ba7ec2280af1",
                #"a9b7f6296c364085fcb4311cf6b9967786e58dc07877830d041c959b3a1c12ee6710d7009d14dbef39ad85b1dfc1171b",
                #"957b682d8afde21ae3a6455d0d47fe34d4d1a249e518994ed9b5c3b6e4d8b66c71feaf3e2b055256760bb047eeb33d66",
            ],
        }

    expect Some(proof) = list.head(zk_redeemer.proofs)

    let flattened_public_inputs: List<Int> = list.flat_map(public_inputs, fn(item) {
        when item is {
          Single(x) -> [x]
          Many(xs) -> xs
        }
    })
    trace @"Public Inputs": flattened_public_inputs

    if !groth_verify(vk, proof, flattened_public_inputs) {
        trace @"Groth16 Verification Failed"
      fail
      Void
    } else {
      Void
    }

    zk_redeemer
}

test test_example() {
  let proof: Proof = Proof {
                     	piA: #"96b7e34a3418f3c5f0504a062b94b1901e7a5a7c7d58c71832c8949dc57f4accb5bfd04ba24c3fc17d9e9f252c05d081",
                     	piB: #"806b5dc799f4e691826781d1071d4c20101cdb2acddb35a6f2a5074410136cdba3ba07c878c31f58aaa8f3fe863dfeb5082097cf3e09351d3ddd6a38a7f5b5cd008ae3c2838b971b82886dd2eba8e6e23b09623472bdaa1b695142a963ac42a3",
                     	piC: #"8ebc3dbdceddf187f81e2bacbbfe4c30b2bd3abbf441c592319c8c204f8bc30d26167cc59b1c764b3b47d31dcba68582",
                     }

  test_proof_is_valid(proof)
}

fn test_proof_is_valid(proof: Proof) -> Bool {
    // ---- REPLACE THESE VALUES ---- //
    let zkLoginId = 51494094427672739461613002722322509891295132526275668950929699073883077957783
    let max_epoch = 1773682160000
    let ephemeral_public_key = #"fb6f79e1239c9f2db1c7a35ad06d72a4993971c90bc8d0d68c063cdbd9213c05"
    // ------------------------------ //

    let zklogin_redeemer = ZkLoginRedeemer {
        max_epoch: max_epoch,
        ephemeral_public_key: ephemeral_public_key
    }

    let hashed_ephemeral_public_key = blake2b_224(zklogin_redeemer.ephemeral_public_key)
    let signatories_containing_redeemer_key_hash = [hashed_ephemeral_public_key]

    let zk_login_validity_range = entirely_before(zklogin_redeemer.max_epoch)

    let utxo_reference = OutputReference { transaction_id: "", output_index: 0 }

    zk_login.spend(
        zkLoginId,
        None,
        ZK { redeemer: zklogin_redeemer, proofs: [proof] },
        utxo_reference,
        Transaction {
            ..transaction.placeholder,
            extra_signatories: signatories_containing_redeemer_key_hash,
            validity_range: zk_login_validity_range,
        },
    )
}