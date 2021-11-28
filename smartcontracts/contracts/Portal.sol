// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract TheCryptoPurgePortal {
    uint256 totalLikes;

    /**
     * Emit new messages to the portal.
     */
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

    /*
     * We will be using this below to help generate a "random" number
     * will essentially change every time a user call feelingLucky function.
     */
    uint256 private seed = 0;
    /*
     * Cooldowns to prevent spammers
     * In this case, We'll be storing the address with the last time a user tried his luck.
     */
    mapping(address => uint256) public lastFeelingLuckyAt;
    /**
     * Emit the prize amount to the lucky user.
     */
    event WinPrize(address indexed owner, uint256 prizeAmount);

    /*
     * Generate a new seed.
     * This will be used to generate a random number in a range between 0 - 100.
     * block.difficulty - tells miners how hard the block will be to mine based on the transactions in the block.
     * block.timestamp - the Unix timestamp that the block is being processed.
     */
    function generateSeed() internal {
        seed = (block.difficulty + block.timestamp + seed) % 100;
    }

    constructor() payable {
        /*
         * Set the initial seed
         */
        generateSeed();

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

    /**
     * This function will be called by the user to try his luck.
     * The value of the transaction is 0 because this is an internal transaction, the user never paid anything.
     *
     * All the #'s our contract can access are public and never truly "random" without using Oracles.
     * NOTE: DO NOT USE THIS IN PRODUCTION AS IT CAN BE CALLED BY ANY ADDRESS.
     * THIS IS PURELY FOR FUN ONLY.
     */
    function feelingLucky() public {
        /*
         * We need to make sure the current timestamp is at least 1-minutes bigger than the last timestamp we stored
         */
        require(
            lastFeelingLuckyAt[msg.sender] + 1 minutes < block.timestamp,
            "Wait 1 minutes before trying again."
        );

        /*
         * Update the current timestamp we have for the user
         */
        lastFeelingLuckyAt[msg.sender] = block.timestamp;

        /*
         * Generate a new seed for the next user
         */
        generateSeed();
        console.log("The new seed is %s", seed);

        /*
         * Give a 50% chance that the user wins the prize.
         */
        if (seed <= 50) {
            /*
             * Send the prize.
             */
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
            
            emit WinPrize(msg.sender, prizeAmount);
            console.log("%s won %d ether!", msg.sender, prizeAmount);
        } else {
            console.log("Good luck next time! :)");
        }
    }
}



