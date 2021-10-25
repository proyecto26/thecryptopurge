// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Game is ERC721 {
  uint256 numberOfRounds;

  struct CharacterAttributes {
    uint index;
    uint health;
    uint maxHealth;
    uint attack;

    string name;
    string imageUri;
  }

  CharacterAttributes[] characters;

  constructor(
    string[] memory characterNames,
    string[] memory characterImages,
    uint[] memory characterHealths,
    uint[] memory characterAttacks
  ) ERC721("TheCryptoPurge", "ePING")
  {
    console.log("Game initialized :)");
  }

  function play() public {
    numberOfRounds += 1;
    console.log("%s has started a new round, number of rounds: %s", msg.sender, numberOfRounds);
  }

  function getNumberOfRounds() public view returns (uint256) {
    return numberOfRounds;
  }

  /*function mintCharacterNFT(
    string memory name,
    string memory imageUri,
    uint health,
    uint attack
  ) public returns (uint256) {
    uint256 characterIndex = characters.length;
    CharacterAttributes memory character = CharacterAttributes(
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