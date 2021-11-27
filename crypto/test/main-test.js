const { expect } = require("chai");
const { network } = require("hardhat");

// Setup global variables
const KOVAN_RPC = "";

// Setup addresses
const ChainlinkFee = 0.1 * 10 ** 18;
const ChainlinkKeyHash =
  "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4";
const ChainlinkLinkAddress = "0xa36085F69e2889c224210F603D836748e7dC0088";
const ChainlinkVRFCoordinator = "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9";

async function deploy() {}

/**
 * Returns impersonated signer
 * @param {string} account to impersonate
 * @returns {ethers.Signer} authenticated as account
 */
async function impersonateSigner(account) {
  // Impersonate account
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [account],
  });

  // Return ethers signer
  return await ethers.provider.getSigner(account);
}

describe("Waffle", function () {
  beforeEach(async () => {
    // Reset hardhat
    await network.provider.request({
      method: "hardhat_reset",
      params: [
        {
          url: KOVAN_RPC,
          blockNumber: 25725290,
        },
      ],
    });

    // Deploy contracts
    await deploy();
  });
});