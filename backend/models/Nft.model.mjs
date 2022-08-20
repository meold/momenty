import { Sequelize, Model } from 'sequelize';
import sections from '../../common/sections.mjs';
import { ipfsUpload } from '../helpers/Ipfs.mjs';
export default class Nft extends Model {
  static modelAttributes() {
    return {
      title: {
        type: Sequelize.DataTypes.STRING(120),
        allowNull: false
      },

      description: {
        type: Sequelize.DataTypes.STRING(400)
      },

      section: {
        type: Sequelize.DataTypes.ENUM(...sections),
        allowNull: false
      },

      image: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false
      },

      video: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false
      },

      metadataUri: {
        type: Sequelize.DataTypes.STRING(255)
      },

      isIpfsUploadFailed: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },

      tokenId: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED
      },

      price: {
        type: Sequelize.DataTypes.STRING(255)
      }
    }
  }

  async uploadIpfs() {
    const metadataUri = await ipfsUpload(
      this.image.split('/').pop(),
      this.video.split('/').pop(),
      this.name,
      this.description
    );

    if (!metadataUri) {
      await this.update({ isIpfsUploadFailed: true })
      return;
    }

    await this.update({ metadataUri });
  }

  static modelOptions(sequelize) {
    return {
      sequelize,
      freezeTableName: true
    };
  }

  static associate(sequelize) {
    this.belongsTo(sequelize.models.User, { foreignKey: 'userId', as: 'user' });
    sequelize.models.User.hasMany(this, { foreignKey: 'userId', as: 'nfts' });
  }
}

