import { Sequelize, Model } from 'sequelize';
import sections from '../../common/sections.mjs';
export default class Nft extends Model {
  static modelAttributes() {
    return {
      title: {
        type: Sequelize.DataTypes.STRING(120),
        allowNull: false
      },

      description: {
        type: Sequelize.DataTypes.STRING(400),
        allowNull: false,
        unique: true
      },

      section: {
        type: Sequelize.DataTypes.ENUM(...sections),
        allowNull: false
      },

      imageData: {
        type: Sequelize.DataTypes.BLOB('medium')
      },

     imageMimeType: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false
      },

      videoData: {
        type: Sequelize.DataTypes.BLOB('long')
      },

      videoMimeType: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false
      },
    }
  }

  static modelOptions(sequelize) {
    return {
      sequelize,
      freezeTableName: true
    };
  }
}

