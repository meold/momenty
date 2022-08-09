import { Model } from 'sequelize';
export default class Like extends Model {
  static modelAttributes() {
    return {

    }
  }

  static modelOptions(sequelize) {
    return {
      sequelize,
      freezeTableName: true
    };
  }

  static associate(sequelize) {
    sequelize.models.Nft.belongsToMany(sequelize.models.User, { through: this, foreignKey: 'nftId', as: 'likers' });
    sequelize.models.User.belongsToMany(sequelize.models.Nft, { through: this, foreignKey: 'userId', as: 'liked' });
    sequelize.models.Nft.hasMany(this, { foreignKey: 'nftId', as: 'likes' });
  }
}

