const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
const { CHAIN_DEVS_NFT_CONTRACT_ADDRESS } = require("../constants");


async function main() {
  // Deploy the FakeNFTMarketplace contract first
  const FakeNFTMarketplace = await ethers.getContractFactory(
    "FakeNFTMarketplace"
  );
  const fakeNftMarketplace = await FakeNFTMarketplace.deploy();
  await fakeNftMarketplace.deployed();

  console.log("FakeNFTMarketplace deployed to: ", fakeNftMarketplace.address);

  // Now deploy the ChainDevsDAO contract
  const ChainDevsDAO = await ethers.getContractFactory("ChainDevsDAO");
  const chainDevsDAO = await ChainDevsDAO.deploy(
    fakeNftMarketplace.address,
    CHAIN_DEVS_NFT_CONTRACT_ADDRESS,
    {
      // This assumes your account has at least 1 ETH in it's account
      // Change this value as you want
      value: ethers.utils.parseEther("1"),
    }
  );
  await chainDevsDAO.deployed();

  console.log("ChainDevsDAO deployed to: ", chainDevsDAO.address);

  console.log("Sleeping");
  // Wait for etherscan to notice that the contract has been deployed
  await sleep(50000);

  // Verify the contract after deploying
  await hre.run("verify:verify", {
    address: chainDevsDAO.address,
    constructorArguments: [fakeNftMarketplace.address,
      CHAIN_DEVS_NFT_CONTRACT_ADDRESS],
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });