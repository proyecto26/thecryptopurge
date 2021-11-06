// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

import "./NFT.sol";

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
  TheCryptoPurgeNFT nft;
  // NFTs minted by this contract
  mapping(uint256 => Character) public characterNFTs;

  constructor(
    TheCryptoPurgeNFT _nft,
    string[] memory characterNames,
    string[] memory characterImages,
    uint[] memory characterHealths,
    uint[] memory characterAttacks
  ) payable ERC721("TheCryptoPurge", "ePING") {
    // Initialize the NFT contract
    nft = _nft;
    // Initialize the game with default characters
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

  function mintCharacterNFT(
    string memory name,
    string memory imageUri,
    uint health,
    uint attack
  ) public returns (uint256) {
    // TODO: Save image from IPFS and send the json data to the NFT contract
    // Create the NFT
    uint256 tokenId = nft.mintNFT('');

    // Save the NFT in the storage
    characterNFTs[tokenId] = Character({
      index: tokenId,
      health: health,
      maxHealth: health,
      attack: attack,
      name: name,
      imageUri: imageUri
    });

    return tokenId;
  }
}