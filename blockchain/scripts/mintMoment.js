async function main() {
  const MomentContract = await ethers.getContractFactory("MomentContract");
  const momentContract = await MomentContract.attach(process.env.MOMENT_CONTRACT);

  const res1 = await momentContract.momentMetadata(0);
  console.log(res1);

  const MomentSaleContract = await ethers.getContractFactory("MomentSaleContract");
  const momentSaleContract = await MomentSaleContract.attach("0xFE6946500Afb7C2f3B8B45D77AfbE4CE07541cEa");

  const res2 = await momentSaleContract.momentMetadata(0);
  console.log(res2);
  // const momentId = await momentContract.mint(
  //   "MMNT2",
  //   "A brief intro about the amazing moment.",
  //   "https://main-nftmoments-incoming-media.s3.eu-central-1.amazonaws.com/d78a31bf-fefd-4d5c-8de8-1f4d648763e7.png",
  //   "https://main-nftmoments-incoming-media.s3.eu-central-1.amazonaws.com/80c0f263-a162-4ec0-96ca-23cef32e5fad.mp4",
  //   0
  // );

  // console.log(momentId);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
