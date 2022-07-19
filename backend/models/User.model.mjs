import { Sequelize, Model } from 'sequelize';

export default class User extends Model {
  static modelAttributes() {
    return {
      name: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false
      },

      email: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },

      title: {
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
}

