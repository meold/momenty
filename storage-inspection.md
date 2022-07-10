# Current understanding of decentralized storage

## IPFS

Statements:

- Uploads to a local node
- To store file in permanent node it must be pinned
- Pin Services are *paid*
- Pin Service / IPFS Cluster can be deployed by us in a cloud
  - also someone must pay
  - API access must be somehow restricted

Payments:

- DApp owners pay for hosting custom IPFS Cluster

Conclusion:

- Provides only building blocks, not solutions
- Needs much effort to implement it
- Flexible payment model can be build
- Flexible asset distribution can be build


## BTFS

Statements:

- Integrated with TRON
- File can be stored certain amount of days - https://docs.btfs.io/docs/btfs20-storage-rental#4btfs-upload-files-to-btfs-network
- has test network on chain id 1029 - https://github.com/bittorrent/go-btfs
- BTFS testnet gateway https://gateway-test.btfs.io/btfs/QmW9f7BAg5kWHBkPEc4qb9sEyT9RV2LKbhAqEMZb523Bsy
- test BTT can be obtained here - https://testfaucet.bt.io/#/ or https://nileex.io/join/getJoinPage (TRON network)
- JS library to easy switch between local IPFS node and Remote BTFS node - https://github.com/TRON-US/js-btfs-api (stale, last update 2020)
- TRON show example of storing NFT's assets within BTFS - https://developers.tron.network/docs/uploading-nft-metadata-to-btfs-network
- Uploading file from browser needs Offline signing mode - https://docs.btfs.io/v2.0/reference/storage-upload
  - offline signing enables DApps to use BTT from user crypto wallets (i.e. TronLink) for transacting file storage uploads


Payments:

- User continually pays for file storage in BTT
- Storage provider receives payments in BTT for hosting/storing files

Conclusion:

- Needs much effort to implement it
- Integrated with TRON
- User Pays, less flexible payment model can be built


## Wrappers: web3.storage

Statements:

- File uploading is limited to an Account owner
- Access Token must be somehow embedded to the App and as so it becomes public available.

Payments:

- Nobody pay, but has a limit in storage size

Conclusion:

- Good for POC / Hackaton
- Bad for a final product
- Payment model is unclear


## Permanent Storage Solutions: Arweave, Filecoin, BTFS

Statements:

- Store files permanently
- Looks like solutions
- Require integration with their wallets

Payments:

- User pays for file storage in chain tokens:  BTT


