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

      image: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false
      },

      video: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false
      }
    }
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

