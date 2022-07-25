var MomentContract = artifacts.require("./MomentContract.sol");
var MomentSaleContract = artifacts.require("./MomentSaleContract.sol");

module.exports = function(deployer) {
  console.log('!!!!')

  await deployer.deploy(MomentContract);
  console.log("momentContract deployed to:", MomentContract.address);

  await deployer.deploy(MomentSaleContract, MomentContract.address);
  console.log("momentSaleContract deployed to:", MomentSaleContract.address);
};
