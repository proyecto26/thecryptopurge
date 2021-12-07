// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

// Helper functions OpenZeppelin provides.
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

import "./models/Game.sol";
import "./Game.sol";

contract TheCryptoPurgeSingleModeGame is GameModel {
  TheCryptoPurgeGame game;
  BigBoss public bigBoss;

  constructor(
    TheCryptoPurgeGame _game,
    string memory bossName,
    string memory bossImageUri,
    uint bossHp,
    uint bossAttackDamage
  ) {
    console.log("TheCryptoPurgeSingleModeGame initializing...");
    // Save the ref contract
    game = _game;
    // Initialize the boss. Save it to our global "bigBoss" state variable.
    bigBoss = BigBoss({
      name: bossName,
      imageUri: bossImageUri,
      health: bossHp,
      maxHealth: bossHp,
      attackDamage: bossAttackDamage
    });
    console.log("Single Mode Game initialized :)");
  }

  function play() public {
    console.log("%s has started a new single mode purge, number of purges: %s", msg.sender, game.getNumberOfRounds());
  }

  function finish() public {
    console.log("Purge finished");
  }

  function mintCharacterNFT(uint characterIndex) external returns (uint256) {
    // Create the NFT
    return game.mintCharacterNFT(characterIndex);
  }

  function getTotalNFTMinted() public view returns (uint256) {
    return game.getTotalNFTMinted();
  }
}