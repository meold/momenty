require("dotenv").config();

require("@nomiclabs/hardhat-waffle");

const { BigNumber } = require("ethers");

function expandTo18Decimals(n) {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(18));
}

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "mumbai",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    rinkeby: {
      url: process.env.RINKEBY_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [`${process.env.PRIVATE_KEY}`],
      saveDeployments: true,
    },
  },
};
