const fs = require('fs');

function saveDeploymentInfo(info, filename = undefined) {
  if (!filename) {
      filename = 'moment-deployment.json'
  }

  console.log(`Writing deployment info to ${filename}`)
  const content = JSON.stringify(info, null, 2);
  fs.writeFileSync(filename, content)
}

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Owner of contract:", owner.address);

  // const MomentContract = await ethers.getContractFactory("MomentContract");

  // const momentContract = await MomentContract.deploy();
  // await momentContract.deployed();
  // console.log("momentContract deployed to:", momentContract.address);

  // const deploymentInfo = {
  //   network: 'mumbai',
  //   contract: {
  //     name: 'MomentContract',
  //     address: momentContract.address,
  //     signerAddress: momentContract.signer.address,
  //     abi: momentContract.interface.format(),
  //   },
  // };

  // saveDeploymentInfo(deploymentInfo)

  const MarketplaceContract = await ethers.getContractFactory("MomentMarketplace");

  const momentMarketplace = await MarketplaceContract.deploy();
  await momentMarketplace.deployed();
  console.log("momentMarketplace deployed to:", momentMarketplace.address);

  const deploymentMarketInfo = {
    network: 'mumbai',
    contract: {
      name: 'MomentMarketplace',
      address: momentMarketplace.address,
      signerAddress: momentMarketplace.signer.address,
      abi: momentMarketplace.interface.format(),
    },
  };

  saveDeploymentInfo(deploymentMarketInfo, 'marketplace-deployment.json')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
