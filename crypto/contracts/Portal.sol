// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract TheCryptoPurgePortal {
    uint256 totalLikes;

    event NewMessage(address indexed from, uint256 timestamp, string message);

    /*
     * A struct is basically a custom datatype where we can customize what we want to hold inside it.
     */
    struct Message {
        address user; // The address of the user who waved.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user sent the message.
    }

    /*
     * Store an array of messages.
     */
    Message[] messages;

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

    function sendMessage(string memory message) public {
        // msg.sender is the address of the account that called the function
        // Store the message in the messages array.
        messages.push(Message(msg.sender, message, block.timestamp));

        // Emit an event with the message.
        emit NewMessage(msg.sender, block.timestamp, message);
    }

    function getAllMessages() public view returns (Message[] memory) {
        return messages;
    }
}



