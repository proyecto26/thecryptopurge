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
  - Etherscan link: https://rinkeby.etherscan.io/address/0x0dd220E5ec89e9B05CB3D52Eb4181d81e6714ddb



## Faucet

We can grab some fake `ETH` for `Rinkeby` through a `faucet`:

| Name             | Link                                 | Amount          | Time         |
|------------------|--------------------------------------|-----------------|--------------|
| MyCrypto         | https://app.mycrypto.com/faucet      | 0.01            | None         |
| Buildspace       | https://buildspace-faucet.vercel.app | 0.025           | 1d           |
| Ethily           | https://ethily.io/rinkeby-faucet     | 0.2             | 1w           |
| Official Rinkeby | https://faucet.rinkeby.io            | 3 / 7.5 / 18.75 | 8h / 1d / 3d |

**Etherscan**: https://rinkeby.etherscan.io/

## FAQ

- **Private key**: used as a password in order to perform a transaction, like deploying a contract to the blockchain.
- **Transactions**: perform an action on the Ethereum blockchain. e.g: sending ETH to someone, updating a variable in our contracts, also deploying a smart contract.
- **Alchemy**: help broadcast the contract creation transaction to be mined as quickly as possible.
- **Testnets**: a clone of **mainnet** but it uses fake money (ether, etc) for testing in a real-world scenario.
- **Rinkeby**: a **testnet** network which is run by the Ethereum foundation.
- **Etherscan**: a place that just shows us the state of the blockchain and helps us see where our transaction is at.