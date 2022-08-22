import 'dotenv/config';
import sequelize from '../plugins/sequelize.mjs';
import Sequelize from 'sequelize';
import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ABI = JSON.parse(fs.readFileSync(path.resolve(path.join(__dirname, '../../frontend/src/artifacts/MomentContract.json'))).toString());

const contractAddress = '0x2dCE49EF20f99B0AC09D175C0B6ceD27e4a751e7';
const ETH_PRIVATE_KEY = 'xxx'; // FIXME

const sqz = await sequelize({
  connection: process.env.SQL_CONNECTION
});

const ethProvider = new ethers.providers.StaticJsonRpcProvider('https://rpc-mumbai.maticvigil.com');
const signer = new ethers.Wallet(ETH_PRIVATE_KEY, ethProvider);

const contract = new ethers.Contract(contractAddress, ABI, signer);

async function doo() {
  const nft = await sqz.models.Nft.findOne({
    where: { metadataUri: { [Sequelize.Op.not]: null } , tokenId: null },
    include: [
      {
        model: sqz.models.User,
        as: 'author',
        attributes: ['address']
      }
    ],
    order: [
      ['id', 'DESC']
    ]
  });

  if (nft) {
    console.log('nft', nft.id)
    const transaction = await contract.mint(nft.author.address, nft.metadataUri, { gasLimit: 300000, gasPrice: ethers.utils.parseUnits('40', 'gwei')});
    console.log(transaction);
    const receipt = await transaction.wait();
    console.log(receipt);
    let tokenId = null;
    for (const event of receipt.events) {
      if (event.event === "Transfer") {
        tokenId = event.args.tokenId.toString();
      }
    }
    if (tokenId) {
      console.log('tokenId', tokenId)
      await nft.update({ tokenId });

      await doo();
    }
  }
}


doo();

console.log('Done');