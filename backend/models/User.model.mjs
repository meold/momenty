import { Sequelize, Model } from 'sequelize';

export default class User extends Model {

  async updateNonce() {
    return this.update({ nonce: this.constructor.generateNonce() })
  }

  static generateNonce() {
    return Math.floor(Math.random() * 10**18);
  }

  static modelAttributes() {
    return {
      address: {
        type: Sequelize.DataTypes.STRING(64),
        allowNull: false,
        unique: true
      },

      nonce: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },

      name: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false
      },

      email: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },

      bio: {
        type: Sequelize.DataTypes.STRING(400),
        allowNull: true,
      },

      twitter: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: true,
      },

      site: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: true,
      }
    }
  }

  static modelOptions(sequelize) {
    return {
      sequelize,
      freezeTableName: true
    };
  }
}

