pub mod merkle;

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct Msg {
    origin: u32,
    sender: u256,
    len: usize,
}


#[starknet::contract]
mod Core {
    pub use alexandria_bytes::{Bytes, BytesTrait};
    use garaga::hashes::poseidon_bn254::poseidon_hash_2;
    use openzeppelin_access::ownable::OwnableComponent;
    use openzeppelin_upgrades::UpgradeableComponent;
    use openzeppelin_upgrades::interface::IUpgradeable;
    use starknet::storage::{
        Map, MutableVecTrait, StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess,
        StoragePointerWriteAccess, Vec, VecTrait,
    };
    use starknet::{ClassHash, ContractAddress};
    use crate::Msg;
    use crate::merkle::{MerkleTreeImpl, bn254_merkle};

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);

    // Ownable Mixin
    #[abi(embed_v0)]
    impl OwnableMixinImpl = OwnableComponent::OwnableMixinImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    // Upgradeable
    impl UpgradeableInternalImpl = UpgradeableComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        upgradeable: UpgradeableComponent::Storage,
        msg: Msg,
        msgContent: Vec<u128>,
        items: Vec<u256>,
        amounts: Map<u256, u256>,
        merkle_root: u256,
        nullified: Map<u256, bool>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        UpgradeableEvent: UpgradeableComponent::Event,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.ownable.initializer(owner);
    }

    #[abi(embed_v0)]
    impl UpgradeableImpl of IUpgradeable<ContractState> {
        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            // This function can only be called by the owner
            self.ownable.assert_only_owner();
            // Replace the class hash upgrading the contract
            self.upgradeable.upgrade(new_class_hash);
        }
    }

    #[external(v0)]
    fn simulate_handle(ref self: ContractState, hash: u256, amount: u256) {
        self.amounts.write(hash, amount); // For easy lookup later
        let hash_with_amt = poseidon_hash_2(hash, amount);
        self.items.push(hash_with_amt);
        let mut merkle = bn254_merkle();

        merkle.compute_proof(array![hash_with_amt], self.items.read());
        self.nullified.write(hash_with_amt, false);
    }

    #[external(v0)]
    fn read_amount(self: @ContractState, tx_hash: u256) -> u256 {
        self.amounts.read(tx_hash)
    }

    #[external(v0)]
    fn handle(ref self: ContractState, hash: u256, amount: u256) {
        self.amounts.write(hash, amount); // For easy lookup later
        let hash_with_amt = poseidon_hash_2(hash, amount);
        self.items.push(hash_with_amt);
        let mut merkle = bn254_merkle();

        merkle.compute_proof(array![hash_with_amt], self.items.read());
        self.nullified.write(hash_with_amt, false);
    }

    #[external(v0)]
    fn last_msg(self: @ContractState) -> Msg {
        self.msg.read()
    }

    #[external(v0)]
    fn read_msg(self: @ContractState, i: u64) -> u128 {
        self.msgContent.at(i).read()
    }
}
