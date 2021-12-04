// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

// NFT contract to inherit from.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// Helper functions OpenZeppelin provides.
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

import "./models/Game.sol";
import "./NFT.sol";

contract TheCryptoPurgeGame is ERC721, GameModel {
  uint256 numberOfRounds;
  Character[] characters;
  TheCryptoPurgeNFT nft;

  constructor(
    TheCryptoPurgeNFT _nft,
    string[] memory characterNames,
    string[] memory characterImages,
    uint[] memory characterHealths,
    uint[] memory characterAttacks
  ) payable ERC721("TheCryptoPurge", "ePING") {
    console.log("TheCryptoPurgeGame initializing...");
    // Save the NFT contract
    nft = _nft;
    // Initialize the game with default characters
    for (uint i = 0; i < characterNames.length; i++) {
      Character memory character = Character({
        index: i,
        health: characterHealths[i],
        maxHealth: characterHealths[i],
        attackDamage: characterAttacks[i],
        name: characterNames[i],
        imageUri: characterImages[i]
      });
      characters.push(character);
      console.log("Done initializing %s w/ HP %s, img %s", character.name, character.health, character.imageUri);
    }
    console.log("Game initialized :)");
  }

  function getCharacters() public view returns (Character[] memory) {
    return characters;
  }

  function play() public {
    numberOfRounds += 1;
    console.log("%s has started a new round, number of rounds: %s", msg.sender, numberOfRounds);
  }

  function getNumberOfRounds() public view returns (uint256) {
    return numberOfRounds;
  }

  function finish() public {
    console.log("Round finished");

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

  function mintCharacterNFT(uint characterIndex) external returns (uint256) {
    require(
      characterIndex >= 0 && characterIndex < characters.length,
      "Character index out of bounds."
    );
    Character memory character = characters[characterIndex];
    // Create the NFT
    return nft.mintNFT(character);
  }

  function getTotalNFTMinted() public view returns (uint256) {
    return nft.getTotalCollection();
  }
}