// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract TheCryptoPurgePortal {
    uint256 totalLikes;

    constructor() {
        console.log("The Crypto Purge Portal :)");
    }

    function like() public {
        totalLikes += 1;
        // msg.sender is the address of the account that called the function
        console.log("%s has given a like!", msg.sender);
    }

    function getTotalLikes() public view returns (uint256) {
        console.log("We have %d total likes!", totalLikes);
        return totalLikes;
    }
}



