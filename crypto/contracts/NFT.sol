// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

// NFT contract to inherit from.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// Helper functions OpenZeppelin provides.
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import "./libraries/Base64.sol";
import "./models/Game.sol";

// Our contract inherits from ERC721, which is the standard NFT contract.
contract TheCryptoPurgeNFT is ERC721URIStorage, GameModel {
  string constant description = 'This is a NFT that lets people play "The Crypto Purge" game with their own unique skins';
  mapping(address => uint256) public holders;
  // NFTs minted by this contract
  mapping(uint256 => Character) public characterNFTs;

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() ERC721 ("TheCryptoPurgeCollection", "ePING") {
    console.log("Collection initialized, yay!");
  }

  function getTotalCollection() public view returns (uint256) {
    return _tokenIds.current();
  }

  /**
   * Format NFT data for display
   */
  function tokenURI(uint256 _tokenId) public view override returns (string memory) {
    Character memory character = characterNFTs[_tokenId];

    string memory nftId = Strings.toString(_tokenId);
    string memory hp = Strings.toString(character.health);
    string memory maxHp = Strings.toString(character.maxHealth);
    string memory attackDamage = Strings.toString(character.attackDamage);

    /**
     * Format the data into a base64 json string
     * returns {
     *    "name" - The Crypto Purge Player
     *    "description" - A sprite of a simple character-player
     *    "image" - The url of the image
     *  }
     */
    string memory json = Base64.encode(
      bytes(string(
        abi.encodePacked(
          '{',
            '"name": "', character.name, ' -- NFT #: ', nftId, '", ',
            '"description": "', description, '", ',
            '"image": "', character.imageUri, '", ',
            '"attributes": [',
              '{ "trait_type": "Health Points", "value": "', hp, '", "max_value": "', maxHp, '" }, ',
              '{ "trait_type": "Attack Damage", "value": "', attackDamage, '" } ',
            ']',
          '}'
        )
      ))
    );
    string memory output = string(
      abi.encodePacked(
        'data:application/json;base64,',
        json
      )
    );
    return output;
  }

  function mintNFT(Character memory character) public returns (uint256) {
    // Get current tokenId.
    uint256 tokenId = _tokenIds.current();
    
    // Assigns the tokenId to the caller's wallet address.
    _safeMint(msg.sender, tokenId);

    // Set the NFT's data
    //_setTokenURI(tokenId, jsonData);

    // Save the NFT in the storage
    characterNFTs[tokenId] = Character({
      index: character.index,
      name: character.name,
      imageUri: character.imageUri,
      health: character.health,
      maxHealth: character.maxHealth,
      attackDamage: character.attackDamage
    });

    // Save NFT owner
    holders[msg.sender] = tokenId;

    // Increment counter
    _tokenIds.increment();

    console.log("NFT minted, tokenId: %s", tokenId);
    return tokenId;
  }
}