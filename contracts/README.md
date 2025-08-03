# MIST Unite Defi / Contracts

Two contracts deployed,

1. Core on Starknet
  - Registers deposit
  - Manages Merkle tree
  - Inclusion proof verification
  - JWT proof verification
  - Authorize withdrawal
2. Adapter on Base
  - Accepts deposits
  - Call Starknet for registering deposit
  - Withdraw

## Deployments

#### Core - Starknet Sepolia
- Deployed Contract: `0x01c8f90fb3daf75e3d68fe62bd5d93f7589a150d1545870f9551e6ce7fab67a0`
```toml
classHash = 0x4234796916bd12aea7b3bbb6358fb952a0e78c4b5ab11e57d16bb58b68c936
salt = 0xd00b
unique = 0xdad
calldata_len = 1
calldata = [0x52533491523ea25c77eb6536deafadaa0fa0ee267bbab6494938bbfe35cec73]
```

#### Adapter - Base Sepolia


## Hyperlane

### Hyperlane: Base Sepolia

Domain: 84532
Chain ID: 84532
Mailbox: 0x6966b0E55883d49BFB24539356a2f8A673E02039
Explorer: sepolia.basescan.org

### Hyperlane: Starknet Sepolia

Domain: 23448591
Chain ID: 0x534e5f5345504f4c4941
Mailbox: 0x03c725cd6a4463e4a9258d29304bcca5e4f1bbccab078ffd69784f5193a6d792
Block explorer: sepolia.voyager.online


