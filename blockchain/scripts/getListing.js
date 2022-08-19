const PRICE = ethers.utils.parseEther("0.0001")

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Owner of contract:", owner.address);

  const MomentMarketplace = await ethers.getContractFactory("MomentMarketplace");
  const momentMarketplace = await MomentMarketplace.attach(process.env.MOMENT_MARKETPLACE_ADDRESS);

  const tx = await momentMarketplace.getListing(process.env.MOMENT_CONTRACT_ADDRESS, 1);
  console.log(tx);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
