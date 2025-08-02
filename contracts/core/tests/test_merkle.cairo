use mist_core::merkle::{
    BN254PoseidonHasher, HasherTrait, MerkleTree, MerkleTreeTrait, PoseidonBN254HasherImpl,
};
use mist_core::{
    IHelloStarknetDispatcher, IHelloStarknetDispatcherTrait, IHelloStarknetSafeDispatcherTrait,
};

#[test]
fn test_bn254_hasher() {
    let mut hasher = PoseidonBN254HasherImpl::new();
    let hash = hasher.hash(22, 77);
    assert(
        hash == 19961037077221450811179090755490497271310203121908505232896238333507349516398,
        'Incorrect hash',
    );
}
