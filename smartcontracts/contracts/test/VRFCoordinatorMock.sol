// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract VRFCoordinatorMock {

    LinkTokenInterface public LINK;

    event RandomnessRequest(address indexed sender, bytes32 indexed keyHash, uint256 indexed seed);

    constructor(address linkAddress) {
        LINK = LinkTokenInterface(linkAddress);
    }

    function onTokenTransfer(address sender, uint256 fee, bytes memory _data)
        public
        onlyLINK
    {
        console.log("onTokenTransfer sender %s, fee %s", sender, fee);
        (bytes32 keyHash, uint256 seed) = abi.decode(_data, (bytes32, uint256));
        emit RandomnessRequest(sender, keyHash, seed);
    }

    function callBackWithRandomness(
        bytes32 requestId,
        uint256 randomness,
        address consumerContract
    ) public {
        VRFConsumerBase v;
        bytes memory resp = abi.encodeWithSelector(v.rawFulfillRandomness.selector, requestId, randomness);
        uint256 b = 206000;
        require(gasleft() >= b, "not enough gas for consumer");
        (bool success,) = consumerContract.call(resp);
        console.log("callBackWithRandomness success %s", success);
    }

    modifier onlyLINK() {
        require(msg.sender == address(LINK), "Must use LINK token");
        _;
    }
}
