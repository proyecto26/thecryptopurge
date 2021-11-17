# Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test

# run local blockchain network - other terminal
npx hardhat node
# run scripts using the local blockchain network
npx hardhat run scripts/portal-script.js --network localhost
# run scripts using a testnet blockchain network
npx hardhat run scripts/portal-script.js --network rinkeby
npx hardhat help
```

## Getting Started

### Deployed Contracts:

- **Portal script**:
  - V1 Likes: https://rinkeby.etherscan.io/address/0x0dd220E5ec89e9B05CB3D52Eb4181d81e6714ddb
  - V2 Messages: https://rinkeby.etherscan.io/address/0x05c0eb7365fF030d2C19F5986aD1Bdb35850AddB
  - V3 Feeling lucky: https://rinkeby.etherscan.io/address/0x04517F6Ac6a4D245742E27a5a0A87547260a2455
- **Game script**:
  - V1 Founds: https://rinkeby.etherscan.io/address/0xCaaAdB609709B92457cC8a72568c55ae93bDB26B
  - V2 NFTs: [TheCryptoPurgeNFT contract](https://rinkeby.etherscan.io/address/0x0AdC46DD42aD35c770e5F06B7c9042e11dFFA5D7) & [TheCryptoPurgeGame contract](https://rinkeby.etherscan.io/address/0x4dc3d802Efe4DE87A707Bc117f65d6D6DD2d0368)

## Faucet

We can grab some fake `ETH` for `Rinkeby` through a `faucet`:

| Name             | Link                                 | Amount          | Time         |
|------------------|--------------------------------------|-----------------|--------------|
| MyCrypto         | https://app.mycrypto.com/faucet      | 0.01            | None         |
| Buildspace       | https://buildspace-faucet.vercel.app | 0.025           | 1d           |
| Ethily           | https://ethily.io/rinkeby-faucet     | 0.2             | 1w           |
| Official Rinkeby | https://faucet.rinkeby.io            | 3 / 7.5 / 18.75 | 8h / 1d / 3d |

**Etherscan**: https://rinkeby.etherscan.io/

## Ideas

- Build a decentralized version of Twitter.
- Build a way for people to post their favorite memes and allow people to "tip" the people who post the best memes with ETH.
- Build a decentralized voting system that a country can use to vote in a politician where everything is open and clear.

## FAQ

- **Private key**: used as a password in order to perform a transaction, like deploying a contract to the blockchain.
- **Transactions**: perform an action that changes the blockchain. e.g: **sending ETH to someone** because we're changing account balances, **updating a variable** in our contracts because we're changing data, **Minting an NFT** because we're saving data on the contract, also **deploying a smart contract** because we need to tell miners to add our new contract to the blockchain.
- **Block difficulty**: tells miners how hard the block will be to mine based on the transactions in the block. Blocks get harder for a # of reasons, but, mainly they get harder when there are more transactions in the block.
- **Block timestamp**: an Unix timestamp that the block is being processed.
- **Alchemy**: help broadcast the contract creation transaction to be mined as quickly as possible.
- **Testnets**: a clone of **mainnet** but it uses fake money (ether, etc) for testing in a real-world scenario.
- **Rinkeby**: a **testnet** network which is run by the Ethereum foundation.
- **Etherscan**: a place that just shows us the state of the blockchain and helps us see where our transaction is at.
- **ABI**: the standard way to interact with contracts in the Ethereum ecosystem. Read about it [here](https://docs.soliditylang.org/en/v0.5.3/abi-spec.html).
- **Gas**: a cost needed to notify the miners so that the transaction can be mined. Read about it [here](https://ethereum.org/en/developers/docs/gas/).
- **ethers**: a library that helps our frontend talk to our contract.