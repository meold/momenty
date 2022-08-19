const PRICE = ethers.utils.parseEther("0.0001")

async function main() {
  const [,buyer] = await ethers.getSigners();
  console.log("Buyer of moment:", buyer.address);

  const MomentMarketplace = await ethers.getContractFactory("MomentMarketplace");
  const momentMarketplace = await MomentMarketplace.attach(process.env.MOMENT_MARKETPLACE_ADDRESS);

  const tx = await momentMarketplace.connect(buyer).buyMoment(process.env.MOMENT_CONTRACT_ADDRESS, 1, {value: PRICE});
  const txReceipt = await tx.wait(1);
  console.log(txReceipt);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
