// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RandomNumberConsumer is VRFConsumerBase, Ownable {
    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public randomResult;
    event RequestedRandomness(bytes32 requestId);
    event EmitRandom(uint256 randomResult);

    /**
     * Constructor inherits VRFConsumerBase
     *
     */
    constructor(
        address _vrfCoordinator,
        address _link,
        bytes32 _keyHash,
        uint256 _fee
    )
        VRFConsumerBase(
            _vrfCoordinator, // VRF Coordinator
            _link // LINK Token
        )
    {
        keyHash = _keyHash;
        fee = _fee; // 0.1 * 10 ** 18 === 0.1 LINK (Varies by network)
    }

    /**
     * Requests randomness
     */
    function getRandomNumber() public returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract first");

        requestId = requestRandomness(keyHash, fee);
        emit RequestedRandomness(requestId);
        return requestId;
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        console.log("Created random %s for request %s", randomness, string(abi.encodePacked(requestId)));
        randomResult = randomness;
        // get a random number in a range from 1 to 50
        // randomResult = (randomness % 50) + 1;
        emit EmitRandom(randomResult);
    }

    /**
     * Withdraw LINK from this contract
     *
     * THIS IS PURELY FOR EXAMPLE PURPOSES.
     */
    function withdrawLink() onlyOwner external {
        require(
            LINK.transfer(msg.sender, LINK.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
}
