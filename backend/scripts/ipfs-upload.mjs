import 'dotenv/config';
import sequelize from '../plugins/sequelize.mjs';

const sqz = await sequelize({
  connection: process.env.SQL_CONNECTION
});

async function doo() {
  const nft = await sqz.models.Nft.findOne({ where: { metadataUri: null } });
  console.log(nft.id)
  if (nft) {
    await nft.uploadIpfs();
    await doo();
  }
}

doo();

console.log('Done');