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
                     	piA: #"970b9588e1946f41b9e15880ed4b505e1222cd5243368676f32029f73d912ba49ae728ab77468742e47e6e0cd6cceb04",
                     	piB: #"b39e3dea0463e6aefeadd74498462807b14bb045f54332f598d5498b938e1e344113b7cfbe1c8705b4d3b59243b3178b198662587205f2874b6b39e22f6e6a172d7a0459eeadb66e686ad0b07fbb39ce7d590bf5a5a6a465e245fabf07bd7fe2",
                     	piC: #"93d79dc4fd3629c52ac125e8164c07d7bcf128cf73d7bcdd36e4d4ee1e5295a15d0cc052814abda89150bda2315c5fd0",
                     }

  test_proof_is_valid(proof)
}

fn test_proof_is_valid(proof: Proof) -> Bool {
    // ---- REPLACE THESE VALUES ---- //
    let zkLoginId = 14148750501214927097030011212605728027483349936086135333593501826084812421527
    let max_epoch = 1769542273000
    let ephemeral_public_key = #"fbc4d2a26e628fa073c1dc4dee4b9934baee20ce18503ebf48a2610e77673f08"
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