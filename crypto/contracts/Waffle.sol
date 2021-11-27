// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

// ============ Imports ============

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@chainlink/contracts/src/v0.8/dev/VRFConsumerBase.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract Waffle is VRFConsumerBase, IERC721Receiver {
  // ============ Immutable storage ============

  // Chainlink keyHash
  bytes32 internal immutable keyHash;
  // Chainlink fee
  uint256 internal immutable fee;
  // NFT owner
  address public immutable owner;
  // Price (in Ether) per raffle slot
  uint256 public immutable slotPrice;
  // Number of total available raffle slots
  uint256 public immutable numSlotsAvailable;
  // Address of NFT contract
  address public immutable nftContract;
  // NFT ID
  uint256 public immutable nftID;

  // ============ Mutable storage ============

  // Result from Chainlink VRF
  uint256 public randomResult = 0;
  // Toggled when contract requests result from Chainlink VRF
  bool public randomResultRequested = false;
  // Number of filled raffle slots
  uint256 public numSlotsFilled = 0;
  // Array of slot owners
  address[] public slotOwners;
  // Mapping of slot owners to number of slots owned
  mapping(address => uint256) public addressToSlotsOwned;
  // Toggled when contract holds NFT to raffle
  bool public nftOwned = false;

  // ============ Events ============

  // Address of slot claimee and number of slots claimed
  event SlotsClaimed(address indexed claimee, uint256 numClaimed);
  // Address of slot refunder and number of slots refunded
  event SlotsRefunded(address indexed refunder, uint256 numRefunded);
  // Address of raffle winner
  event RaffleWon(address indexed winner);

  // ============ Constructor ============

  constructor(
    address _owner,
    address _nftContract,
    address _ChainlinkVRFCoordinator,
    address _ChainlinkLINKToken,
    bytes32 _ChainlinkKeyHash,
    uint256 _ChainlinkFee,
    uint256 _nftID,
    uint256 _slotPrice, 
    uint256 _numSlotsAvailable
  ) VRFConsumerBase(
    _ChainlinkVRFCoordinator,
    _ChainlinkLINKToken
  ) {
    owner = _owner;
    keyHash = _ChainlinkKeyHash;
    fee = _ChainlinkFee;
    nftContract = _nftContract;
    nftID = _nftID;
    slotPrice = _slotPrice;
    numSlotsAvailable = _numSlotsAvailable;
  }

  // ============ Functions ============

  /**
   * Enables purchasing _numSlots slots in the raffle
   */
  function purchaseSlot(uint256 _numSlots) payable external {
    // Require purchasing at least 1 slot
    require(_numSlots > 0, "Waffle: Cannot purchase 0 slots.");
    // Require the raffle contract to own the NFT to raffle
    require(nftOwned == true, "Waffle: Contract does not own raffleable NFT.");
    // Require there to be available raffle slots
    require(numSlotsFilled < numSlotsAvailable, "Waffle: All raffle slots are filled.");
    // Prevent claiming after winner selection
    require(randomResultRequested == false, "Waffle: Cannot purchase slot after winner has been chosen.");
    // Require appropriate payment for number of slots to purchase
    require(msg.value == _numSlots * slotPrice, "Waffle: Insufficient ETH provided to purchase slots.");
    // Require number of slots to purchase to be <= number of available slots
    require(_numSlots <= numSlotsAvailable - numSlotsFilled, "Waffle: Requesting to purchase too many slots.");

    // For each _numSlots
    for (uint256 i = 0; i < _numSlots; i++) {
      // Add address to slot owners array
      slotOwners.push(msg.sender);
    }

    // Increment filled slots
    numSlotsFilled = numSlotsFilled + _numSlots;
    // Increment slots owned by address
    addressToSlotsOwned[msg.sender] = addressToSlotsOwned[msg.sender] + _numSlots;

    // Emit claim event
    emit SlotsClaimed(msg.sender, _numSlots);
  }

  /**
   * Deletes raffle slots and decrements filled slots
   * @dev gas optimization: could force one-tx-per-slot-deletion to prevent iteration
   */
  function refundSlot(uint256 _numSlots) external {
    // Require the raffle contract to own the NFT to raffle
    require(nftOwned == true, "Waffle: Contract does not own raffleable NFT.");
    // Prevent refunding after winner selection
    require(randomResultRequested == false, "Waffle: Cannot refund slot after winner has been chosen.");
    // Require number of slots owned by address to be >= _numSlots requested for refund
    require(addressToSlotsOwned[msg.sender] >= _numSlots, "Waffle: Address does not own number of requested slots.");

    // Delete slots
    uint256 idx = 0;
    uint256 numToDelete = _numSlots;
    // Loop through all entries while numToDelete still exist
    while (idx < slotOwners.length && numToDelete > 0) {
      // If address is not a match
      if (slotOwners[idx] != msg.sender) {
        // Only increment for non-matches. In case of match keep same to check against last idx item
        idx++;
      } else {
        // Swap and pop
        slotOwners[idx] = slotOwners[slotOwners.length - 1];
        slotOwners.pop();
        // Decrement num to delete
        numToDelete--;
      }
    }

    // Repay raffle participant
    payable(msg.sender).transfer(_numSlots * slotPrice);
    // Decrement filled slots
    numSlotsFilled = numSlotsFilled - _numSlots;
    // Decrement slots owned by address
    addressToSlotsOwned[msg.sender] = addressToSlotsOwned[msg.sender] - _numSlots;

    // Emit refund event
    emit SlotsRefunded(msg.sender, _numSlots);
  }

  /**
   * Collects randomness from Chainlink VRF to propose a winner.
   */
  function collectRandomWinner() external returns (bytes32 requestId) {
    // Require at least 1 raffle slot to be filled
    require(numSlotsFilled > 0, "Waffle: No slots are filled");
    // Require NFT to be owned by raffle contract
    require(nftOwned == true, "Waffle: Contract does not own raffleable NFT.");
    // Require caller to be raffle deployer
    require(msg.sender == owner, "Waffle: Only owner can call winner collection.");
    // Require this to be the first time that randomness is requested
    require(randomResultRequested == false, "Waffle: Cannot collect winner twice.");

    // Toggle randomness requested
    randomResultRequested = true;

    // Call for random number
    return requestRandomness(keyHash, fee);
  }

  /**
   * Collects random number from Chainlink VRF
   */
  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    // Store random number as randomResult
    randomResult = randomness;
  }

  /**
   * Disburses NFT to winner and raised raffle pool to owner
   */
  function disburseWinner() external {
    // Require that the contract holds the NFT
    require(nftOwned == true, "Waffle: Cannot disurbse NFT to winner without holding NFT.");
    // Require that a winner has been collected already
    require(randomResultRequested == true, "Waffle: Cannot disburse to winner without having collected one.");
    // Require that the random result is not 0
    require(randomResult != 0, "Waffle: Please wait for Chainlink VRF to update the winner first.");

    // Transfer raised raffle pool to owner
    payable(owner).transfer(address(this).balance);

    // Find winner of NFT
    address winner = slotOwners[randomResult % numSlotsFilled];

    // Transfer NFT to winner
    IERC721(nftContract).safeTransferFrom(address(this), winner, nftID);

    // Toggle nftOwned
    nftOwned = false;

    // Emit raffle winner
    emit RaffleWon(winner);
  }

  /**
   * Deletes raffle, assuming that contract owns NFT and a winner has not been selected
   */
  function deleteRaffle() external {
    // Require being owner to delete raffle
    require(msg.sender == owner, "Waffle: Only owner can delete raffle.");
    // Require that the contract holds the NFT
    require(nftOwned == true, "Waffle: Cannot cancel raffle without raffleable NFT.");
    // Require that a winner has not been collected already
    require(randomResultRequested == false, "Waffle: Cannot delete raffle after collecting winner.");

    // Transfer NFT to original owner
    IERC721(nftContract).safeTransferFrom(address(this), msg.sender, nftID);

    // Toggle nftOwned
    nftOwned = false;

    // For each slot owner
    for (uint256 i = numSlotsFilled - 1; i >= 0; i--) {
      // Refund slot owner
      payable(slotOwners[i]).transfer(slotPrice);
      // Pop address from slot owners array
      slotOwners.pop();
    }
  }

  /**
   * Receive NFT to raffle
   */
  function onERC721Received(
    address operator,
    address from, 
    uint256 tokenId,
    bytes calldata data
  ) external override returns (bytes4) {
    // Require NFT from correct contract
    require(from == nftContract, "Waffle: Raffle not initiated with this NFT contract.");
    // Require correct NFT ID
    require(tokenId == nftID, "Waffle: Raffle not initiated with this NFT ID.");

    // Toggle contract NFT ownership
    nftOwned = true;

    // Return required successful interface bytes
    return 0x150b7a02;
  }
}