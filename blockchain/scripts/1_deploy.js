const fs = require('fs');

function saveDeploymentInfo(info, filename = undefined) {
  if (!filename) {
      filename = config.deploymentConfigFile || 'moment-deployment.json'
  }

  console.log(`Writing deployment info to ${filename}`)
  const content = JSON.stringify(info, null, 2);
  fs.writeFileSync(filename, content)
}

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Owner of contract:", owner.address);

  const MomentContract = await ethers.getContractFactory("MomentContract");

  const momentContract = await MomentContract.deploy();
  await momentContract.deployed();
  console.log("momentContract deployed to:", momentContract.address);

  const deploymentInfo = {
    network: 'mumbai',
    contract: {
      name: 'MomentContract',
      address: momentContract.address,
      signerAddress: momentContract.signer.address,
      abi: momentContract.interface.format(),
    },
  };

  saveDeploymentInfo(deploymentInfo)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
