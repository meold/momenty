async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Owner of contract:", owner.address);

  const MomentContract = await ethers.getContractFactory("MomentContract");
  const MomentSaleContract = await ethers.getContractFactory("MomentSaleContract");

  const momentContract = await MomentContract.deploy();
  await momentContract.deployed();
  console.log("momentContract deployed to:", momentContract.address);

  const momentSaleContract = await MomentSaleContract.deploy(momentContract.address);
  await momentSaleContract.deployed();
  console.log("momentSaleContract deployed to:", momentSaleContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
