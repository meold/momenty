import { Sequelize, Model } from 'sequelize';

export class Nft extends Model {
  static structure = {
    title: {
      type: Sequelize.DataTypes.STRING(120),
      allowNull: false
    },

    description: {
      type: Sequelize.DataTypes.STRING(400),
      allowNull: false,
      unique: true
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

  static options = {

  }
}

