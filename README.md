# momenty
Momenty

Contract notes:

- deploy contract
`HARDHAT_NETWORK=mumbai PRIVATE_KEY=xxx npx hardhat run 1_deploy.js`

- mint Moment
`HARDHAT_NETWORK=mumbai PRIVATE_KEY=xxx node cli.mjs mint <PATH_TO_IMAGE> <PATH_TO_VIDEO> --name Moment1 --description 'A small brief description' -o <OWNER_ADDRESS>`

- sell token
1. approveToken.js
2. listMoment.js
3. getListing.js