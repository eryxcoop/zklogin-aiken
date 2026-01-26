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
            vkAlpha: #"8eb3e4b19d0db52a71cb397b2dab83179416c370c79b186b1c9b9ddfc882919d5462cade73f77f628325b42270737ebc",
            vkBeta: #"882c8e5f5a621339311fce39f168d19668b738be53879ad30a6b5c5e25b896331c1051b954d3fab37b50fd062eae773d15ad1724087721028bdd5d01095a3b4954e11bad59bb79e2e0b71a46206ee160d5fd591c967d77b5a5bb7fa1306b5391",
            vkGamma: #"93e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8",
            vkDelta: #"b824005d651bf6d38362f30967f78a33381fde734ebd5687265d2b250f54aa5b10860c1e0cd522e375a7f04178efe69c0747d9ee650176e8376346111c82fd997c3b16604ef241edd84843e9d84a3fd3833bcb2308b5ce4dfa9f465b18dbec7c",
            vkAlphaBeta: [],
            vkIC: [
                #"a5a4e207b8d1683ded08a4463d9f6ca5d2a26bc87116a2794181de69c59a0decc4e187efa5d6b58bbcbec1e1795991ef",
                #"80baa196b3cc4d905a32d9548c8b98e67caa8aacb3cc0de844a6aa6a75cf31ce2f930a90606d26e82591bcab860e4039",
                #"8d3f8016ffb77a2b509576ac82aafae057d0f77da833aca36285e319a77f1ab6cbfd114be4cf55bcf93a12bba818ece3",
                #"93da2e7bbb6c06b2c2b38b0a8cb036a6f0bc1a338dc385f7e884fa1f9f54e09f75beb8d96ff23bfdd32db6e7c8b82c21",
                #"b118db9274af36de348f78c00ab9b974d01098fd3b743c37240cab7fd90c836b8f974f44c2019391d417549dd84828bc",
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
                     	piA: #"af0edcd733271e1585d02fe9748a041cb822324639928e879242b7f43c2e2dda89dc5cae4ae702a04d33a9057ce5d8b5",
                     	piB: #"99443c9347f13641671ede901896c7f50143699860411be24cd5064256c2e7cda176f6486503235aa4dcea2347c94bb219ab9d6c37167cbaf25593be17831aa6d671071bdc707acdb12b422bfcdbe26c9fc44ab0062f98a2d9dd1b275fc69895",
                     	piC: #"8d6dd46b5f2553f2bc61dfcb6cbfbc63b6e5d45df0d7456ac9b30bb21429c9e2f6d89b4e075a7692edcdd3f40e3dd38b",
                     }

  test_proof_is_valid(proof)
}

fn test_proof_is_valid(proof: Proof) -> Bool {
    let zklogin_redeemer = ZkLoginRedeemer {
        max_epoch: 1769535438000,
        ephemeral_public_key: #"0f31c5411bbcb96fcdebec480c26511bf5eaaa055d2424c57c38e3c737d0580b"
    }

    let hashed_ephemeral_public_key = blake2b_224(zklogin_redeemer.ephemeral_public_key)
    let signatories_containing_redeemer_key_hash = [hashed_ephemeral_public_key]

    let zk_login_validity_range = entirely_before(zklogin_redeemer.max_epoch)

    let utxo_reference = OutputReference { transaction_id: "", output_index: 0 }

    zk_login.spend(
        14148750501214927097030011212605728027483349936086135333593501826084812421527,
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