import { Sequelize, Model } from 'sequelize';

export class User extends Model {
  static structure = {
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

  static options = {

  }
}

