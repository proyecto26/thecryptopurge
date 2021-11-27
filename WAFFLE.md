# Waffle
Waffle is a simple primitive for NFT raffles.

1. NFT Owners can specify the number of available raffle slots, and price per slot.
2. Entrants can deposit and withdraw until all slots are filled.
3. Owners can raffle the NFT and select a winner at any point (slots filled or not).

Additionally:

1. Owners can delete a raffle so long as a winner hasn't been selected.

# Architecture
Waffle.sol is a full-fledged raffle system that enables the deposit, withdrawal, and post-raffle disbursement of an ERC721 NFT. Randomness during winner selection is guaranteed through the use of a Chainlink VRF oracle.

WaffleFactory.sol is the factory deployed for child Waffle.sol instances. It simplifies the deployment of a raffle and ensures that deployers pre-fund Waffle.sol instances with the LINK necessary to retrieve a random result from the Chainlink oracle.

# Run locally
It is recommended to run the test suite against Chainlink's Kovan or Rinkeby deployments, to remove the need to simulate Chainlink VRF responses.
