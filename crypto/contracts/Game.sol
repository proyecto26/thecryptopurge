// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

contract TheCryptoPurgeGame is ERC721 {
  uint256 numberOfRounds;

  struct Character {
    uint index;
    uint health;
    uint maxHealth;
    uint attack;
    string name;
    string imageUri;
  }

  Character[] characters;

  constructor(
    string[] memory characterNames,
    string[] memory characterImages,
    uint[] memory characterHealths,
    uint[] memory characterAttacks
  ) payable ERC721("TheCryptoPurge", "ePING") {
    for (uint i = 0; i < characterNames.length; i++) {
      Character memory character = Character({
        index: i,
        health: characterHealths[i],
        maxHealth: characterHealths[i],
        attack: characterAttacks[i],
        name: characterNames[i],
        imageUri: characterImages[i]
      });
      characters.push(character);
    }
    console.log("Game initialized :)");
  }

  function play() public {
    numberOfRounds += 1;
    console.log("%s has started a new round, number of rounds: %s", msg.sender, numberOfRounds);
  }

  function getNumberOfRounds() public view returns (uint256) {
    return numberOfRounds;
  }

  function finish() public {
    console.log("Game finished");

    // Send ETH to winners
    uint256 prizeAmount = 0.0001 ether;
    // Check if balance of the contract is bigger than the prize amount, otherwise kill the transaction
    require(
      prizeAmount <= address(this).balance,
      "Trying to withdraw more money than the contract has."
    );
    // Send the money
    (bool success, ) = (msg.sender).call{value: prizeAmount}("");
    // Check the status of the transaction
    require(success, "Failed to withdraw money from contract.");
  }

  /*function mintCharacterNFT(
    string memory name,
    string memory imageUri,
    uint health,
    uint attack
  ) public returns (uint256) {
    uint256 characterIndex = characters.length;
    Character memory character = Character(
      characterIndex,
      health,
      health,
      attack,
      name,
      imageUri
    );
    characters.push(character);
    return characterIndex;
  }*/
}