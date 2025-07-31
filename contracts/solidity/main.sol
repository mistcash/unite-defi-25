// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IMailbox {
    function dispatch(
        uint32 destinationDomain,
        bytes32 recipientAddress,
        bytes calldata messageBody
    ) external payable returns (bytes32 messageId);

    function quoteDispatch(
        uint32 destinationDomain,
        bytes32 recipientAddress,
        bytes calldata messageBody
    ) external view returns (uint256 fee);

    function localDomain() external view returns (uint32);
}

/**
 * @title Owner
 * @dev Set & change owner
 */
contract Endpoint is ReentrancyGuard {
    IMailbox public immutable mailbox;
    uint32 public immutable localDomain;
    
    // Starknet Mainnet domain ID on Hyperlane
    uint32 public constant STARKNET_DOMAIN = 1553125230;
    
    // snCoreAddress contract address on Starknet (set in constructor)
    bytes32 private snCoreAddress;

    constructor(
        address _mailbox,
        bytes32 _snCoreAddress
    ) {
        require(_mailbox != address(0), "Invalid mailbox address");
        require(_snCoreAddress != 0, "Invalid snCoreAddress address");
        
        mailbox = IMailbox(_mailbox);
        localDomain = mailbox.localDomain();
        snCoreAddress = _snCoreAddress;
    }

    modifier onlyMailbox() {
        require(
            msg.sender == address(mailbox),
            "MailboxClient: sender not mailbox"
        );
        _;
    }

    // Message structure for cross-chain communication
    struct Deposit {
        address token;
        uint256 amount;
        address sender;
        uint256 hash;
        uint256 claimingKey; // 248-bit claiming key for private transfers
    }

    // Message structure for cross-chain communication
    struct Withdraw {
        address token;
        uint256 amount;
        address recipient;
        uint256 claimingKey; // 248-bit claiming key for verification
    }

    /**
     * @notice Receive funds and hash message, then forward to Starknet
     * @param _token Address of the token contract
     * @param _amount Amount of tokens to bridge
     * @param _hashMessage Hash message to include
     * @return claimingKey Generated 248-bit claiming key for this transfer
     */
    function private_tx(
        address _token,
        uint256 _amount,
        uint256 _hashMessage
    ) external payable returns (uint256 claimingKey) {
        require(_token != address(0), "Invalid token address");
        require(_amount > 0, "Amount must be greater than 0");
        
        // Generate a 248-bit random claiming key
        // Using block properties for randomness (note: not cryptographically secure for production)
        claimingKey = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.difficulty,
            msg.sender,
            _amount,
            _hashMessage,
            address(this)
        ))) >> 8; // Right shift by 8 bits to get 248 bits
        
        // Transfer tokens from sender to this contract
        IERC20 token = IERC20(_token);
        require(
            token.transferFrom(msg.sender, address(this), _amount),
            "Token transfer failed"
        );

        Deposit memory message = Deposit({
            token: _token,
            amount: _amount,
            sender: msg.sender,
            hash: _hashMessage,
            claimingKey: claimingKey
        });

        bytes memory messageBody = abi.encode(message);

        bytes32 snCoreBytes32 = snCoreAddress;
        
        // Get quote for dispatch
        uint256 fee = mailbox.quoteDispatch(
            STARKNET_DOMAIN,
            snCoreBytes32,
            messageBody
        );
        
        require(msg.value >= fee, "Insufficient fee for dispatch");
        
        // Send message to Starknet via Hyperlane
        mailbox.dispatch{value: fee}(
            STARKNET_DOMAIN,
            snCoreBytes32,
            messageBody
        );
        
        // Refund excess fee
        if (msg.value > fee) {
            payable(msg.sender).transfer(msg.value - fee);
        }
        
        return claimingKey;
    }
    
    /**
     * @notice Handle incoming messages from Hyperlane (called by Mailbox)
     * @param _origin Domain of origin chain
     * @param _sender Address of sender on origin chain as bytes32
     * @param _messageBody Raw bytes content of message body
     */
    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _messageBody
    ) external onlyMailbox {
        // Verify message comes from Starknet Mainnet
        require(_origin == STARKNET_DOMAIN, "Invalid origin domain");
        
        // Verify message comes from snCoreAddress contract
        require(_sender == snCoreAddress, "Invalid sender");
        
        // Decode message
        Withdraw memory wMessage = abi.decode(_messageBody, (Withdraw));
        
        // Only process withdraw messages
        require(wMessage.recipient != address(0), "Invalid recipient");
        require(wMessage.amount > 0, "Invalid amount");
        require(wMessage.claimingKey > 0, "Invalid claiming key");
        
        // Transfer tokens to recipient
        IERC20 token = IERC20(wMessage.token);
        require(
            token.balanceOf(address(this)) >= wMessage.amount,
            "Insufficient contract balance"
        );
        
        require(
            token.transfer(wMessage.recipient, wMessage.amount),
            "Token transfer failed"
        );
    }
    
    /**
     * @notice Get quote for bridging to Starknet
     * @param _token Token address
     * @param _amount Amount to bridge
     * @param _hashMessage Hash message
     * @return fee Required fee for the bridge operation
     */
    function quoteBridgeToStarknet(
        address _token,
        uint256 _amount,
        uint256 _hashMessage
    ) external view returns (uint256 fee) {
        // Generate a sample claiming key for quote calculation
        uint256 sampleClaimingKey = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            msg.sender,
            _amount
        ))) >> 8;
        
        Deposit memory message = Deposit({
            token: _token,
            sender: msg.sender,
            amount: _amount,
            hash: _hashMessage,
            claimingKey: sampleClaimingKey
        });
        
        bytes memory messageBody = abi.encode(message);
        bytes32 snCoreBytes32 = bytes32(snCoreAddress);
        
        return mailbox.quoteDispatch(
            STARKNET_DOMAIN,
            snCoreBytes32,
            messageBody
        );
    }

    // Receive ETH
    receive() external payable {}
}
