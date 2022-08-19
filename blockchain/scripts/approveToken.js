async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Owner of contract:", owner.address);

  const MomentContract = await ethers.getContractFactory("MomentContract");

  const momentContract = await MomentContract.attach(process.env.MOMENT_CONTRACT_ADDRESS);
  await momentContract.approve(process.env.MOMENT_MARKETPLACE_ADDRESS, 1);
  // await momentContract.setApprovalForAll(process.env.MOMENT_CONTRACT_ADDRESS, true);


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
