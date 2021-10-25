// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TheCryptoPurgeNFT is ERC721URIStorage {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() ERC721 ("TheCryptoPurgeCollection", "ePING") {
    console.log("Collection initialized, yay!");
  }

  function makeNFT() public {
    // Get token id
    uint256 tokenId = _tokenIds.current();
    
    // Mint NFT
    _safeMint(msg.sender, tokenId);

    // Set the NFT's data
    /**
     *  {
     *    "name": "The Crypto Purge Player",
     *    "description": "A sprite of a simple character-player",
     *    "image": "https://raw.githubusercontent.com/proyecto26/Phaser-Workshop/client-server/client/assets/images/player.png"
     *  }
     */
    _setTokenURI(tokenId, "https://jsonkeeper.com/b/OGGV");

    // Increment counter
    _tokenIds.increment();

    console.log("NFT minted, tokenId: %s", tokenId);
  }
}