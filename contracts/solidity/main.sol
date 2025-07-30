// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";

/**
 * @title Owner
 * @dev Set & change owner
 */
contract Owner {

    bytes32 private sn_core;
    address private messager;

    /**
     * Set messager and sn_core
     */
    constructor(address _messager, bytes32 _sn_core) {
        sn_core = _sn_core;
        messager = _messager;
    }
} 
