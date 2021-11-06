// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TheCryptoPurgeNFT is ERC721URIStorage {
  mapping(address => uint256) public holders;

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() ERC721 ("TheCryptoPurgeCollection", "ePING") {
    console.log("Collection initialized, yay!");
  }

  function getTotalCollection() public view returns (uint256) {
    return _tokenIds.current();
  }

  function mintNFT(string memory jsonData) public returns (uint256) {
    // Get token id
    uint256 tokenId = _tokenIds.current();
    
    // Mint NFT
    _safeMint(msg.sender, tokenId);

    // Set the NFT's data
    _setTokenURI(tokenId, jsonData);

    // Save NFT owner
    holders[msg.sender] = tokenId;

    // Increment counter
    _tokenIds.increment();

    console.log("NFT minted, tokenId: %s", tokenId);
    return tokenId;
  }
}